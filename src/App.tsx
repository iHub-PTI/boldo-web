import React, { useEffect, createContext, useState, useContext, useRef } from 'react'
import axios from 'axios'
import { Route, Switch, Redirect } from 'react-router-dom'
import io from 'socket.io-client'

import Call from './pages/Call'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

import './styles.output.css'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.REACT_APP_SERVER_ADDRESS

export const UserContext = createContext<{ type: string; id: string; name: string; email: string } | null>(null)

const App = () => {
  const [user, setUser] = useState(null)

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
        const res = await axios.get('/me')
        setUser(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    effect()
  }, [])

  if (!user) return <div className='h-1 fakeload-15 bg-primary-500' />

  return (
    <UserContext.Provider value={user}>
      <Sockets>
        <Rooms>
          <div className='antialiased App'>
            <Switch>
              <Route exact path='/'>
                <Dashboard />
              </Route>

              <Route exact path='/settings'>
                <Settings />
              </Route>

              <Route exact path='/call'>
                <Call />
              </Route>

              <Route>
                <Redirect to='/' />
              </Route>
            </Switch>
          </div>
        </Rooms>
      </Sockets>
    </UserContext.Provider>
  )
}

export default App

//
// ////////////////////////////////////////////////////////////////////////////
//                                 Sockets
// ////////////////////////////////////////////////////////////////////////////
//

export const SocketContext = createContext<SocketIOClient.Socket | undefined>(undefined)

const Sockets: React.FC = ({ children }) => {
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
  setAppointments?: (appointments: Boldo.Appointment[]) => void
}>({ rooms: [] })

export const Rooms: React.FC = ({ children }) => {
  const [rooms, setRooms] = useState<string[]>([])
  const [appointments, setAppointments] = useState<Boldo.Appointment[]>([])
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

  return <RoomsContext.Provider value={{ rooms, setAppointments }}>{children}</RoomsContext.Provider>
}
