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
import OrderStudyImportedProvider from './contexts/OrderImportedContext'
import AttachmentFilesProvider from './contexts/AttachmentFiles'
import AttachmentFilesFormProvider from './contexts/AttachmentFilesForm'
import { changeHours } from './util/helpers'
import Provider from './components/studiesorder/Provider'
import handleSendSentry from './util/Sentry/sentryHelper'
import { ERROR_HEADERS } from './util/Sentry/errorHeaders'
import TermsOfService from './components/TermsOfService'
import { useKeycloak } from "@react-keycloak/web";

type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient } & {organization: Boldo.Organization}

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_SERVER_ADDRESS;
axios.defaults.maxRedirects = 0;

export const UserContext = createContext<{
  user: Boldo.Doctor | undefined
  updateUser: (arg: Partial<Boldo.Doctor>) => void
}>({
  user: undefined,
  updateUser: async () => {},
})

const App = () => {

  const ALLOWED_ROUTES = ["/boldo-app-privacy-policy", "/boldo-app-terms-of-service", "/download"];

  const [user, setUser] = useState<Boldo.Doctor | undefined>();
  const [error, setError] = useState(false);

  // Context API Organization Boldo MultiOrganization
  const { setOrganization } = useContext(OrganizationContext);
  const { setOrganizations } = useContext(AllOrganizationContext);
  const { keycloak } = useKeycloak();

  axios.defaults.headers = { 
    "Authorization": `Bearer ${keycloak.token}`,
    "Access-Control-Allow-Origin": "*"
  }

  useEffect(() => {
    if (!ALLOWED_ROUTES.includes(window.location.pathname)) {
      axios.interceptors.response.use(
        response => response,
        async error => {
          if (error.response) {
            if (error.response.status === 401 && error.response.data?.message) {
              window.location.href = error.response.data.message
              delete error.response.data.message
            }
            // The response was made and the server responded with a 
            // status code that is outside the 2xx range.
            Sentry.setTags({
              'data': error.response.data,
              'headers': error.response.headers,
              'status_code': error.response.status
            })
          } 
          else if (error.request) {
            // The request was made but no response was received
            Sentry.setTag('request', error.request)
          } 
          else {
            // Something happened while preparing the request that threw an Error
            Sentry.setTag('message', error.message)
          }
          if (error?.response?.status !== 401) Sentry.captureException(error)
          return Promise.reject(error)
        }
      )
    } 
    else {
      setError(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const effect = async () => {
      const url = '/profile/doctor'
      try {
        const res = await axios.get(url)
        setUser(res.data)
        //console.log(res.data)
        Sentry.setUser({ id: res.data.id, email: res.data.email, username: res.data.identifier })
      } 
      catch (err) {
        console.log(err)
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        handleSendSentry(err, ERROR_HEADERS.DOCTOR.FAILURE_GET_PROFILE, tags)
      }
    }
    if (!ALLOWED_ROUTES.includes(window.location.pathname)) {
      effect()
    } 
    else {
      setError(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        Sentry.setTag('organization_current', res.data[0] ?? '')
      } 
      else if (res.status === 204) {
        // when the response is 204 it means that there is no organization
        setOrganizations([])
      }
    })
    .catch(function (err) {
      console.log("when obtain organizations ", err);
      const tags = {
        "endpoint": url,
        "method": "GET"
      }
      handleSendSentry(err, ERROR_HEADERS.ORGANIZATION.FAILURE_GET, tags)
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUser = (arg: Partial<Boldo.Doctor>) => {
    setUser(user => (user ? { ...user, ...arg } : undefined))
  }

  if (error) return <Error />
  if (!user && !ALLOWED_ROUTES.includes(window.location.pathname)) return <div className='h-1 fakeload-15 bg-primary-500' />

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
                    <Provider>
                      <Call />
                    </Provider>
                  </PrescriptionContextProvider>
                </Route>

                <Route exact path='/appointments/:id/inperson'>
                  <PrescriptionContextProvider>
                    <Provider>
                      <OrderStudyImportedProvider>
                        <AttachmentFilesProvider>
                          <AttachmentFilesFormProvider>
                            <InPersonAppoinment />
                          </AttachmentFilesFormProvider>
                        </AttachmentFilesProvider>
                      </OrderStudyImportedProvider>
                    </Provider>
                  </PrescriptionContextProvider>
                </Route>

                <Route exact path='/boldo-app-privacy-policy'>
                  <PrivacyPolicy />
                </Route>

                <Route exact path='/boldo-app-terms-of-service'>
                  <TermsOfService />
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
        const tags = {
          "endpoint": url,
          "method": "GET",
          "org_id": `${Organization?.id ?? 'Without organization'}`
        }
        handleSendSentry(err, ERROR_HEADERS.WAITING_ROOM.FAILURE_GET_APPOINTMENT, tags)
      })
    }

    Organization && load()

    const timer = setInterval(() => load(), 60800)
    return () => clearInterval(timer)
  }, [socket, Organizations, Organization])

  const value = useMemo(() => ({ rooms }), [rooms])

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
}
