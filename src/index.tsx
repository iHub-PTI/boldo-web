import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { RewriteFrames as RewriteFramesIntegration } from "@sentry/integrations";
import { Debug as DebugIntegration } from "@sentry/integrations";
import { ExtraErrorData as ExtraErrorDataIntegration } from "@sentry/integrations";
import { CaptureConsole as CaptureConsoleIntegration } from "@sentry/integrations";
import { ReportingObserver as ReportingObserverIntegration } from "@sentry/integrations";

import {Provider} from 'react-redux'
import {createStore} from 'redux'
import App from './App'
import soepReducer from './redux/reducers/soepReducer.js';
if (process.env.NODE_ENV === 'production')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    integrations: [new Integrations.BrowserTracing(),
      new RewriteFramesIntegration(),
      new DebugIntegration(),
      new ExtraErrorDataIntegration(),
      new CaptureConsoleIntegration(
        {
          levels: ['error']
        }
      ),
      new ReportingObserverIntegration()],
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
