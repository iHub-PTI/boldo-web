import Keycloak from 'keycloak-js'
import { MIN_VALIDITY_EXPIRATION, keycloakConfig } from './keycloak'


//console.log(keycloakConfig);

const _kc = new Keycloak(keycloakConfig)

/**
 * Inicializa el KC y lanza el callback luego de la autenticatión.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = () =>
  _kc.init({
      onLoad: 'login-required',
      flow: 'implicit',
      checkLoginIframe: false
  })

const logout = () => {
  sessionStorage.clear();
  _kc.logout();
}

const login = _kc.login

const getToken = () => _kc.token

const getTokenParsed = () => _kc.tokenParsed

const getIdToken = () => _kc.idToken

const getIdTokenParsed = () => _kc.idTokenParsed

const isLoggedIn = () => !!_kc.token

const isTokenExpired = _kc.isTokenExpired

const clearToken = _kc.clearToken

const getRoles = () => _kc.tokenParsed.realm_access.roles;

const getTokenAutoRefresh = async () => {
  try {
    await _kc.updateToken(MIN_VALIDITY_EXPIRATION).then((aut) => {
      console.log(aut)
    })
    return getToken()
  } catch (error) {
    console.log('Error al intentar actualizar el token: ', error)
    clearToken()
  }
}

const getUsername = () => _kc.tokenParsed?.preferred_username

const hasRole = (roles: string[]) =>
  roles.some((role) => _kc.hasRealmRole(role))

const AuthService = {
  initKeycloak,
  login,
  logout,
  getToken,
  getTokenParsed,
  getIdToken,
  getIdTokenParsed,
  isLoggedIn,
  getUsername,
  hasRole,
  getTokenAutoRefresh,
  isTokenExpired,
  clearToken,
  getRoles
}

export default AuthService
