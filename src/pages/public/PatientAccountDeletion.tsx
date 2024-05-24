import { Box, Container, Tab, Tabs, Typography } from '@material-ui/core'
import React from 'react'
import Layout from '../../components/public/Layout'

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
        <Box role='tabpanel' p={3}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function PatientAccountDeletion() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Layout>
      <Container component='main' maxWidth='md'>
        <div className='flex flex-col justify-around w-full gap-4'>
          <span className='block text-5xl font-bold text-custom-link'>Proceso de Eliminación de Cuenta</span>
          <p>
            En Boldo, entendemos que la privacidad y seguridad de tus datos son fundamentales. Si has decidido eliminar
            tu cuenta, queremos asegurarnos de que el proceso sea claro y transparente. Aquí te explicamos cómo
            funciona:
          </p>
        </div>

        <div className='my-10'>
          <Tabs
            centered
            value={value}
            variant='fullWidth'
            onChange={handleChange}
            TabIndicatorProps={{
              style: { backgroundColor: '#1890FF' },
            }}
          >
            <Tab label='Aplicación Móvil' />
            <Tab label='Solicitud vía correo' />
          </Tabs>
          <TabPanel value={value} index={0}>
            <div className='grid grid-cols-3 gap-10'>
              <div className='block'>
                <div className='pb-4 text-lg font-bold text-custom-link flex flex-row gap-4 items-center w-full'>
                  <div className='rounded-full border-solid border-2 border-custom-link h-10 w-10 flex items-center justify-center'>
                    1
                  </div>
                  <span>Solicitud de eliminación</span>
                </div>
                <p>
                  Para iniciar el proceso de eliminación de tu cuenta en Boldo, simplemente accede a la configuración de
                  tu cuenta en la aplicación. Dentro de las opciones de configuración, encontrarás la opción para
                  eliminar tu cuenta. Al seleccionar esta opción, se te guiará a través del proceso para confirmar tu
                  decisión.
                </p>
              </div>

              <div className='block'>
                <div className='pb-4 text-lg font-bold text-custom-link flex flex-row gap-4 items-center w-full'>
                  <div className='rounded-full border-solid border-2 border-custom-link h-10 w-10 flex items-center justify-center'>
                    2
                  </div>
                  <span>Periodo de eliminación</span>
                </div>
                <p>
                  Después de solicitar la eliminación de tu cuenta, ten en cuenta que tus datos no se eliminarán de
                  inmediato. El proceso de eliminación de la cuenta tomará 30 días para completarse.
                </p>
              </div>
              <div className='block'>
                <div className='pb-4 text-lg font-bold text-custom-link flex flex-row gap-4 items-center w-full'>
                  <div className='rounded-full border-solid border-2 border-custom-link h-10 w-10 flex items-center justify-center'>
                    3
                  </div>
                  <span>Notificación por correo</span>
                </div>
                <p>
                  Transcurrido el período, recibirás una notificación por correo electrónico confirmando que tu cuenta y
                  los datos asociados han sido eliminados de nuestros sistemas de manera permanente.
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className='grid grid-cols-3 gap-10'>
              <div className='block'>
                <div className='pb-4 text-lg font-bold text-custom-link flex flex-row gap-4 items-center w-full'>
                  <div className='rounded-full border-solid border-2 border-custom-link h-10 w-10 flex items-center justify-center'>
                    1
                  </div>
                  <span>Solicitud de eliminación</span>
                </div>
                <p>
                  Envia un correo a <b>info@bol.do</b> con los siguientes datos: Número de cedula, nombre completo,
                  fecha de nacimiento, número de teléfono y correo Motivo: Solicitud de eliminación de cuenta
                </p>
              </div>

              <div className='block'>
                <div className='pb-4 text-lg font-bold text-custom-link flex flex-row gap-4 items-center w-full'>
                  <div className='rounded-full border-solid border-2 border-custom-link h-10 w-10 flex items-center justify-center'>
                    2
                  </div>
                  <span>Periodo de eliminación</span>
                </div>
                <p>
                  Después de solicitar la eliminación de tu cuenta, ten en cuenta que tus datos no se eliminarán de
                  inmediato. El proceso de eliminación de la cuenta tomará 30 días para completarse.
                </p>
              </div>
              <div className='block'>
                <div className='pb-4 text-lg font-bold text-custom-link flex flex-row gap-4 items-center w-full'>
                  <div className='rounded-full border-solid border-2 border-custom-link h-10 w-10 flex items-center justify-center'>
                    3
                  </div>
                  <span>Notificación por correo</span>
                </div>
                <p>
                  Transcurrido el período, recibirás una notificación por correo electrónico confirmando que tu cuenta y
                  los datos asociados han sido eliminados de nuestros sistemas de manera permanente.
                </p>
              </div>
            </div>
          </TabPanel>
        </div>
        <div className='flex flex-col gap-10 pb-10'>
          <section>
            <span className='font-bold text-xl text-custom-link'>Datos eliminados</span>
            <p>
              Durante el proceso de eliminación de la cuenta, los siguientes datos serán completamente eliminados de
              nuestros sistemas:
            </p>
            <ul className='list-disc list-inside pl-4'>
              <li>Información personal (nombre, dirección, fecha de nacimiento, etc.)</li>
              <li>Historial de actividad y uso de la aplicación</li>
              <li>Datos de inicio de sesión y credenciales</li>
            </ul>
          </section>
          <section>
            <span className='font-bold text-xl text-custom-link'>Datos mantenidos</span>
            <p>
              Sin embargo, es importante destacar que algunos datos relacionados con tu historial médico y de atención
              sanitaria se mantendrán por razones legales y de seguridad. Estos datos incluyen:
            </p>
            <ul className='list-disc list-inside pl-4'>
              <li>Registros médicos, como consultas anteriores, resultados de exámenes y prescripciones médicas.</li>
              <li>Historial de vacunación.</li>
              <li>Información relevante relacionada con tu salud.</li>
            </ul>
            <p>
              Estos datos se mantendrán de acuerdo con nuestras políticas de privacidad y regulaciones aplicables para
              garantizar la confidencialidad y seguridad de la información médica de nuestros usuarios.
            </p>
          </section>
          <section>
            <p>
              Si tienes alguna pregunta o inquietud sobre el proceso de eliminación de la cuenta o la protección de
              datos, no dudes en ponerte en contacto con nuestro equipo de soporte, estaremos encantados de ayudarte.
            </p>
            <p>
              Gracias por confiar en Boldo para tu atención médica y esperamos haber facilitado el proceso de
              eliminación de tu cuenta.
            </p>
          </section>
        </div>
      </Container>
    </Layout>
  )
}

export default PatientAccountDeletion
