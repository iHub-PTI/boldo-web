# BOLDO - WEB

## Getting Started

1. `npm i`
2. Add `.env` to the root directory with this content:

   ```
   REACT_APP_SERVER_ADDRESS = https://boldo-server.herokuapp.com
   REACT_APP_SOCKETS_ADDRESS = https://boldo-sockets.herokuapp.com
   REACT_APP_KEYCLOAK_ADDRESS = https://sso-test.pti.org.py/auth/realms/iHub/protocol/openid-connect/auth?response_type=code&client_id=boldo-patient
   ```

3. `npm start` to start the app on [localhost:3000](http://localhost:3000)
