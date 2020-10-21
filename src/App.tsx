import React, { useEffect, createContext, useState } from 'react'
import axios from 'axios'
import { Route, Switch, Redirect } from 'react-router-dom'

import Call from './pages/Call'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Settings from './pages/Settings'
import { loginURL } from './utils/helpers'

import './styles.output.css'

// FIXME! Bad Practice to include credentials in all requests.
// Easily leads to cookies sent in requests that should not contain those
// Use axios instance
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.REACT_APP_SERVER_ADDRESS

export const UserContext = createContext<{ type: string; id: string; name: string; email: string } | null>(null)

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        await axios.get('/refreshtoken')
      } catch (err) {
        console.log(err)
        window.location.href = loginURL
      }
    }

    axios.interceptors.response.use(
      response => response,
      async function (error) {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          await refreshAccessToken()
          return axios(originalRequest)
        }
        return Promise.reject(error)
      }
    )
  }, [])

  useEffect(() => {
    const effect = async () => {
      try {
        const res = await axios.get('/profile')
        setUser(res.data)
      } catch (err) {
        console.log(err)
        if (err?.response?.status === 401) window.location.href = loginURL
      }
    }

    effect()
  }, [])

  if (!user) return <div className='h-1 fakeload-15 bg-primary-500' />

  return (
    <UserContext.Provider value={user}>
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

          <Route exact path='/home'>
            <Home />
          </Route>

          <Route>
            <Redirect to='/' />
          </Route>
        </Switch>
      </div>
    </UserContext.Provider>
  )
}

export default App
