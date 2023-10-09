import AuthService from '../auth/AuthService'
import React, { useEffect, useState } from 'react';
import LoadingSpinner from './icons/sumary-print/LoadingSpinner';

const KeycloakProv = ({ children }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await AuthService.initKeycloak().then(() => {
        setLoading(false)
      })
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner />;
  else return children;
}

export default KeycloakProv
