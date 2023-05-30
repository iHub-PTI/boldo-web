import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © Boldo - '}
      <Link color="inherit" href="https://www.pti.org.py/">
        Fundación Parque Tecnológico Itaipu
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: "url(https://sso-dev.pti.org.py/auth/resources/7ty9m/login/pti-health/img/background.svg)",
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'absolute',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  separator: {
    marginTop: '2rem',
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));

export default function PrivacyPolicy() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
        POLITICA DE PRIVACIDAD
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {'ALCANCE Y CONSENTIMIENTO'}
        </Typography>
        <Typography variant="body1" className={classes.separator}>Usted acepta esta Política de Privacidad al registrarse, acceder o utilizar los servicios, contenido, funcionalidades, tecnología o funciones disponibles de Boldo.</Typography>
        <Typography variant="h5" component="h2" gutterBottom className={classes.separator}>
          {'RECOPILACIÓN DE INFORMACIÓN PERSONAL'}
        </Typography>
        <Typography variant="body1" className={classes.separator}>
          Recopilamos la siguiente información personal con el fin de proporcionarle el uso de los servicios de Boldo y poder personalizar y mejorar su experiencia.
        </Typography>
        <Typography variant="body1" className={classes.separator}>Información que recopilamos automáticamente: información que nos envía su teléfono móvil u otro dispositivo de acceso: dirección de IP del dispositivo, identificación del dispositivo o identificador único, tipo de dispositivo, identificación del navegador e información de geolocalización.</Typography>
        <Typography variant="body1" className={classes.separator}>Información que usted nos proporciona: cualquier información que nos proporcione al usar Boldo, incluso cuando incluye información en un formulario web, incorpora o actualiza la información de su cuenta, participa en discuciones, charlas o resoluciones de controversias en la comunidad, o cuando se comunica con nosotros para tratar acerca del servicios Boldo: Información de contacto, como su nombre y apellido, sexo, fecha de nacimiento, número de documento de indentidad, tipo de documento, dirección, número de teléfono, correo electrónico y otra información similar; información médica, como dianósticos, recetas, medicamentos que consume, le son recetados y/o dispensados, indicaciones médicas, etc.</Typography>
        <Typography variant="body1" className={classes.separator}>También podemos recopilar información de usted o acerca de usted de otras fuentes, como por ejemplo, a través de comunicaciones con nosotros, lo que incluye a nuestro equipo de soporte técnico, sus resusltados cuando responde una encuesta y sus interacciones con los miembros del equipo de boldo u otras empresas (sujeto a sus políticas de priv acidad y a las leyes vigentes). Además, para fines de calidad y capacitación o por su propia protección, Boldo puede controlar o grabar las conversaciones telefónicas que tengamos con usted o con cualquier persona que actúe en su nomnbre. Al comunicarse con el soporte técnico de Boldo, usted reconoce que la comunicación podría ser escuchada, controlada o grabada sin notificación o advertencia.</Typography>
        <Typography variant="body1" className={classes.separator}>Puede optar por proporcionarnos acceso a cierta información personal almacenada por terceros, tales como sitios de redes sociales (por ejemplo, Facebook y Twitter). La información que podemos recibir varía según el sitio y es controlada por dicho sitio. Al asociar una cuenta administrada por un tercero con su cuenta de Boldo y al autorizar a Boldo a tener acceso a esta información, usted acepta que Boldo pueda recopilar, almacenar y utilizar esta información de acuerdo con esta Política de Privacidad.</Typography>
        <Typography variant="body1" className={classes.separator}>Autenticación y detección de fraudes: A fin de poder protegerlo contra fraudes y el mal uso de su información personal, podemos recopilar información acerca de usted y de sus interacciones con el servicio de Boldo. Como utilizamos la información personal que recopilamos</Typography>
        <Typography variant="body1" className={classes.separator}>Nuestro principal objetivo al recopilar información personal es proporcionarle una experiencia segura, fluida, eficiente y personalizada. Podemos utilizar su información personal para: </Typography>
        <Typography variant="body1">
        a. Verificar su identidad, incluso durante los procesos de creación de la cuenta y de restablecimiento de la contraseña, asignación de roles en la plataforma, etc.
        </Typography>
        <Typography variant="body1">
        b. Administar riesgos o detectar, prevenir y/o remediar actos prohibidos o ilegales.
        </Typography>
        <Typography variant="body1">
        c. Detectar, prevenir o remediar infracciones de las políticas o condiciones de uso aplicables.
        </Typography>
        <Typography variant="body1">
        d. Mejorar el servicio mediante la personalización de la experiencia del usuario.
        </Typography>
        <Typography variant="body1">
        e. Administrar y proteger nuestra infraestructura de tecnología de la información.
        </Typography>
        <Typography variant="body1">
        f. Proporcionar mercadeo y publicidad dirigida, notificaciones de actualizaciones de servicios y ofertas promocionales.
        </Typography>
        <Typography variant="body1">
        g. Comunicarnos en cualquier número de teléfono, mediante una llamada de voz o por medio de texto (SMS) o mensajes de correo electrónico.
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        Podemos contactarlo por vía telefónica o por correo postal para notificarlo de información relacionada con su cuenta, solucionar problemas con su cuenta, resolver una controversia, agrupar sus opiniones a través de encuestas o cuestionarios o de otro modo, según sea necesario para brindar servicio técnico a su cuenta. Además, podemos contactarlo para ofrecerle cupones, descuentos y poromociones, y para informarle acerca de Boldo.
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        Finalmente, podemos según sea necesario para fines de cumplimiento de nuestras políticas, de las leyes vigentes o de cualquier acuerdo que pudiéramos tener con usted. Al contactarnos con usted por vía telefónica de la forma más eficiente podemos utilizar, y usted da su concentimiento para recibir, llamadas de marcación automática o pregrabadas y mensajes de texto.
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom className={classes.separator}>
          {'DIVULGACIÓN DE CONTENIDO'}
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        Salvo la cláusula que sigue, sin su concentimiento explícito, no vendemos ni alquilamos ni divulgamos su información particular a terceros.
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        En caso que se detecte algún servicio fraudulento, Boldo notificará a los usuarios afectados con todos los datos del responsable.
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        Boldo generará información médica estadística y podrá compartir, a su solo criterio, con autoridades de salud nacionales, departamentales y municipales. No se compartirá, salvo medidas legales especiales, información personal individualizada.
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        Boldo generará información médica estadística y podrá compartir, a su solo criterio, con autoridades y organismos de salud internacionales y transnacionales. No se compartirá, salvo medidas legales especiales, información personal individualizada.
        </Typography>
        <Typography variant="body1" className={classes.separator}>
        Boldo generará información estadística de medicamentos recetados y/o dispensados y podrá comercializar y/o compartir, a su solo criterio, con empresas farmaceúticas y laboratorios. No se compartirá, salvo medidas legales especiales, información personal individualizada.
        </Typography>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">Boldo APP</Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}