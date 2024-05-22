import { AppBar } from '@material-ui/core'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ReactComponent as LogoHorizontal } from '../../assets/logo-horizontal.svg'
import { Link as MaterialLink } from '@material-ui/core'

interface CustomLinkProps {
  children?: React.ReactNode
  to: string
}

const CustomLink = ({ children, to }: CustomLinkProps) => {
  const location = useLocation()
  console.log({ location })
  const hovered = location.pathname === to
  return (
    <Link to={to} className={hovered ? 'bg-neutral-gray p-2 rounded-md' : ''}>
      {children}{' '}
    </Link>
  )
}

function Layout({ children }) {
  return (
    <div className='bg-gradient-to-r from-blue-50 via-transparent'>
      <AppBar position='sticky' style={{ backgroundColor: 'white' }}>
        <div className='flex flex-1 flex-row items-center justify-between px-8 py-4 text-custom-link'>
          <div>
            <LogoHorizontal />
          </div>
          <div className='flex flex-row gap-4 items-center'>
            <CustomLink to='/boldo-app-terms-of-service'>Términos y Condiciones</CustomLink>
            <CustomLink to='/boldo-app-privacy-policy'>Políticas de Privacidad</CustomLink>
            <CustomLink to='/boldo-app-account-deletion'>Eliminación de Cuenta</CustomLink>

            <a href='mailto:info@bol.do'>Soporte</a>
          </div>
        </div>
      </AppBar>
      <div className='py-20'>{children}</div>

      <footer className='bg-neutral-gray flex flex-col items-center justify-center py-7'>
        <LogoHorizontal /> <span className='pt-4 text-sm font-semibold'>Correo electrónico: info@bol.do</span>
        <div className='my-4 border-b border-gray-300 w-3/4'></div>
        <MaterialLink href='https://www.pti.org.py/' target='_blank'>
          Fundación Parque Tecnológico Itaipu
        </MaterialLink>
        <span className='text-xs'>Todos los derechos reservados {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

export default Layout
