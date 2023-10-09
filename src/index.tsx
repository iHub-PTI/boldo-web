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
import soepReducer from './redux/reducers/soepReducer.js';

import AllOrganizationProvider from './contexts/Organizations/organizationsContext'
import OrganizationProvider from "../src/contexts/Organizations/organizationSelectedContext"
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import Private from './components/Private';

if (process.env.NODE_ENV === 'production')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    autoSessionTracking: true,
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
      tracesSampleRate: 1.0,
  })

const configureStore = createStore(soepReducer);

ReactDOM.render(
    <ReactKeycloakProvider authClient={keycloak} initOptions={{ onLoad: "login-required", flow: "hybrid", checkLoginIframe: false, pkceMethod: "S256" }}>
      <Provider store={configureStore}>
          <BrowserRouter>
            <AllOrganizationProvider>
              <OrganizationProvider>
                <Private />
              </OrganizationProvider>
            </AllOrganizationProvider>
          </BrowserRouter>
      </Provider>
    </ReactKeycloakProvider>
  ,
  document.getElementById('root')
);