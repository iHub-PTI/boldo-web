import React, { useEffect, createContext, useState } from 'react'
import axios from 'axios'
import { Route, Switch, Redirect } from 'react-router-dom'

import Call from './pages/Call'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Settings from './pages/Settings'

import './styles.output.css'

// FIXME! Bad Practice to include credentials in all requests.
// Easily leads to cookies sent in requests that should not contain those
// Use axios instance
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.REACT_APP_SERVER_ADDRESS

export const UserContext = createContext<{ type: string; id: string; name: string; email: string } | null>(null)

const App = () => {
  const [user, setUser] = useState(null)

  // TODO: Create Interceptor to ensure logout once the server sends 400 (or 403?)
  useEffect(() => {
    const effect = async () => {
      try {
        const res = await axios.get('/me')
        setUser(res.data)
      } catch (err) {
        console.log(err)
        if (err?.response?.status === 401 && err.response?.data?.message)
          window.location.href = err.response.data.message
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
