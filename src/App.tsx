import React, { useEffect, createContext, useState, useContext, useRef, useMemo } from 'react'
import axios from 'axios'
import { Route, Switch, Redirect } from 'react-router-dom'
import io from 'socket.io-client'

import Call from './pages/Call'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ValidatePatient from './pages/ValidatePatient'
import PrivacyPolicy from './components/PrivacyPolicy'
import Error from './components/Error'
import { ToastProvider } from './components/Toast'

import './styles.output.css'
import InPersonAppoinment from './pages/inperson/InPersonAppoinment'
import { Download } from './pages/Download'
import * as Sentry from "@sentry/react";
import { PrescriptionContextProvider } from './contexts/Prescriptions/PrescriptionContext'
import { OrganizationContext } from "../src/contexts/Organizations/organizationSelectedContext"
import { AllOrganizationContext } from './contexts/Organizations/organizationsContext'
import { changeHours } from './util/helpers'

type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient } & {organization: Boldo.Organization}

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
  const [error, setError] = useState(false)
  // Context API Organization Boldo MultiOrganization
  const { setOrganization } = useContext(OrganizationContext)
  const { setOrganizations } = useContext(AllOrganizationContext)

  useEffect(() => {
    if (window.location.pathname !== "/boldo-app-privacy-policy" && window.location.pathname !== '/download') {
      axios.interceptors.response.use(
        response => response,
        async error => {
          if (error.response?.status === 401 && error.response?.data?.message) {
            window.location.href = error.response.data.message
            delete error.response.data.message
          }
          return Promise.reject(error)
        }
      )
    } else {
      setError(false)
    }
  }, [])

  useEffect(() => {
    const effect = async () => {
      const url = '/profile/doctor'
      try {
        const res = await axios.get(url)
        setUser(res.data)
        //console.log(res.data)
        Sentry.setUser({ id: res.data.id })
      } catch (err) {
        console.log(err)
        Sentry.setTag("endpoint", url);
        Sentry.setTag("method_used", "GET")
        if (err.response) {
          // La respuesta fue hecha y el servidor respondió con un código de estado
          // que esta fuera del rango de 2xx
          Sentry.setTag('data', err.response.data);
          Sentry.setTag('headers', err.response.headers);
          Sentry.setTag('status_code', err.response.status);
        } else if (err.request) {
          // La petición fue hecha pero no se recibió respuesta
          Sentry.setTag('request', err.request);
          console.log(err.request);
        } else {
          // Algo paso al preparar la petición que lanzo un Error
          Sentry.setTag('message', err.message);
          console.log('Error', err.message);
        }
        Sentry.captureMessage("could not get the profile of the doctor")
        Sentry.captureException(err)
        // here the error is critical, therefore we show the Error component
        if (err?.response?.status !== 401) setError(true)
      }
    }
    if (window.location.pathname !== "/boldo-app-privacy-policy" && window.location.pathname !== '/download') {
      effect()
    } else {
      setError(false)
    }
  }, [])

  // load the organization
  useEffect(() => {
    const url = '/profile/doctor/organizations';
    axios.get(
      url
    )
    .then(function (res) {
      if (res.status === 200) {
        // set all the organizations in the context
        setOrganizations([...res.data]);
        // for default we use the first organization as the selectetd
        setOrganization(res.data[0]);
      } else if (res.status === 204) {
        // when the response is 204 it means that there is no organization
        setOrganizations([])
      }
    })
    .catch(function (err) {
      console.log("when obtain organizations ", err);
      Sentry.setTag("endpoint", url);
      if (err.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx
        Sentry.setTag('data', err.response.data);
        Sentry.setTag('headers', err.response.headers);
        Sentry.setTag('status_code', err.response.status);
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        Sentry.setTag('request', err.request);
        console.log(err.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error
        Sentry.setTag('message', err.message);
        console.log('Error', err.message);
      }
      Sentry.captureMessage('Could not get organizations')
      Sentry.captureException(err)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = (arg: Partial<Boldo.Doctor>) => {
    setUser(user => (user ? { ...user, ...arg } : undefined))
  }

  if (error) return <Error />
  if (!user && window.location.pathname !== "/boldo-app-privacy-policy" && window.location.pathname !== '/download') return <div className='h-1 fakeload-15 bg-primary-500' />

  return (
    <ToastProvider>
      <UserContext.Provider value={{ user, updateUser }}>
        <SocketsProvider>
          <RoomsProvider>
            <div className='antialiased App'>
              <Switch>
                <Route exact path='/'>
                  <PrescriptionContextProvider>
                    <Dashboard />
                  </PrescriptionContextProvider>
                </Route>

                <Route exact path='/settings'>
                  <Settings />
                </Route>

                <Route exact path='/validate'>
                  <ValidatePatient />
                </Route>

                <Route exact path='/appointments/:id/call'>
                  <PrescriptionContextProvider>
                    <Call />
                  </PrescriptionContextProvider>
                </Route>

                <Route exact path='/appointments/:id/inperson'>
                  <PrescriptionContextProvider>
                    <InPersonAppoinment />
                  </PrescriptionContextProvider>
                </Route>

                <Route exact path='/boldo-app-privacy-policy'>
                  <PrivacyPolicy />
                </Route>

                <Route exact path='/download'>
                  <Download />
                </Route>

                <Route>
                  <Redirect to='/' />
                </Route>

                {/* <Route exact path='/settingsnew'>
                <SettingsNew />
              </Route>

              <Route exact path='/home'>
                <Home />
              </Route> */}

              </Switch>
            </div>
          </RoomsProvider>
        </SocketsProvider>
      </UserContext.Provider>
    </ToastProvider>
  )
}

export default Sentry.withProfiler(App)

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

export const RoomsContext = createContext<{ rooms: AppointmentWithPatient[] }>({ rooms: [] })

export const RoomsProvider: React.FC = ({ children }) => {
  const [rooms, setRooms] = useState<AppointmentWithPatient[]>([])
  const appointments = useRef<AppointmentWithPatient[]>()
  const token = useRef<string>()
  const socket = useContext(SocketContext)
  // Context API Organization Boldo MultiOrganization
  const { Organization } = useContext(OrganizationContext)
  const { Organizations } = useContext(AllOrganizationContext)


  useEffect(() => {
    if (!socket) return

    socket.on('patient ready', (appointmentId: string) => {
      setRooms(rooms => {
        if (rooms.find(e => e.id === appointmentId)) return rooms

        if (!appointments.current) {
          console.log(`'patient ready' for appointmentId: #{appointmentId}, but appointments are empty`)
          return rooms
        }

        const appointment = appointments.current.find(appointment => appointment.id === appointmentId)
        if (!appointment) {
          console.log(`'patient ready' for appointmentId: #{appointmentId}, but no matching appointment`)
          return rooms
        }

        return [...(rooms || []), appointment]
      })
    })

    socket.on('peer not ready', (appointmentId: string) => {
      setRooms(rooms => rooms.filter(e => e.id !== appointmentId))
      socket.emit('find patients', { rooms: [appointmentId], token: token.current })
    })

    return () => {
      socket.off('patient ready')
      socket.off('peer not ready')
    }
  }, [socket])

  // this find patients in waiting room
  useEffect(() => {
    if (!socket) return

    let today = Date.now()
    let hours = 2

    const load = async () => {
      const url = '/profile/doctor/appointments?status=open'
      await axios.get<{ appointments: AppointmentWithPatient[]; token: string }>(
        url, {
          params: {
            start: changeHours(new Date(today), hours, 'subtract'),
            end: changeHours(new Date(today), hours, 'add')
          }
        }
      )
      .then((res) => {
        token.current = res.data.token
        appointments.current = res.data.appointments
        if (appointments.current?.length) {
          socket?.emit('find patients', { rooms: appointments.current.map(e => e.id), token: token.current })
        }
      })
      .catch((err) => {
        Sentry.setTags({
          'endpoint': url,
          'method': 'GET',
          'org_id': Organization.id
        })
        if (err.response) {
          // The response was made and the server responded with a 
          // status code that is outside the 2xx range.
          Sentry.setTag('data', err.response.data)
          Sentry.setTag('headers', err.response.headers)
          Sentry.setTag('status_code', err.response.status)
        } else if (err.request) {
          // The request was made but no response was received
          Sentry.setTag('request', err.request)
        } else {
          // Something happened while preparing the request that threw an Error
          Sentry.setTag('message', err.message)
        }
        Sentry.captureMessage("Could not get appointments for waiting room")
        Sentry.captureException(err)
      })
    }

    Organization && load()

    const timer = setInterval(() => load(), 60800)
    return () => clearInterval(timer)
  }, [socket, Organizations, Organization])

  const value = useMemo(() => ({ rooms }), [rooms])

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
}
