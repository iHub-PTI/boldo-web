import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addDays, differenceInDays } from 'date-fns'
import { useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import CardMedia from '@material-ui/core/CardMedia';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import ContactPhoneRoundedIcon from '@material-ui/icons/ContactPhoneRounded';
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TimerOffRoundedIcon from '@material-ui/icons/TimerOffRounded';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { Appointment } from '../types';
import DirectionsRunRoundedIcon from '@material-ui/icons/DirectionsRunRounded';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';

//
// ////////////////////////////////////////////////////////////////////////////
//                          Appointments call API
// ////////////////////////////////////////////////////////////////////////////
//
type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

const eventDataTransform = (event: AppointmentWithPatient) => {
  const getColorClass = (eventType: Boldo.Appointment['type']) => {
    if (event.status === "cancelled") return 'event-cancel'
    if (eventType === 'Appointment' && event.appointmentType === 'V') return 'event-online'
    if (eventType === 'Appointment' && event.appointmentType === 'A') return 'event-inperson'
    if (eventType === 'PrivateEvent') return 'event-private'
    return 'event-other'
  }
  return {
    title: event.name || `${event.patient.givenName}`,
    start: event.start,
    end: event.end,
    classNames: [getColorClass(event.type), 'boldo-event'],
    extendedProps: event,
  }
}

const calculateOpenHours = (openHours: Boldo.OpenHours, start: Date, end: Date) => {
  // Create list of days
  const days = differenceInDays(end, start)
  const daysList = [...Array(days + 1).keys()].map(i => addDays(start, i))

  return daysList.flatMap(day => {
    const dayOfTheWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][day.getDay()] as keyof Boldo.OpenHours
    const openHoursOfDay = openHours[dayOfTheWeek]

    return openHoursOfDay.map(openHour => {
      const startDate = new Date(day)
      startDate.setHours(0, openHour.start, 0)
      const endDate = new Date(day)
      endDate.setHours(0, openHour.end, 0)

      return { start: startDate, end: endDate }
    })
  })
}

type AppointmentForm = Omit<Boldo.Appointment, 'start' | 'end' | 'patientId' | 'doctorId'> & {
  start: string
  end: string
  date: string
  appointmentType: string
}

const initialAppointment = {
  id: 'new',
  name: '',
  start: '',
  end: '',
  date: '',
  description: '',
  type: 'PrivateEvent',
  appointmentType: ''
} as AppointmentForm

type Action =
  | { type: 'reset' }
  | { type: 'initial'; value: AppointmentForm }
  | { type: 'default'; value: Partial<AppointmentForm> }

function reducer(state: AppointmentForm, action: Action): AppointmentForm {
  switch (action.type) {
    case 'default':
      return { ...state, ...action.value }
    case 'reset':
      return initialAppointment
    case 'initial':
      return action.value
    default:
      throw new Error()
  }
}

function calculateHours(hours){
 if(hours > 12){
    return ' pm'
  }else{
    return ' am'
  }
}
function checkHours(hours){
  if(hours > 12){
     return ' pm'
   }else{
     return ' am'
   }
 }

function outputDate(){
  const date = new Date();
  const outputDate = date.getFullYear()+ '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String( date.getDate()).padStart(2, '0');
  return outputDate
}
function appointmentTransformType(appointmentType){
  if(appointmentType === 'V'){
    return 'remoto'
  }else if(appointmentType === 'A'){
    return 'presencial'
  }

}

function ordersAppointments(array){
  const ordersAppointments = array.sort((a, b) => a.start > b.start);
  console.log('entro a ordenar', ordersAppointments)
  return ordersAppointments
}
function callLink(appointmentType, id){
  if(appointmentType === 'V'){
    return  `appointments/`+ id +`/call`
  }else if(appointmentType === 'A'){
    return   `appointments/`+ id +`/inperson`
}
}

function appointmentStatus(status) {
  if (status === 'cancelled') {
    return 'cancelado'
  } else if (status === 'confirmed') {
    return 'confirmado'
  } else if (status === 'upcoming') {
    return 'pendiente'
  } else if (status === 'unavailable') {
    return 'no disponible'
}
}

