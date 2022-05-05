import React from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MoreIcon from '@material-ui/icons/MoreVert'
// Start | Import Material UI for DropDown
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
// End | Import Material UI for DropDown
//Start | Simple card
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
//End | Simple card
import ContactPhoneRoundedIcon from '@material-ui/icons/ContactPhoneRounded';
import DirectionsRunRoundedIcon from '@material-ui/icons/DirectionsRunRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CardMedia from '@material-ui/core/CardMedia';
import Backdrop from '@material-ui/core/Backdrop';

const drawerWidth = 240

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

export default function Settings2() {
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
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const open3 = Boolean(anchorEl3);
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };
  const theme = useTheme();
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  // Start ###################################################################################################################################
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }
  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget)
  }
  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem  onClick={handleMenuClose}>
        <Link href="/settingsnew" variant="body1" style={{textDecorationLine: 'none', color:'black'}}> Mi cuenta </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
      <Link href="/validate" variant="body1" style={{textDecorationLine: 'none', color:'black'}}> Registro de paciente </Link>
        </MenuItem>
      <MenuItem onClick={handleMenuClose}>
      <Link href="https://www.apple.com/app-store/" variant="body1" style={{textDecorationLine: 'none', color:'black'}}> Descargar la app del paciente para IOS </Link>
        </MenuItem>
      <MenuItem onClick={handleMenuClose}>Descargar la app del paciente para Andriod</MenuItem>
      <MenuItem onClick={handleMenuClose}>Soporte</MenuItem>
      <MenuItem onClick={handleMenuClose}>Cerrar sesión</MenuItem>
    </Menu>
  )
  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  // End #########################################################################

  // Start | Dropdown for filter Daily - Mensual - Semanal
  const [age, setAge] = React.useState('')
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string)
  }
  // End | Dropdown for filter Daily - Mensual - Semanal
  return (
    <div className={classes.root}>
      <CssBaseline />
      
      <AppBar
        position='absolute'
        className={clsx(classes.appBar, open && classes.appBarShift)}
        style={{ color: 'black', backgroundColor: 'white' }}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <Typography className={classes.title} variant='h6' noWrap>
            Configuraciones
          </Typography>
          
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label='show 17 new notifications' color='inherit'>
              <Badge badgeContent={17} color='secondary'>
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}

      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        {/* CONTENIDO DEL DRAWER IZQUIERDO */}
        <div>
          <img src='/img/logo.svg' alt='Boldo' className={classes.logo} />
        </div>
        {/*END - CONTENIDO DEL DRAWER IZQUIERDO */}
        
        {/*START - Botones menu para barra izquierda */}
        {/* <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div> */}
        {/*END - Botones menu para barra izquierda */}

        <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <CalendarTodayOutlinedIcon />
        </IconButton>
        <Link href="/home" variant="body1" style={{textDecorationLine: 'none', color:'black'}}> Agendamientos </Link>
      </MenuItem>

      </Drawer>
      {/* CONTENIDO DEL BODY */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container className={classes.styleCalendar} style={{ paddingTop: '8%', maxWidth:'100%',paddingLeft: '0px', paddingRight:'0px'}}>
          <Grid container spacing={3} style={{ flexWrap: 'nowrap' }}>
            {/* Dashboard calendar */}
            <Grid item xs={12} md={3} lg={3} className={fixedHeightPaper}>

            </Grid>

            <Grid item xs={9} md={6} lg={6} className={fixedHeightPaper}>
              <div>
                <Paper variant="outlined" square className={classes.gris} style={{ borderRadius:'16px' }}>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Disponibilidad
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Días de disponibilidad
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    D L M X J V S
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Horario
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Desde
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Hasta
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Disponible para citas precenciales
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Disponible para citas remotas
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Duración de cada segmento (en min.)
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    15 min
                  </Typography>
                </Paper>
              </div>
              <div>
                <Paper variant="outlined" square className={classes.gris} style={{ borderRadius:'16px' }}>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Agendamientos
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    El paciente puede marcar consultas
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Solamente si ya es mi paciente
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Solamente si se trata de una consulta de seguimiento
                  </Typography>
                  <Typography className={classes.title} variant='h6' noWrap style={{ textAlign: 'left' }}>
                    Siempre
                  </Typography>
                </Paper>
              </div>
            </Grid>

            <Grid item xs={12} md={3} lg={3} className={fixedHeightPaper}>

            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  )
}
