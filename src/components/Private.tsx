import * as React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import App from '../App';

export const Private = () => {

  const { initialized } = useKeycloak()

  if (!initialized) {
    return (
        <div className={`flex w-full h-full justify-items-center align-middle z-50 fixed`}>
            <div className='m-auto flex-col justify-items-center align-middle'>
                <div className='loader ml-8'></div>
            </div>
        </div>        
    )
  }

  return (
    <App />
  );

};

export default Private;