export function NoAppointments() {
  const theme = useTheme();
  const [open5, setOpen5] = React.useState(false);
  const handleOpen5 = () => {
    setOpen5(true);
  };

  const handleClose5 = () => {
    setOpen5(false);
  };
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl2(null);
  };

  return(
    <div style={{ padding:'0.5rem' }}>
      <Card style={{ display:'flex', backgroundColor:'#F9FAFB' }}> 
        <CardMedia style={{display:'flex', alignItems: 'center', paddingLeft: '10px', color:'#E2E8F0'}}>
          <MoreVertIcon fontSize={'large'} style={{alignItems:'center'}} />
        </CardMedia>
        <CardContent>
          <Typography style={{ flexGrow: 1 }} color="textSecondary" gutterBottom>
            sin agendamientos entre las 06:00 am y las 11:00 am 
          </Typography>
          <Typography variant="body1">
            <Link href="#" variant="body1"> 
              <Button aria-controls="fade-menu" aria-haspopup="true" style={{color: '#27BEC2', textDecorationLine: 'underline', textTransform: 'lowercase'}} onClick={handleClick}>
                agregar
              </Button>
              <Menu
                id="fade-menu"
                anchorEl={anchorEl2}
                keepMounted
                open={open2}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleClose}>
                  <div>
                    <button type="button" onClick={handleOpen5}>
                      <TimerOffRoundedIcon /> Marcar indisponibilidad
                    </button>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      open={open5}
                      onClose={handleClose5}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={open5}>
                        <div style={{ backgroundColor: theme.palette.background.paper, border: 'none', boxShadow: theme.shadows[5], padding: theme.spacing(2, 4, 3) }}>
                          <h2 id="transition-modal-title">Marcar indisponibilidad</h2>
                          <p id="transition-modal-description">Seleccione los horarios correspondientes</p>
                          <Button id="transition-modal-description">03:30 pm</Button>
                          <Button id="transition-modal-description">04:00 pm</Button>
                          <Button id="transition-modal-description">04:30 pm</Button>
                          <Button id="transition-modal-description">05:00 pm</Button>
                          <Button id="transition-modal-description">05:30 pm</Button>
                          <Button style={{backgroundColor: '#27BEC2', color:'white'}} id="transition-modal-description">Confirmar</Button>
                        </div>
                      </Fade>
                    </Modal>
                  </div>
                </MenuItem>
                <MenuItem onClick={handleClose}> 
                <div>
                    <button type="button" onClick={handleOpen5}>
                      <PersonAddIcon />  Marcar cita para paciente
                    </button>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      open={open5}
                      onClose={handleClose5}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                      }}
                    >
                      <Fade in={open5}>
                        <div style={{ backgroundColor: theme.palette.background.paper, border: 'none', boxShadow: theme.shadows[5], padding: theme.spacing(2, 4, 3) }}>
                          <h2 id="transition-modal-title">Paciente</h2>
                          <p id="transition-modal-description">Seleccione los horarios correspondientes</p>
                          <Button id="transition-modal-description">03:30 pm</Button>
                          <Button id="transition-modal-description">04:00 pm</Button>
                          <Button id="transition-modal-description">04:30 pm</Button>
                          <Button id="transition-modal-description">05:00 pm</Button>
                          <Button id="transition-modal-description">05:30 pm</Button>
                          <Button style={{backgroundColor: '#27BEC2', color:'white'}} id="transition-modal-description">Confirmar</Button>
                        </div>
                      </Fade>
                    </Modal>
                  </div>
                </MenuItem>
              </Menu>
            </Link>
          </Typography>

        </CardContent>
      </Card>
    </div>
  )
}

