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
    this.setState({ appointment: response });
   })
   console.log('desde componente: ', this.state.appointment);
 }

 render() {
  return (
  <>
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
        </Typography>
        <Typography variant="body1">
        {post.extendedProps.patient.givenName} {post.extendedProps.patient.familyName} <ContactPhoneRoundedIcon style={{color: '#27BEC2'}} />
        </Typography>
        <Typography style={{ marginBottom: 12 }} color="textSecondary">{/*className={classes.pos} */} 
        {/* Primera Consulta <i style={{color: '#27BEC2', textDecorationLine: 'underline'}}>Ver historia clínica</i> */}
        </Typography>
      </CardContent>
      <CardActions style={{ alignItems: 'flex-start' }} >
        <Button size="large" style={{backgroundColor: '#E5E7EB', borderRadius:'50px', textTransform: 'lowercase' }}> <Link href={`appointments/`+ post.extendedProps.id +`/call`} variant="body1" style={{textDecorationLine: 'none', color:'black'}}> <VideocamRoundedIcon style={{ color:'#F08F77' }} />remoto </Link> </Button>
      </CardActions>
    </Card>
  </div>
    )}
  </>
  )
 }
}
