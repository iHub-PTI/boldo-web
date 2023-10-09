export const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID
};

export const MIN_VALIDITY_EXPIRATION = 300 // 300 segundos = 5 minutos
