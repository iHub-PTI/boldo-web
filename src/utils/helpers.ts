const REACT_APP_KEYCLOAK_REALM_ADDRESS = process.env.REACT_APP_KEYCLOAK_REALM_ADDRESS
const REACT_APP_SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS

export const loginURL = `${REACT_APP_KEYCLOAK_REALM_ADDRESS}/protocol/openid-connect/auth?response_type=code&client_id=boldo-doctor&redirect_uri=${REACT_APP_SERVER_ADDRESS}/code`
