import React from 'react';
import axios from 'axios';
import { addDays, differenceInDays, differenceInMinutes, differenceInSeconds, parseISO } from 'date-fns'
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles'
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

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    backgroundColor: 'white',
  },
  styleCalendar: {
    // paddingTop: theme.spacing(4),
    // paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: '100vh',
  },

  // Start CSS ###################################################################################################################################
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // End CSS ###################################################################################################################################

  // Start | Dropdown for filter Daily - Mensual - Semanal
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // End | Dropdown for filter Daily - Mensual - Semanal
//Start | Simple card
  pos: {
    marginBottom: 12,
  },
  //End | Simple card
  appointmentSucess: {
    display: 'flex',
    backgroundColor: '#EDFAFA',
  },
  appointmenCancel: {
    display: 'flex',
    backgroundColor: '#FCE9E4',
    justifyContent: 'flex-start',
  },
  appointmentUnavailable: {
    display: 'flex',
    backgroundColor: '#2C5282',
  },
  noAppointment: {
    display: 'flex',
    backgroundColor: '#F9FAFB',
  },
  logo: {
    // with: '10px',
    padding: '10px',
    height: '60px',
  }, gris: {
    backgroundColor: '#F9FAFB',
    padding:'1rem',
  },
  appoinmentText: {
    color: '#6B7280',
  },
  foto:{
    width: '70px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  cover: {
    width: 110,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  modal5: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper5: {
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))
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
function outputDate(){
  const date = new Date();
  const outputDate = date.getFullYear()+ '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String( date.getDate()).padStart(2, '0');
  return outputDate
}
function appointmentType(appointmentType){
  if(appointmentType === 'V'){
    return 'remoto'
  }else if(appointmentType === 'A'){
    return 'presencial'
  }

}

