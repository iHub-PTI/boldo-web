import { AppBar, Box, Tab, Tabs, Typography } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import testingApp from '../../assets/testing-mobile-app.png'
interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

interface CustomLinkProps {
  children?: React.ReactNode
  to: string
}

const CustomLink = ({ children, to }: CustomLinkProps) => {
  return <Link to={to}>{children} </Link>
}

function PatientAccountDeletion() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div>
      <AppBar position='sticky' style={{ backgroundColor: 'transparent' }}>
        <div className='flex flex-1 flex-row justify-between px-8 py-4 text-custom-link'>
          <div>
            <Typography>Logo</Typography>
          </div>
          <div className='flex flex-row gap-4 '>
            <CustomLink to='#'>Términos y Condiciones</CustomLink>
            <CustomLink to='#'>Políticas de privacidad</CustomLink>
            <CustomLink to='#'>Soporte</CustomLink>
          </div>
        </div>
      </AppBar>
      <div className='px-10'>
        <div className='flex flex-col justify-around h-screen w-full'>
          <div className='flex'>
            <div className='flex-1 justify-center content-center'>
              <span className='block text-2xl text-custom-link'>Instrucciones detalladas</span>
              <span className='block text-6xl font-bold text-custom-link'>Proceso de Eliminación de Cuenta</span>
            </div>

            <div className='flex-1 flex justify-end'>
              <img src={testingApp} alt='Testing Boldo' />
            </div>
          </div>
          <div className='p-8 bg-blue-50'>
            <span>
              En Boldo, entendemos que la privacidad y seguridad de tus datos son fundamentales. Si has decidido
              eliminar tu cuenta, queremos asegurarnos de que el proceso sea claro y transparente. Aquí te explicamos
              cómo funciona:
            </span>
          </div>
        </div>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
          <Tab label='Aplicación Móvil' />
          <Tab label='Solicitud vía correo' />
        </Tabs>
        <TabPanel value={value} index={0}>
          Aplicación Móvil
        </TabPanel>
        <TabPanel value={value} index={1}>
          Solicitud vía correo
        </TabPanel>
      </div>
    </div>
  )
}

export default PatientAccountDeletion
