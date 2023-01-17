import React, { createContext, useState  } from "react"

type ContextOrganization = {
  Organization: Boldo.Organization,
  setOrganization: (value: Boldo.Organization) => void
}

export const OrganizationContext = createContext(null as ContextOrganization)

const OrganizationProvider = ({ children }) => {

  const [Organization, setOrganization] = useState(null as Boldo.Organization)

  return (
    <OrganizationContext.Provider value = {{Organization, setOrganization}}>
      { children }
    </OrganizationContext.Provider>
  )
}

export default OrganizationProvider