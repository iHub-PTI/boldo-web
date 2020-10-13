import React from 'react'
import axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import Call from './pages/Call'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'

import { GLOBALS } from './helpers'

import './styles.output.css'

axios.defaults.withCredentials = true
axios.defaults.baseURL = GLOBALS.SERVER

function App() {
  console.log(process.env)
  return (
    <div className='antialiased App'>
          <Switch>
            <Route exact path='/call'>
              <Call />
            </Route>
            <Route exact path='/'>
              <Home />
            </Route>

            <Route exact path='/dashboard'>
             <Dashboard />
            </Route>
          </Switch>
    </div>
  )
}

export default App