export function CancelAppointment(props) {
  const appointmentID = props.appointmentID;
  const theme = useTheme();
  const [openC, setOpenC] = React.useState(false);
  const handleOpenC = () => {
    setOpenC(true);
  };

  const handleCloseC = () => {
    setOpenC(false);
  };
  const [anchorElC, setAnchorElC] = React.useState(null);
  const openCa = Boolean(anchorElC);
  const handleClick = (event) => {
    setAnchorElC(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElC(null);
  };
  return(
    <>
      <Link href="#" variant="body1">
        <Button aria-controls="fade-menu" aria-haspopup="true" style={{color: '#F08F77', textDecorationLine: 'underline', textTransform: 'lowercase'}} onClick={handleClick}>
          editar
        </Button>
        <Menu
          id="fade-menu"
          anchorEl={anchorElC}
          keepMounted
          open={openCa}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={handleClose}>
            <div>
              <button type="button" onClick={handleOpenC}>
                <EventRoundedIcon /> Remarcar
              </button>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                open={openC}
                onClose={handleCloseC}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={openC}>
                  <div style={{ backgroundColor: theme.palette.background.paper, border: 'none', boxShadow: theme.shadows[5], padding: theme.spacing(2, 4, 3) }}>
                    <h2 id="transition-modal-title">Marcar indisponibilidad</h2>
                    <p id="transition-modal-description">Seleccione los horarios correspondientes</p>
                    <Button id="transition-modal-description">03:30 pm</Button>
                    <Button id="transition-modal-description">04:00 pm</Button>
                    <Button id="transition-modal-description">04:30 pm</Button>
                    <Button id="transition-modal-description">05:00 pm</Button>
                    <Button id="transition-modal-description">05:30 pm</Button>
                    <Button style={{backgroundColor: '#27BEC2', color:'white'}} id="transition-modal-description">Confirmar</Button>
                  </div>
                </Fade>
              </Modal>
            </div>
          </MenuItem>
          <MenuItem onClick={handleClose}> 
          <div>
          
          {/* <button type="button" onClick={cancelPacientAppointment(post.extendedProps.id)}> */}
              <button type="button" onClick={async () => {
                      try {
                          const res = await axios.post(`/profile/doctor/appointments/cancel/${appointmentID}`);
                          console.log('respuesta ', res)
                          if (res.data != null) {
                              // addToast({ type: 'success', title: 'Cita cancelada con éxito', })
                              // history.replace(`/`)
                          }

                      } catch (err) {
                          console.log("Error al cancelar cita", err)
                          // addErrorToast('No se pudo borrar la cita, intente nuevamente.')

                      }

                  }}>
                <DeleteForeverRoundedIcon />  Cancelar
              </button>
              {/* <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                open={openC}
                onClose={handleCloseC}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={openC}>
                  <div style={{ backgroundColor: theme.palette.background.paper, border: 'none', boxShadow: theme.shadows[5], padding: theme.spacing(2, 4, 3) }}>
                    <h2 id="transition-modal-title">Paciente</h2>
                    <p id="transition-modal-description">Seleccione los horarios correspondientes</p>
                    <Button id="transition-modal-description">03:30 pm</Button>
                    <Button id="transition-modal-description">04:00 pm</Button>
                    <Button id="transition-modal-description">04:30 pm</Button>
                    <Button id="transition-modal-description">05:00 pm</Button>
                    <Button id="transition-modal-description">05:30 pm</Button>
                    <Button style={{backgroundColor: '#27BEC2', color:'white'}} id="transition-modal-description">Confirmar</Button>
                  </div>
                </Fade>
              </Modal> */}
            </div>
          </MenuItem>
        </Menu>
      </Link>
    </>
  )
}
export function IsAmPm(props) {
  return(
    <>
    </>
  )

}

export function AppointmentType( props ) {
  const appointmenTitle = props.appointmentData.title;
  const appointmentStart = props.appointmentData.start;
  const appointmentEnd = props.appointmentData.end;
  const appointmentType = props.appointmentData.extendedProps.appointmentType;
  const appointmentEventType = props.appointmentData.extendedProps.type;
  const appointmentId = props.appointmentData.extendedProps.id;
  const appointmentStatus = props.appointmentData.extendedProps.status;
  const inicio = props.appointmentData.start;
  const fin = props.appointmentData.end;
 console.log(`el doctor comienza: ` + inicio.split('T')[0] + ` y termina: ` + fin);
 if(appointmentStart.split('T')[1].split('.')[0].split(':')[0] < 12){
   if(inicio.split('T')[0] === outputDate()){
  if(appointmentEventType === 'Appointment'){
    const patientName = props.appointmentData.extendedProps.patient.givenName;
    const patientLastName = props.appointmentData.extendedProps.patient.familyName;
    const patientPhoto = props.appointmentData.extendedProps.patient.photoUrl;
    if(appointmentStatus === 'open'){
      return(
        <div style={{ padding:'0.5rem' }}>
         <Card variant="outlined" style={{ display: 'flex', borderRadius:'16px' }}>
           <CardMedia
             style={{ width: 110 }}
             image={ patientPhoto }
             title="Live from space album cover"
           />
           <CardContent>
             <Typography style={{ flexGrow: 1 }} color="textSecondary" gutterBottom>
               { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])}  <CancelAppointment appointmentID={ appointmentId } />
             </Typography>
             <Typography variant="body1">
             { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
             </Typography>
             <Typography style={{ marginBottom: 12 }} color="textSecondary">
             {/* Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Ver historia clínica</i> */}
             </Typography>
           </CardContent>
           <CardActions style={{ alignItems: 'flex-start' }} >
             <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{ textDecorationLine: 'none', color:'#718096' }}> { appointmentType === 'V' ?  <VideocamRoundedIcon style={{ color:'#F08F77' }} /> : null  } { appointmentType === 'A' ?  <PersonRoundedIcon style={{ color:'#27BEC2' }} /> : null } { appointmentTransformType ( appointmentType ) } </Link> </Button>
           </CardActions>
         </Card>
       </div>
      )
    }else if(appointmentStatus === 'upcoming'){
      return(
        <div style={{ padding:'0.5rem' }}>
         <Card variant="outlined" style={{ display: 'flex', borderRadius:'16px' }}>
           <CardMedia
             style={{ width: 110 }}
             image={ patientPhoto }
             title="Live from space album cover"
           />
           <CardContent>
             <Typography style={{ flexGrow: 1 }} color="textSecondary" gutterBottom>
               { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])} <CancelAppointment appointmentID={ appointmentId } />
             </Typography>
             <Typography variant="body1">
             { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
             </Typography>
             <Typography style={{ marginBottom: 12 }} color="textSecondary">
             {/* Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Ver historia clínica</i> */}
             </Typography>
           </CardContent>
           <CardActions style={{ alignItems: 'flex-start' }} >
             <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{ textDecorationLine: 'none', color:'#718096'}}> { appointmentType === 'V' ?  <VideocamRoundedIcon style={{ color:'#F08F77' }} /> : null  } { appointmentType === 'A' ?  <PersonRoundedIcon style={{ color:'#27BEC2' }} /> : null } { appointmentTransformType ( appointmentType ) } </Link> </Button>
           </CardActions>
         </Card>
       </div>
      )
    }else if(appointmentStatus === 'closed'){
      return(
        <div style={{ padding:'0.5rem'}}>
          <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#EDFAFA', borderRadius:'16px' }}>
            <CardMedia
              style= {{ width: 110 }}
              image={ patientPhoto }
              title="Live from space album cover"
            />
            <CardContent>
              <Typography style= {{ flexGrow: 1 }} color="textSecondary" gutterBottom>
                { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])} <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography variant="body1">
                { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography style= {{ marginBottom: 12 }} color="textSecondary">
                {/* Primera consulta  <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Dolor de cabeza</i> */}
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#BCF0DA', borderRadius:'50px', textTransform: 'lowercase' }}>
                <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{textDecorationLine: 'none', color:'#718096'}}> reabrir </Link>
              </Button>
            </CardActions>
          </Card>
        </div>
      )
    }else if(appointmentStatus === 'locked'){
      return(
        <div style={{ padding:'0.5rem'}}>
          <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#EDFAFA', borderRadius:'16px' }}>
            <CardMedia
              style= {{ width: 110 }}
              image={ patientPhoto }
              title="Live from space album cover"
            />
            <CardContent>
              <Typography style= {{ flexGrow: 1 }} color="textSecondary" gutterBottom>
              { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])} <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography variant="body1">
                { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography style= {{ marginBottom: 12 }} color="textSecondary">
                {/* Primera consulta  <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Dolor de cabeza</i> */}
              </Typography>
            </CardContent>
          </Card>
        </div>
      )
    }else if(appointmentStatus === 'cancelled'){
      const statusAuthor = props.appointmentData.extendedProps.statusAutor;
      if(statusAuthor === 'Patient'){
        return(
          <div style={{ padding:'0.5rem' }}>
            <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#FCE9E4', justifyContent: 'flex-start', borderRadius:'16px' }}>
              <CardMedia
                style={{width: 110}}
                //  image={ `https://thumbs.dreamstime.com/z/icono-de-l%C3%ADnea-perfil-usuario-s%C3%ADmbolo-empleado-avatar-web-y-dise%C3%B1o-ilustraci%C3%B3n-signo-aislado-en-fondo-blanco-192379539.jpg` || props.extendedProps.patient.photoUrl }
                image={ patientPhoto }
                title="Patient photo"
              />
              <CardContent>
                <Typography style={{flexGrow: 1}} color="textSecondary" gutterBottom>
                  { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
                  { calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) } <Link  variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelado por el paciente </Link> <DirectionsRunRoundedIcon style={{ color:'#F08F77' }} />
                </Typography>
                <Typography variant="body1">
                  { patientName + ` ` + patientLastName } <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
                </Typography>
                <Typography style={{  marginBottom: 12 }} color="textSecondary">
                  {/* Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link> */}
                </Typography>
              </CardContent>
              <CardActions style={{ alignItems: 'flex-start' }} >
                {/* <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>
                  <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{textDecorationLine: 'none', color:'#718096'}}> reabrir </Link>
                </Button> */}
              </CardActions>
            </Card>
          </div>
        )
      }
      return(
        <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#FCE9E4', justifyContent: 'flex-start', borderRadius:'16px' }}>
            <CardMedia
              style={{width: 110}}
              //  image={ `https://thumbs.dreamstime.com/z/icono-de-l%C3%ADnea-perfil-usuario-s%C3%ADmbolo-empleado-avatar-web-y-dise%C3%B1o-ilustraci%C3%B3n-signo-aislado-en-fondo-blanco-192379539.jpg` || props.extendedProps.patient.photoUrl }
              image={ patientPhoto }
              title="Patient photo"
            />
            <CardContent>
              <Typography style={{flexGrow: 1}} color="textSecondary" gutterBottom>
                { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
                { calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) } <Link  variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelaste esta cita </Link> <CancelSharpIcon style={{ color:'#F08F77' }} />
              </Typography>
              <Typography variant="body1">
                { patientName + ` ` + patientLastName } <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
              </Typography>
              <Typography style={{  marginBottom: 12 }} color="textSecondary">
                {/* Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link> */}
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              {/* <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>
                <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{textDecorationLine: 'none', color:'#718096'}}> reabrir </Link>
              </Button> */}
            </CardActions>
          </Card>
        </div>
      )
    }
  
  } else if(appointmentEventType === 'PrivateEvent'){
    return(
      <div style={{ padding:'0.5rem' }}>
        <Card variant="outlined" style={{ borderRadius:'16px', display: 'flex', backgroundColor: '#2C5282' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom style={{ flexGrow: 1, color: 'white' }}>
              { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] + calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) + ' - ' + appointmentEnd.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentEnd.split('T')[1].split('.')[0].split(':')[1] + calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) } 
              {/* <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> editar </Link> */}
            </Typography>
            <Typography variant="body1" style={{color: 'white'}}>
              Horario indisponible
            </Typography>
          </CardContent>
        </Card>
      </div> 
    )
  } 
  return(
    <h2>Nuevo evento no definido</h2>
  )
 }
 return( <>  </>)
}
return( <>  </>)
}

