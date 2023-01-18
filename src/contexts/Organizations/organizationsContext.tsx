import React, { createContext, useState  } from "react"

type ContextAllOrganization = {
  Organizations: Array<Boldo.Organization>,
  setOrganizations: (value: Array<Boldo.Organization>) => void
}

export const AllOrganizationContext = createContext(null as ContextAllOrganization)

const AllOrganizationProvider = ({ children }) => {

  const [Organizations, setOrganizations] = useState(null as Array<Boldo.Organization>)

  return (
    <AllOrganizationContext.Provider value = {{Organizations, setOrganizations}}>
      { children }
    </AllOrganizationContext.Provider>
  )
}

export default AllOrganizationProvider