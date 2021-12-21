import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import App from './App'

if (process.env.NODE_ENV === 'production')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })

ReactDOM.render(
   <BrowserRouter>
      <App />
    </BrowserRouter>
  ,
  document.getElementById('root')
)