export function AppointmentTypeAfternoon( props ) {
  const appointmentStart = props.appointmentData.start;
  const appointmentEnd = props.appointmentData.end;
  const appointmentType = props.appointmentData.extendedProps.appointmentType;
  const appointmentEventType = props.appointmentData.extendedProps.type;
  const appointmentId = props.appointmentData.extendedProps.id;
  const appointmentStatus = props.appointmentData.extendedProps.status;
  const inicio = props.appointmentData.start;
 if(appointmentStart.split('T')[1].split('.')[0].split(':')[0] > 12){
  if(inicio.split('T')[0] === outputDate()){
  if(appointmentEventType === 'Appointment'){
    const patientName = props.appointmentData.extendedProps.patient.givenName;
    const patientLastName = props.appointmentData.extendedProps.patient.familyName;
    const patientPhoto = props.appointmentData.extendedProps.patient.photoUrl;
    if(appointmentStatus === 'open'){
      return(
        <div style={{ padding:'0.5rem' }}>
         <Card variant="outlined" style={{ display: 'flex', borderRadius:'16px' }}>
           <CardMedia
             style={{ width: 110 }}
             image={ patientPhoto }
             title="Live from space album cover"
           />
           <CardContent>
             <Typography style={{ flexGrow: 1 }} color="textSecondary" gutterBottom>
               { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])}  <CancelAppointment appointmentID={ appointmentId } />
             </Typography>
             <Typography variant="body1">
             { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
             </Typography>
             <Typography style={{ marginBottom: 12 }} color="textSecondary">
             {/* Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Ver historia clínica</i> */}
             </Typography>
           </CardContent>
           <CardActions style={{ alignItems: 'flex-start' }} >
             <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{ textDecorationLine: 'none', color:'#718096' }}> { appointmentType === 'V' ?  <VideocamRoundedIcon style={{ color:'#F08F77' }} /> : null  } { appointmentType === 'A' ?  <PersonRoundedIcon style={{ color:'#27BEC2' }} /> : null } { appointmentTransformType ( appointmentType ) } </Link> </Button>
           </CardActions>
         </Card>
       </div>
      )
    }else if(appointmentStatus === 'upcoming'){
      return(
        <div style={{ padding:'0.5rem' }}>
         <Card variant="outlined" style={{ display: 'flex', borderRadius:'16px' }}>
           <CardMedia
             style={{ width: 110 }}
             image={ patientPhoto }
             title="Live from space album cover"
           />
           <CardContent>
             <Typography style={{ flexGrow: 1 }} color="textSecondary" gutterBottom>
               { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])} <CancelAppointment appointmentID={ appointmentId } />
             </Typography>
             <Typography variant="body1">
             { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
             </Typography>
             <Typography style={{ marginBottom: 12 }} color="textSecondary">
             {/* Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Ver historia clínica</i> */}
             </Typography>
           </CardContent>
           <CardActions style={{ alignItems: 'flex-start' }} >
             <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{ textDecorationLine: 'none', color:'#718096'}}> { appointmentType === 'V' ?  <VideocamRoundedIcon style={{ color:'#F08F77' }} /> : null  } { appointmentType === 'A' ?  <PersonRoundedIcon style={{ color:'#27BEC2' }} /> : null } { appointmentTransformType ( appointmentType ) } </Link> </Button>
           </CardActions>
         </Card>
       </div>
      )
    }
    else if(appointmentStatus === 'closed'){
      return(
        <div style={{ padding:'0.5rem'}}>
          <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#EDFAFA', borderRadius:'16px' }}>
            <CardMedia
              style= {{ width: 110 }}
              image={ patientPhoto }
              title="Live from space album cover"
            />
            <CardContent>
              <Typography style= {{ flexGrow: 1 }} color="textSecondary" gutterBottom>
                { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
                {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])} <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography variant="body1">
                { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography style= {{ marginBottom: 12 }} color="textSecondary">
                {/* Primera consulta  <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Dolor de cabeza</i> */}
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#BCF0DA', borderRadius:'50px', textTransform: 'lowercase' }}>
                <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{textDecorationLine: 'none', color:'#718096'}}> reabrir </Link>
              </Button>
            </CardActions>
          </Card>
        </div>
      )
    }else if(appointmentStatus === 'locked'){
      console.log(appointmentStatus)
      return(
        <div style={{ padding:'0.5rem'}}>
          <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#EDFAFA', borderRadius:'16px' }}>
            <CardMedia
              style= {{ width: 110 }}
              image={ patientPhoto }
              title="Live from space album cover"
            />
            <CardContent>
              <Typography style= {{ flexGrow: 1 }} color="textSecondary" gutterBottom>
              { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
               {calculateHours(appointmentStart.split('T')[1].split('.')[0].split(':')[0])} <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography variant="body1">
                { patientName + ' ' + patientLastName } <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography style= {{ marginBottom: 12 }} color="textSecondary">
                {/* Primera consulta  <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Dolor de cabeza</i> */}
              </Typography>
            </CardContent>
          </Card>
        </div>
      )
    }else if(appointmentStatus === 'cancelled'){
      const statusAuthor = props.appointmentData.extendedProps.statusAutor;
      if(statusAuthor === 'Patient'){
        return(
          <div style={{ padding:'0.5rem' }}>
            <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#FCE9E4', justifyContent: 'flex-start', borderRadius:'16px' }}>
              <CardMedia
                style={{width: 110}}
                //  image={ `https://thumbs.dreamstime.com/z/icono-de-l%C3%ADnea-perfil-usuario-s%C3%ADmbolo-empleado-avatar-web-y-dise%C3%B1o-ilustraci%C3%B3n-signo-aislado-en-fondo-blanco-192379539.jpg` || props.extendedProps.patient.photoUrl }
                image={ patientPhoto }
                title="Patient photo"
              />
              <CardContent>
                <Typography style={{flexGrow: 1}} color="textSecondary" gutterBottom>
                  { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
                  { calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) } <Link  variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelado por el paciente </Link> <DirectionsRunRoundedIcon style={{ color:'#F08F77' }} />
                </Typography>
                <Typography variant="body1">
                  { patientName + ` ` + patientLastName } <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
                </Typography>
                <Typography style={{  marginBottom: 12 }} color="textSecondary">
                  {/* Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link> */}
                </Typography>
              </CardContent>
              <CardActions style={{ alignItems: 'flex-start' }} >
                {/* <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>
                  <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{textDecorationLine: 'none', color:'#718096'}}> reabrir </Link>
                </Button> */}
              </CardActions>
            </Card>
          </div>
        )
      }
      return(
        <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" style={{ display: 'flex', backgroundColor: '#FCE9E4', justifyContent: 'flex-start', borderRadius:'16px' }}>
            <CardMedia
              style={{width: 110}}
              //  image={ `https://thumbs.dreamstime.com/z/icono-de-l%C3%ADnea-perfil-usuario-s%C3%ADmbolo-empleado-avatar-web-y-dise%C3%B1o-ilustraci%C3%B3n-signo-aislado-en-fondo-blanco-192379539.jpg` || props.extendedProps.patient.photoUrl }
              image={ patientPhoto }
              title="Patient photo"
            />
            <CardContent>
              <Typography style={{flexGrow: 1}} color="textSecondary" gutterBottom>
                { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] }
                { calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) } <Link  variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelaste esta cita </Link> <CancelSharpIcon style={{ color:'#F08F77' }} />
              </Typography>
              <Typography variant="body1">
                { patientName + ` ` + patientLastName } <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
              </Typography>
              <Typography style={{  marginBottom: 12 }} color="textSecondary">
                {/* Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link> */}
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              {/* <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>
                <Link href={ callLink ( appointmentType , appointmentId ) } variant="body1" style={{textDecorationLine: 'none', color:'#718096'}}> reabrir </Link>
              </Button> */}
            </CardActions>
          </Card>
        </div>
      )
    }
  
  } else if(appointmentEventType === 'PrivateEvent'){
    return(
      <div style={{ padding:'0.5rem' }}>
        <Card variant="outlined" style={{ borderRadius:'16px', display: 'flex', backgroundColor: '#2C5282' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom style={{ flexGrow: 1, color: 'white' }}>
              { appointmentStart.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentStart.split('T')[1].split('.')[0].split(':')[1] + calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) + ' - ' + appointmentEnd.split('T')[1].split('.')[0].split(':')[0] + ':' + appointmentEnd.split('T')[1].split('.')[0].split(':')[1] + calculateHours ( appointmentStart.split('T')[1].split('.')[0].split(':')[0] ) } 
              {/* <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> editar </Link> */}
            </Typography>
            <Typography variant="body1" style={{color: 'white'}}>
              Horario indisponible
            </Typography>
          </CardContent>
        </Card>
      </div> 
    )
  } 
  return(
    <h2>Nuevo evento no definido</h2>
  )
 }
 return( <>  </>)
}
return( <>  </>)
}