function ordersAppointments(array){
  const ordersAppointments = array.sort((a, b) => a.start > b.start);
  console.log('entro a ordenar')
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
export function iconStatus() {

}
export default class LoadAppointments extends React.Component {
  
 state = {
  appointment: []
 }

async componentDidMount() {
    await axios.get<{ appointments: AppointmentWithPatient[]; token: string }>(
    // `/profile/doctor/appointments`)
    `/profile/doctor/appointments?start=`+outputDate()+`T04:00:00.000Z&end=`+outputDate()+`T23:30:00.000Z`)
 .then(res => {
    const response = res.data.appointments.map(event => eventDataTransform(event));
    console.log(response)
    ordersAppointments(response)
    this.setState({ appointment: response });
   })
   console.log('desde componente: ', this.state.appointment);
 }

 


 render() {
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
        { this.state.appointment.map(post => 
        
        <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" style={{ display: 'flex', borderRadius:'16px' }}> {/*className={classes.root}*/} 
            <CardMedia
              style={{ width: 110 }}
              image={post.extendedProps.patient.photoUrl}
              title="Live from space album cover"
            />
            <CardContent>
              <Typography style={{ flexGrow: 1 }} color="textSecondary" gutterBottom> {/*className={classes.title} */} 
                {/* { 'Fecha: ' + post.start.split('T')[0] + ' ' } */}
                {/* { 'Hora: ' + post.start.split('T')[1].split('.')[0].split(':')[0] + ':' + post.start.split('T')[1].split('.')[0].split(':')[1] } */}
                { post.start.split('T')[1].split('.')[0].split(':')[0] + ':' + post.start.split('T')[1].split('.')[0].split(':')[1] }
                {calculateHours(post.start.split('T')[1].split('.')[0].split(':')[0])}
                {/* {appointmentStatus(post.extendedProps.status)} */}
                
              </Typography>
              <Typography variant="body1">
              {post.extendedProps.patient.givenName} {post.extendedProps.patient.familyName} <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography style={{ marginBottom: 12 }} color="textSecondary">{/*className={classes.pos} */} 
              {/* Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Ver historia clínica</i> */}
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <Link href={callLink( post.extendedProps.appointmentType, post.extendedProps.id )} variant="body1" style={{textDecorationLine: 'none', color:'black'}}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />{appointmentType(post.extendedProps.appointmentType)} </Link> </Button>
            </CardActions>
          </Card>
        </div>

        // {/* TODO: HORARIO INDISPONIBLE */}
        // {/* <div style={{ padding:'0.5rem' }}>
        //   <Card variant="outlined" className={classes.appointmentUnavailable} style={{ borderRadius:'16px'}}>
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom style={{ color: 'white' }}>
        //         06:00 am - 07:00 am <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> editar </Link>
        //       </Typography>
        //       <Typography variant="body1" style={{color: 'white'}}>
        //         Horario indisponible
        //       </Typography>
        //     </CardContent>
        //   </Card>
        // </div> */}

        // {/* <div style={{ padding:'0.5rem' }}>
        //   <Card variant="outlined" className={classes.appointmenCancel} style={{ borderRadius:'16px' }}>
          
        //     <CardMedia
        //         className={classes.cover}
        //         image="/img/photo.jpeg"
        //         title="Live from space album cover"
        //       />
        //     <CardContent>
        //         <Typography className={classes.title} color="textSecondary" gutterBottom>
        //           07:00 am 
        //           <Link variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}>
        //             Cancelaste esta cita 
        //           </Link>
        //           <CancelSharpIcon style={{ color:'#F08F77' }} />
        //         </Typography>
        //         <Typography variant="body1">
        //           Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
        //         </Typography>
        //         <Typography className={classes.pos} color="textSecondary">
        //           Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link>
        //           </Typography>
        //       </CardContent>
              
        //       <CardActions style={{ alignItems: 'flex-start' }} >
        //         <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //       </CardActions>
              
        //   </Card>
        // </div>

        // <div style={{ padding:'0.5rem'}}>
        //   <Card variant="outlined" className={classes.appointmentSucess} style={{ borderRadius:'16px' }}>
        //     <CardMedia
        //       className={classes.cover}
        //       image="/img/photo.jpeg"
        //       title="Live from space album cover"
        //     />
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom>
        //         07:30 am <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
        //       </Typography>
        //       <Typography variant="body1">
        //         Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
        //       </Typography>
        //       <Typography className={classes.pos} color="textSecondary">
        //         Primera consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Dolor de cabeza</i>
        //       </Typography>
        //     </CardContent>
        //     <CardActions style={{ alignItems: 'flex-start' }} >
        //       <Button size="large" style={{backgroundColor: '#BCF0DA', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //     </CardActions>
        //   </Card>
        // </div>

        // <div style={{ padding:'0.5rem'}}>
        //   <Card variant="outlined" className={classes.appointmentSucess} style={{ borderRadius:'16px' }}>
        //     <CardMedia
        //       className={classes.cover}
        //       image="/img/photo.jpeg"
        //       title="Live from space album cover"
        //     />
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom>
        //         08:00 am <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
        //       </Typography>
        //       <Typography variant="body1">
        //         Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
        //       </Typography>
        //       <Typography className={classes.pos} color="textSecondary">
        //         Primera consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Fiebre</i>
        //       </Typography>
        //     </CardContent>
        //     <CardActions style={{ alignItems: 'flex-start' }} >
        //       <Button size="large" style={{backgroundColor: '#BCF0DA', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //     </CardActions>
        //   </Card>
        // </div>

        // <div style={{ padding:'0.5rem' }}>
        //   <Card variant="outlined" className={classes.appointmenCancel} style={{ borderRadius:'16px' }}>
        //   <CardMedia
        //       className={classes.cover}
        //       image="/img/photo.jpeg"
        //       title="Live from space album cover"
        //     />
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom>
        //         10:00 am <Link variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelado por el paciente </Link> <DirectionsRunRoundedIcon style={{ color:'#F08F77' }} />
        //       </Typography>
        //       <Typography variant="body1">
        //         Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
        //       </Typography>
        //       <Typography className={classes.pos} color="textSecondary">
        //         Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link>
        //       </Typography>
        //     </CardContent>
        //     <CardActions style={{ alignItems: 'flex-start' }} >
        //       <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //     </CardActions>
        //   </Card>
        // </div>

        // <div style={{ padding:'0.5rem' }}>
        //   <Card variant="outlined" className={classes.appointmenCancel} style={{ borderRadius:'16px' }}>
        //     <CardMedia
        //       className={classes.cover}
        //       image="/img/photo.jpeg"
        //       title="Live from space album cover"
        //     />
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom>
        //         10:30 am  <Link variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelado por el paciente </Link> <DirectionsRunRoundedIcon style={{ color:'#F08F77' }} />
        //       </Typography>
        //       <Typography variant="body1">
        //         Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
        //       </Typography>
        //       <Typography className={classes.pos} color="textSecondary">
        //       Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link>
        //       </Typography>
        //     </CardContent>
        //     <CardActions style={{ alignItems: 'flex-start' }} >
        //       <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //     </CardActions>
        //   </Card>
        // </div>

        // <div style={{ padding:'0.5rem' }}>
        // <Card variant="outlined" className={classes.appointmenCancel} style={{ borderRadius:'16px' }}>
        //   <CardMedia
        //       className={classes.cover}
        //       image="/img/photo.jpeg"
        //       title="Live from space album cover"
        //     />
        //   <CardContent>
        //     <Typography className={classes.title} color="textSecondary" gutterBottom>
        //       10:30 am <Link variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelaste esta cita </Link> <CancelSharpIcon style={{ color:'#F08F77' }} />
        //     </Typography>
        //     <Typography variant="body1">
        //       Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
        //     </Typography>
        //     <Typography className={classes.pos} color="textSecondary">
        //       Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link>
        //       </Typography>
        //   </CardContent>
        //   <CardActions style={{ alignItems: 'flex-start' }} >
        //       <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //     </CardActions>
        // </Card>
        // </div>

        // <div style={{ padding:'0.5rem'}}>
        //   <Card variant="outlined" className={classes.appointmentSucess} style={{ borderRadius:'16px' }}>
        //     <CardMedia
        //       className={classes.cover}
        //       image="/img/photo.jpeg"
        //       title="Live from space album cover"
        //     />
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom>
        //         11:00 pm <Link variant="body1" style={{color: '#27BEC2', textDecorationLine: 'none'}}> Atendido </Link> <CheckCircleRoundedIcon style={{color: '#27BEC2'}} />
        //       </Typography>
        //       <Typography variant="body1">
        //         Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
        //       </Typography>
        //       <Typography className={classes.pos} color="textSecondary">
        //         Primera consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Fiebre</i>
        //       </Typography>
        //     </CardContent>
        //     <CardActions style={{ alignItems: 'flex-start' }} >
        //       <Button size="large" style={{backgroundColor: '#BCF0DA', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
        //     </CardActions>
        //   </Card>
        // </div> */}

        // {/* SIN AGENDAMIENTOS */}
        // {/* <div style={{ padding:'0.5rem' }}>
        //   <Card className={classes.noAppointment}>
        //     <CardMedia style={{display:'flex', alignItems: 'center', paddingLeft: '10px', color:'#E2E8F0'}}>
        //       <MoreVertIcon fontSize={'large'} style={{alignItems:'center'}} />
        //     </CardMedia>
        //     <CardContent>
        //       <Typography className={classes.title} color="textSecondary" gutterBottom>
        //         sin agendamientos entre las 11:00 am y las 11:30 am 
        //       </Typography>
        //       <Typography variant="body1">
        //         <Link href="#" variant="body1"> 
        //           <Button aria-controls="fade-menu" aria-haspopup="true" style={{color: '#27BEC2', textDecorationLine: 'underline', textTransform: 'lowercase'}} onClick={handleClick}>
        //             agregar
        //           </Button>
        //           <Menu
        //             id="fade-menu"
        //             anchorEl={anchorEl2}
        //             keepMounted
        //             open={open2}
        //             onClose={handleClose}
        //             TransitionComponent={Fade}
        //           >
        //             <MenuItem onClick={handleClose}>
        //               <div>
        //                 <button type="button" onClick={handleOpen5}>
        //                   Marcar indisponibilidad
        //                 </button>
        //                 <Modal
        //                   aria-labelledby="transition-modal-title"
        //                   aria-describedby="transition-modal-description"
        //                   className={classes.modal5}
        //                   open={open5}
        //                   onClose={handleClose5}
        //                   closeAfterTransition
        //                   BackdropComponent={Backdrop}
        //                   BackdropProps={{
        //                     timeout: 500,
        //                   }}
        //                 >
        //                   <Fade in={open5}>
        //                     <div className={classes.paper5}>
        //                       <h2 id="transition-modal-title">Marcar indisponibilidad</h2>
        //                       <p id="transition-modal-description">Seleccione los horarios correspondientes</p>
        //                       <Button id="transition-modal-description">03:30 pm</Button>
        //                       <Button id="transition-modal-description">04:00 pm</Button>
        //                       <Button id="transition-modal-description">04:30 pm</Button>
        //                       <Button id="transition-modal-description">05:00 pm</Button>
        //                       <Button id="transition-modal-description">05:30 pm</Button>
        //                       <Button style={{backgroundColor: '#27BEC2', color:'white'}} id="transition-modal-description">Confirmar</Button>
        //                     </div>
        //                   </Fade>
        //                 </Modal>
        //               </div>
        //             </MenuItem>
        //             <MenuItem onClick={handleClose}>Marcar cita para paciente</MenuItem>
        //           </Menu>
        //         </Link>
        //       </Typography>

        //     </CardContent>
        //   </Card>
        // </div> */}
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
        
        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.root} style={{ borderRadius:'16px' }}>
            <CardMedia
              className={classes.cover}
              image="/img/photo.jpeg"
              title="Live from space album cover"
            />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                01:00 pm
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Dolores</i>
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />remoto</Button>
            </CardActions>
          </Card>
        </div> */}
        
        {/* CANCELAR CITA POR EL PACIENTE */}
        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.appointmenCancel} style={{ borderRadius:'16px' }}>
            <CardMedia
                className={classes.cover}
                image="/img/photo.jpeg"
                title="Live from space album cover"
              />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
              01:00 pm <Link variant="body1" style={{color: '#F08F77', textDecorationLine: 'none'}}> Cancelado por el paciente </Link> <DirectionsRunRoundedIcon style={{ color:'#F08F77' }} />
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{ color:'#F08F77' }} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Primera consulta <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> Ver historia clínica </Link>
                </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
                <Button size="large" style={{backgroundColor: '#FCBEAF', borderRadius:'50px', textTransform: 'lowercase' }}>reabrir</Button>
              </CardActions>
          </Card>
        </div> */}

        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.root} style={{ borderRadius:'16px' }}>
            <CardMedia
              className={classes.cover}
              image="/img/photo.jpeg"
              title="Live from space album cover"
            />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                05:00 pm
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Fiebre</i>
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />remoto</Button>
            </CardActions>
          </Card>
        </div> */}
        
        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.root} style={{ borderRadius:'16px' }}>
            <CardMedia
              className={classes.cover}
              image="/img/photo.jpeg"
              title="Live from space album cover"
            />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                03:00 pm
                <Button aria-controls="fade-menu" aria-haspopup="true" style={{color: '#F08F77', textDecorationLine: 'underline'}} onClick={handleClick}>
                  editar
                </Button>
                <Menu
                  id="fade-menu"
                  anchorEl={anchorEl2}
                  keepMounted
                  open={open2}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleClose}>Remarcar</MenuItem>
                  <MenuItem onClick={handleClose}>No compareció</MenuItem>
                  <MenuItem onClick={handleClose}>Cancelar</MenuItem>
                </Menu>
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Malestar Estomacal</i>
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />iniciar</Button>
            </CardActions>
          </Card>
        </div> */}

        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.root} style={{ borderRadius:'16px' }}>
            <CardMedia
              className={classes.cover}
              image="/img/photo.jpeg"
              title="Live from space album cover"
            />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                03:30 pm
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>COVID-19</i>
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />remoto</Button>
            </CardActions>
          </Card>
        </div>

        <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.root} style={{ borderRadius:'16px' }}>
            <CardMedia
              className={classes.cover}
              image="/img/photo.jpeg"
              title="Live from space album cover"
            />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                04:00 pm
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>COVID-19</i>
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />remoto</Button>
            </CardActions>
          </Card>
        </div> */}


        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.appointmentUnavailable} style={{ borderRadius:'16px'}}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom style={{ color: 'white' }}>
                03:30 am - 04:00 am <Link href="#" variant="body1" style={{color: '#F08F77', textDecorationLine: 'underline'}}> editar </Link>
              </Typography>
              <Typography variant="body1" style={{color: 'white'}}>
                Horario indisponible
              </Typography>
            </CardContent>
          </Card>
        </div> */}


        {/* <div style={{ padding:'0.5rem' }}>
          <Card variant="outlined" className={classes.root} style={{ borderRadius:'16px' }}>
            <CardMedia
              className={classes.cover}
              image="/img/photo.jpeg"
              title="Live from space album cover"
            />
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                04:30 pm
              </Typography>
              <Typography variant="body1">
                Francisco Mancuello Vazquez <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>COVID-19</i>
              </Typography>
            </CardContent>
            <CardActions style={{ alignItems: 'flex-start' }} >
              <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />remoto</Button>
            </CardActions>
          </Card>
        </div> */}

        {/* <div style={{ padding:'0.5rem' }}>
          <Card className={classes.noAppointment}>
            <CardMedia style={{display:'flex', alignItems: 'center', paddingLeft: '10px', color:'#E2E8F0'}}>
              <MoreVertIcon fontSize={'large'} style={{alignItems:'center'}} />
            </CardMedia>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                sin agendamientos entre las 03:30 pm y las 06:00 pm 
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
                          Marcar indisponibilidad
                        </button>
                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          className={classes.modal5}
                          open={open5}
                          onClose={handleClose5}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                          }}
                        >
                          <Fade in={open5}>
                            <div className={classes.paper5}>
                              <h2 id="transition-modal-title">Marcar indisponibilidad</h2>
                              
                              <p id="transition-modal-description">Seleccione los horarios correspondientes</p>
                              <Button id="transition-modal-description">02:00 pm</Button>
                              <Button id="transition-modal-description">02:30 pm</Button>
                              <Button id="transition-modal-description">03:30 pm</Button>
                              <Button id="transition-modal-description">04:00 pm</Button>
                              <Button id="transition-modal-description">04:30 pm</Button>
                      
                              <Button id="transition-modal-description">05:30 pm</Button>
                              <Button style={{backgroundColor: '#27BEC2', color:'white'}} id="transition-modal-description">Confirmar</Button>
                            </div>
                          </Fade>
                        </Modal>
                      </div>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>Marcar cita para paciente</MenuItem>
                    
                  </Menu>
                </Link>
              </Typography>

            </CardContent>
          </Card>
        </div> */}

      </Paper>
      </div>
      </>
    

  )
 }
}
