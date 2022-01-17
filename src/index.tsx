import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import App from './App'
import soepReducer from './redux/reducers/soepReducer.js';
if (process.env.NODE_ENV === 'production')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })

  const configureStore = createStore(soepReducer);
ReactDOM.render(
  <Provider store={configureStore}>
   <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
  ,
  document.getElementById('root')
)
