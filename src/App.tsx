import React, { useEffect, createContext, useState, useContext, useRef, useMemo } from 'react'
import axios from 'axios'
import { Route, Switch, Redirect } from 'react-router-dom'
import io from 'socket.io-client'

import Call from './pages/Call'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import { ToastProvider } from './components/Toast'

import './styles.output.css'

type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.REACT_APP_SERVER_ADDRESS

export const UserContext = createContext<{
  user: Boldo.Doctor | undefined
  updateUser: (arg: Partial<Boldo.Doctor>) => void
}>({
  user: undefined,
  updateUser: async () => {},
})

const App = () => {
  const [user, setUser] = useState<Boldo.Doctor | undefined>()

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response.status === 401 && error.response?.data?.message) {
          window.location.href = error.response.data.message
          delete error.response.data.message
        }
        return Promise.reject(error)
      }
    )
  }, [])

  useEffect(() => {
    const effect = async () => {
      try {
        const res = await axios.get('/profile/doctor')
        setUser(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    effect()
  }, [])

  const updateUser = (arg: Partial<Boldo.Doctor>) => {
    setUser(user => (user ? { ...user, ...arg } : undefined))
  }

  if (!user) return <div className='h-1 fakeload-15 bg-primary-500' />

  return (
    <ToastProvider>
      <UserContext.Provider value={{ user, updateUser }}>
        <SocketsProvider>
          <RoomsProvider>
            <div className='antialiased App'>
              <Switch>
                <Route exact path='/'>
                  <Dashboard />
                </Route>

                <Route exact path='/settings'>
                  <Settings />
                </Route>

                <Route exact path='/appointments/:id/call'>
                  <Call />
                </Route>

                <Route>
                  <Redirect to='/' />
                </Route>
              </Switch>
            </div>
          </RoomsProvider>
        </SocketsProvider>
      </UserContext.Provider>
    </ToastProvider>
  )
}

export default App

//
// ////////////////////////////////////////////////////////////////////////////
//                                 Sockets
// ////////////////////////////////////////////////////////////////////////////
//

export const SocketContext = createContext<SocketIOClient.Socket | undefined>(undefined)

const SocketsProvider: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setRerender] = useState(false)
  const socket = useRef<SocketIOClient.Socket>()

  useEffect(() => {
    const cleanup = () => {
      socket.current?.disconnect()
    }

    if (socket.current) return cleanup

    socket.current = io.connect(process.env.REACT_APP_SOCKETS_ADDRESS!)
    setRerender(rerender => !rerender)

    return cleanup
  }, [])

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>
}

//
// ////////////////////////////////////////////////////////////////////////////
//                                  Rooms
// ////////////////////////////////////////////////////////////////////////////
//

export const RoomsContext = createContext<{
  rooms: string[]
  setAppointments?: (appointments: AppointmentWithPatient[]) => void
  appointments: AppointmentWithPatient[]
}>({ rooms: [], appointments: [] })

export const RoomsProvider: React.FC = ({ children }) => {
  const [rooms, setRooms] = useState<string[]>([])
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([])
  const socket = useContext(SocketContext)

  useEffect(() => {
    if (!socket) return

    socket.on('patient ready', (appointmentId: string) => {
      setRooms(rooms => {
        if (rooms.find(e => e === appointmentId)) return rooms
        return [...(rooms || []), appointmentId]
      })
    })

    socket.on('peer not ready', (appointmentId: string) => {
      setRooms(rooms => rooms.filter(e => e !== appointmentId))
      socket.emit('find patients', [appointmentId])
    })

    return () => {
      socket.off('patient ready')
      socket.off('peer not ready')
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return

    socket?.emit(
      'find patients',
      appointments.map(e => e.id)
    )
  }, [socket, appointments])

  const value = useMemo(() => ({ rooms, appointments, setAppointments }), [appointments, rooms])

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
}
