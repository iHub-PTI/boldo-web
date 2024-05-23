import axios from 'axios'
import keycloak from '../keycloak'

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ADDRESS,
  withCredentials: true,
  maxRedirects: 0,
})

axiosInstance.interceptors.request.use(async config => {
  if (keycloak.authenticated) {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`
      config.headers['Access-Control-Allow-Origin'] = '*'
    }
  } else {
    keycloak.login()
  }
  return config
})

export { axiosInstance }
