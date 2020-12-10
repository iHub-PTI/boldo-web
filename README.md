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
   REACT_APP_SENTRY = PUBLIC SENTRY DSN

   # ###################### Online ######################
   # REACT_APP_SOCKETS_ADDRESS = https://sockets.boldo.penguin.software
   # REACT_APP_SERVER_ADDRESS = https://api.boldo.penguin.software

   # ###################### Local ######################
   REACT_APP_SOCKETS_ADDRESS = http://localhost:8000
   REACT_APP_SERVER_ADDRESS = http://localhost:8008
   ```

4. `npm start` - to start the app on [localhost:3000](http://localhost:3000)

## Run with docker

To build the docker image use the following command:

```
docker build -t boldo-web --build-arg sockets_address=http://localhost:8000 --build-arg app_server=http://localhost:8008 --build-arg app_frontend=http://localhost:3000 .
```

After that you can test it running the following command:

```bash
docker run --rm -it -p 3000:3000 boldo-web
```

## Run in production

To run this project in production, make sure to have the environment variable `NODE_ENV` set to `production`.

## Contributing

The project is currently under heavy development but contributors are welcome. For bugs or feature requests or eventual contributions, just open an issue. Contribution guidelines will be available shortly.

## Authors and License

This project was created as part of the iHub COVID-19 project in collaboration between [Penguin Academy](https://penguin.academy) and [PTI (Parque Tecnológico Itaipu Paraguay)](http://pti.org.py).

This project is licensed under
[AGPL v3](LICENSE)
