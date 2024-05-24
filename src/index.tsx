import { CaptureConsole as CaptureConsoleIntegration, Debug as DebugIntegration, ExtraErrorData as ExtraErrorDataIntegration, ReportingObserver as ReportingObserverIntegration, RewriteFrames as RewriteFramesIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { ReactKeycloakProvider } from '@react-keycloak/web'
import OrganizationProvider from '../src/contexts/Organizations/organizationSelectedContext'
import Private from './components/Private'
import AllOrganizationProvider from './contexts/Organizations/organizationsContext'
import keycloak from './keycloak'

if (process.env.NODE_ENV === 'production')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY,
    autoSessionTracking: true,
    integrations: [
      new Integrations.BrowserTracing(),
      new RewriteFramesIntegration(),
      new DebugIntegration(),
      new ExtraErrorDataIntegration(),
      new CaptureConsoleIntegration({
        levels: ['error'],
      }),
      new ReportingObserverIntegration(),
    ],
    tracesSampleRate: 1.0,
  })

ReactDOM.render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={{
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
      //NOTE: no funciona con el checkLoginIframe porque renderiza y se pierde la autenticación
      checkLoginIframe: false,
    }}
  >
    <BrowserRouter>
      <AllOrganizationProvider>
        <OrganizationProvider>
          <Private />
        </OrganizationProvider>
      </AllOrganizationProvider>
    </BrowserRouter>
  </ReactKeycloakProvider>,
  document.getElementById('root')
)
