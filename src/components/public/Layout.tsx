import { AppBar } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as LogoHorizontal } from '../../assets/logo-horizontal.svg'

interface CustomLinkProps {
  children?: React.ReactNode
  to: string
}

const CustomLink = ({ children, to }: CustomLinkProps) => {
  return <Link to={to}>{children} </Link>
}

function Layout({ children }) {
  return (
    <div className='bg-gradient-to-r from-blue-50 via-transparent'>
      <AppBar position='sticky' style={{ backgroundColor: 'white' }}>
        <div className='flex flex-1 flex-row justify-between px-8 py-4 text-custom-link'>
          <div>
            <LogoHorizontal />
          </div>
          <div className='flex flex-row gap-4 '>
            <CustomLink to='#'>Términos y Condiciones</CustomLink>
            <CustomLink to='#'>Políticas de privacidad</CustomLink>
            <CustomLink to='#'>Soporte</CustomLink>
          </div>
        </div>
      </AppBar>
      <div>{children}</div>

      <footer className='bg-neutral-gray flex flex-col items-center justify-center py-7'>
        <LogoHorizontal /> <span className='pt-4 text-sm font-semibold'>Correo electrónico: info@bol.do</span>
        <div className='my-4 border-b border-gray-300 w-3/4'></div>
        <span className='text-xs'>Todos los derechos reservados 2024</span>
      </footer>
    </div>
  )
}

export default Layout