export function eventDataConvert(event){
  const eventData = () => {
    if (event.type === 'appointment') {
      return 'appointment'
    } else if(event.extendedProps.type === 'PrivateEvent'){
      return 'evento privado'
    }else if(event.extendedProps.appointmentType === 'V'){
      return 'remoto'
    }else if(event.extendedProps.appointmentType === 'A'){
      return 'presencial'
    }
  }
  return {
    title: event.name || `${event.extendedProps.patient.givenName}`,
    start: event.start,
    end: event.end,
    // classNames: [eventData(event.type), 'boldo-event'],
    extendedProps: event,
  }
}
export function IconStatus( Appointment ) {
  const status = Appointment.appointment.extendedProps.status
  const appointmentId = Appointment.appointment.extendedProps.id
  return(
    <>
      {status === 'open' && <><CancelAppointment appointmentID={ appointmentId } /></>}
      {status === 'cancelled' && <> <Link variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelado por el paciente </Link> <DirectionsRunRoundedIcon style={{ color:'#F08F77' }} /> </>}
    </>
  )
  console.log('dentro del status: '+ status)
}
export function doctorData(){
  axios.get(`https://boldo-dev.pti.org.py/api/profile/doctor`)
  .then(res => {
    const persons = res.data;
    this.setState({ persons });
  })
}
export default function LoadAppointments(today) {
  const day = today.date.getDate();
  const month = '0' + (today.date.getMonth()+1);
  const year = today.date.getFullYear();
  const dateCalendar = `${year}-${month}-${day}`;
  const [date, setDate] = React.useState(new Date(today.date));
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const loadPost = async () => {
      const response = await axios.get<{ appointments: AppointmentWithPatient[]; token: string }>(
        "/profile/doctor/appointments?start=2022-05-24T04:00:00.000Z&end=" + dateCalendar + "T23:00:00.000Z")
        .then(res => {
          const response = res.data.appointments.map(event => eventDataTransform(event));
          ordersAppointments( response )
          setAppointments(response )
        })
    }
  loadPost();
  const intervalo=setInterval(()=>{ 
    loadPost()
     },10000) 
      
   return()=>clearInterval(intervalo)
  }, []);
  return (
    <>
      <div>
        <Paper variant="outlined" square style={{ borderRadius:'16px', backgroundColor: '#F9FAFB', padding:'1rem' }}>
          <Typography variant='h6' noWrap style={{ textAlign: 'left', flexGrow: 1 }}>
            Turno mañana
          </Typography>
          <Typography variant='subtitle1' noWrap style={{ flexGrow: 1, textAlign: 'left', color: '#6B7280' }}>
            07:00 am - 11:00 am
          </Typography>
          { appointments && appointments.map( (Appointment) => {
              return(
                <AppointmentType appointmentData={Appointment} />
              )
            }
          )}
        </Paper>
      </div>
      <div style={{ paddingTop: '20px'}}>
        <Paper style={{ backgroundColor: '#F9FAFB', padding:'1rem', borderRadius:'16px' }}>
          <Typography variant='h6' noWrap style={{ flexGrow: 1, textAlign: 'left' }}>
            Turno tarde
          </Typography>
          <Typography variant='subtitle1' noWrap style={{ flexGrow: 1, textAlign: 'left', color: '#6B7280'  }}>
            1:00 pm - 06:00 pm
          </Typography>
          { appointments && appointments.map( (Appointment) => {
              return(
                <AppointmentTypeAfternoon appointmentData={Appointment} />
              )
            }
          )}
          <NoAppointments />
        </Paper>
      </div>
    </>
  )
}
