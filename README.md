# BOLDO - WEB

Boldo can be found in any Paraguayan household. It is a magic team that can calm all kind of stomache ache.

This is the browser based web application for Boldo - a telemedicine solution for doctors and patients.
The browser application is specifically for doctors.

## Getting Started

1. This project has the following dependencies:

   - node.js (v12 or newer)

2. Install dependencies: `npm i`

3. Create a `.env` file in the project's root folder and add these contents:

   ```
   # ###################### Online ######################
   # REACT_APP_SOCKETS_ADDRESS = https://sockets.boldo.penguin.software
   # REACT_APP_SERVER_ADDRESS = https://api.boldo.penguin.software
   # REACT_APP_KEYCLOAK_REALM_ADDRESS = https://sso-test.pti.org.py/auth/realms/iHub

   # ###################### Local ######################
   REACT_APP_SOCKETS_ADDRESS = http://localhost:8000
   REACT_APP_SERVER_ADDRESS = http://localhost:8008
   REACT_APP_KEYCLOAK_REALM_ADDRESS = http://localhost:8080/auth/realms/iHub
   ```

4. `npm start` - to start the app on [localhost:3000](http://localhost:3000)

## Contributing

The project is currently under heavy development but contributors are welcome. For bugs or feature requests or eventual contributions, just open an issue. Contribution guidelines will be available shortly.

## Authors and License

This project was created as part of the iHub COVID-19 project in collaboration between [Penguin Academy](https://penguin.academy) and [PTI (Parque Tecnológico Itaipu Paraguay)](http://pti.org.py).

This project is licensed under
[AGPL v3](LICENSE)
