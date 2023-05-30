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

export default function TermsOfService() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>TÉRMINOS DE SERVICIO</Typography>

        <Typography variant="body1" className={classes.separator}>El presente es un documento importante que usted debe leer atentamente antes de decidir utilizar los servicios de Boldo. Al usar los servicios del sitio Boldo usted acepta las condiciones de uso de la plataforma que se describen a continuación.</Typography>
        <Typography variant="body1" className={classes.separator}>El presente documento es un contrato entre usted y Fundación Parque Tecnológico Itaipú (PTI-PY) (en adelante Boldo), propietaria de la marca registrada Boldo. Los términos del presente documento tienen carácter de contrato de adhesión y se aplica al relacionamiento entre Boldo y Ud. como consecuencia del uso de los servicios ofrecidos por Boldo. El solo hecho del uso del acceso y uso de los servicios Boldo implica que usted acepta todos los términos y condiciones contenidos en este documento.</Typography>
        <Typography variant="body1" className={classes.separator}>Boldo se reserva el derecho de modificar el contenido del presente acuerdo, en cualquier momento y a su entero criterio, mediante la publicación de una nueva versión de este en el sitio web de Boldo. La versión revisada entrará en vigor al momento de su publicación. Es responsabilidad exclusiva suya la revisión frecuente de este documento.</Typography>
        <Typography variant="body1" className={classes.separator}>Usted es el único responsable de comprender y dar cumplimiento a todas y cada una de las leyes, normas y regulaciones que se le puedan aplicar en relación con el uso que haga de los servicios de Boldo, incluyendo, pero sin limitarse a, toda actividad relacionada a la generación de recetas médicas, fichas médicas, registro de medicamentos, farmacias, laboratorios, etc. y cualquier otro servicios tangibles e intangibles.</Typography>

        <Typography variant="h5" component="h2" gutterBottom className={classes.separator}>DEFINICIONES</Typography>

        <Typography variant="body1" className={classes.separator}>Boldo es la proveedora de los servicios que se ofrecen a través de una plataforma de gestión y automatización de recetas médicas, consultas médicas, fichas médicas y otros servicios conexos, que serán descritos a lo largo de este documento y sus anexos.</Typography>
        <Typography variant="body1" className={classes.separator}>Receta médica electrónica (RME). Es la receta médica con validez legal en el país que permite generar Boldo de manera electrónica.</Typography>
        <Typography variant="body1" className={classes.separator}>Consulta médica remota (CMR). Es el servicio que ofrece Boldo para realizar consultas médicas de una forma no presencial (remota).</Typography>
        <Typography variant="body1" className={classes.separator}>Médico. Es aquel usuario de Boldo que utilizará los servicios para generar las RME y atender las CMR.</Typography>
        <Typography variant="body1" className={classes.separator}>Paciente. Es aquel usuario de Boldo que tiene acceso a las recetas médicas que le fueran emitidas tanto de forma presencial como remota por los Médicos.</Typography>
        <Typography variant="body1" className={classes.separator}>Farmacéutico. Es aquel usuario de Boldo que tiene acceso a las recetas médicas para ser dispensadas a los pacientes.</Typography>
        <Typography variant="body1" className={classes.separator}>Conducta inapropiada. Es aquella que atenta contra las buenas costumbres y convivencia de los distintos usuarios de Boldo, la propia plataforma y los miembros del staff.</Typography>
        <Typography variant="body1" className={classes.separator}>Conducta fraudulenta. Es aquella que está orientada al incumplimiento, por parte de los usurarios, con los términos del presente documento y/o la generación de contenido ilegal o fraudulento derivado de servicios que son proporcionados por la plataforma de Boldo.</Typography>

        <Typography variant="h5" component="h2" gutterBottom className={classes.separator}>GENERALIDADES</Typography>

        <Typography variant="body1" className={classes.separator}>Plataforma de gestión abierta. Boldo es una plataforma de gestión de servicios y relacionados a medicina y telemedicina de uso general, abierta y apta para mayores de edad. Por lo tanto, queda prohibida utilización de la plataforma para fines para los que no fue construida. Queda prohibido, el uso de esta para difusión, promoción y comercialización de productos de contenido sexual tales como: pornografía, prostitución, artículos y juguetes sexuales, armas de fuego, cigarrillos y drogas ilegales, contenido de terceros que estén protegidos por propiedad intelectual y que no tengan autorización de comercialización, etc. Finalmente, Boldo se reserva el derecho de eliminar contenido que a su solo criterio sea considerado como inapropiado para la tienda.</Typography>
        <Typography variant="body1" className={classes.separator}>Responsabilidad. Boldo no tiene responsabilidad alguna en relación con las recetas emitidas, despachadas y/o consultas médicas, realizadas a través de la plataforma. El Médico y Farmacéutico son los únicos responsables por los servicios que él brindan a través de Boldo. De igual manera, el Paciente es el único responsable por usar correctamente los servicios destinados a él en la plataforma. Los únicos responsables por las transacciones de receta, consulta y otros servicios son los usuarios. Boldo no tiene responsabilidad alguna en las transacciones entre las partes citadas, ni en la calidad de los servicios médicos de consulta, receta, etc. ni en el cumplimiento o veracidad de la descripción de estos.</Typography>

        <Typography variant="h5" component="h2" gutterBottom className={classes.separator}>CONDICIONES DE LOS SERVICIOS OFRECIDOS POR BOLDO</Typography>

        <Typography variant="h5" component="h3" gutterBottom className={classes.separator}>Boldo provee los siguientes servicios a médicos:</Typography>

        <Typography variant="body1">a) Capacidad de generar y emitir recetas médicas electrónicas a través del módulo de RME.</Typography>
        <Typography variant="body1">b) Capacidad de agendar y atender a los pacientes de forma remota a través del módulo de CMR.</Typography>
        <Typography variant="body1">c) Catálogo de medicamentos precargados y configurados en la plataforma.</Typography>
        <Typography variant="body1">d) Servicio de completado automático de datos de pacientes vía comunicación con servicios del Departamento de Identificaciones de la Policía Nacional.</Typography>

        <Typography variant="h5" component="h3" gutterBottom className={classes.separator}>Requisitos y responsabilidades de médicos:</Typography>

        <Typography variant="body1">a) Pueden ser médicos personas físicas mayores de edad, habilitadas legalmente por el MSP.</Typography>
        <Typography variant="body1">b) El médico deberá crear un logín para identificarse en la plataforma. En tal sentido, Boldo podrá disponer de los mecanismos de gestión de usuarios, alternativamente podrá poner a disposición mecanismos que permitan enlazar el login de Boldo a otros sistemas de gestión de usuarios.</Typography>
        <Typography variant="body1">c) El médico deberá completar con sus datos personales el formulario de registro. Boldo podrá solicitar, pero no limitarse a, los siguientes datos personales: Nombres y Apellidos, Sexo, Nacionalidad, Edad, Tipo de Documento, Número de Cedula de Identidad, Número de RUC, Dirección, Departamento, Ciudad, Número de registro profesional, Teléfonos y Correo Electrónico.</Typography>
        <Typography variant="body1">d) El médico es el único responsable por la carga veraz y correcta de: sus datos personales, las recetas, los diagnósticos e indicaciones médicas, los medicamentos que indican y emiten.</Typography>        

        <Typography variant="h5" component="h3" gutterBottom className={classes.separator}>Boldo provee los siguientes servicios a farmacéuticos:</Typography>

        <Typography variant="body1">a) Capacidad de dispensar los medicamentos a los pacientes de forma remota a través del módulo de RME.</Typography>
        <Typography variant="body1">b) Servicio de completado automático de datos de paciente a quienes se emitió la receta electrónica.</Typography>

        <Typography variant="h5" component="h3" gutterBottom className={classes.separator}>Requisitos y responsabilidades de farmacéuticos:</Typography>

        <Typography variant="body1">a) Pueden ser farmacéuticos personas físicas mayores de edad, habilitadas por sus respetivas farmacias.</Typography>
        <Typography variant="body1">b) El farmacéutico deberá crear un logín para identificarse en la plataforma. En tal sentido, Boldo podrá disponer de los mecanismos de gestión de usuarios, alternativamente podrá poner a disposición mecanismos que permitan enlazar el login de Boldo a otros sistemas de gestión de usuarios.</Typography>
        <Typography variant="body1">c) El farmacéutico deberá utilizar un logín genérico de toda la farmacia a la cual está asignado para acceder a ella.</Typography>
        <Typography variant="body1">d) El farmacéutico es el único responsable por la carga veraz y correcta de sus datos personales y recetas dispensadas a pacientes.</Typography>

        <Typography variant="h5" component="h3" gutterBottom className={classes.separator}>Boldo provee los siguientes servicios a pacientes:</Typography>

        <Typography variant="body1">a) Capacidad para visualizar las recetas que le fueron emitidas de forma remota a través del módulo de RME.</Typography>
        <Typography variant="body1">b) Capacidad para agendar y consultar con médicos en forma remota a través del módulo de CMR.</Typography>

        <Typography variant="h5" component="h3" gutterBottom className={classes.separator}>Requisitos y responsabilidades de pacientes:</Typography> 

        <Typography variant="body1">a) Pueden ser pacientes personas físicas mayores de edad.</Typography>
        <Typography variant="body1">b) El paciente deberá crear un logín para identificarse en la plataforma. En tal sentido, Boldo podrá disponer de los mecanismos de gestión de usuarios, alternativamente podrá poner a disposición mecanismos que permitan enlazar el login de Boldo a otros sistemas de gestión de usuarios.</Typography>
        <Typography variant="body1">c) El paciente deberá completar con sus datos personales el formulario de registro. Boldo podrá solicitar, pero no limitarse a, los siguientes datos personales: Nombres y Apellidos, Sexo, Nacionalidad, Edad, Tipo de Documento, Número de Cedula de Identidad, Dirección, Departamento, Ciudad, Teléfonos y Correo Electrónico.</Typography>
        <Typography variant="body1">d) El paciente es el único responsable por el uso correcto de la herramienta para sus consultas, recetas médicas y medicamentos que le fueron recetados y dispensados.</Typography>

        <Typography variant="h5" component="h2" gutterBottom className={classes.separator}>CANCELACIÓN DE CUENTAS</Typography>

        <Typography variant="body1" className={classes.separator}>Boldo se reserva el derecho de cancelar las cuentas de usuarios a su entera discreción. Sin embargo, se destaca que incurrir en conductas inapropiadas y/o fraudulentas son causales importantes de cancelación de cuentas y el cese de los servicios de Boldo. Boldo se reserva el derecho de advertir y/o abrir sumario a usuarios previamente a la cancelación de cuentas.</Typography>
        <Typography variant="body1" className={classes.separator}>En caso de cancelación de cuentas por conductas inapropiadas o fraudulentas, los usuarios pierden cualquier reclamo que puedan hacer a Boldo por cualquier vía: administrativa, civil, penal y/o defensa al consumidor. De igual manera, los usuarios con cuentas canceladas pierden el derecho de reclamar indemnización alguna.</Typography>
        <Typography variant="body1" className={classes.separator}>Boldo se reserva el derecho de hacer denuncias penales, civiles y/o defensa al consumidor a usuarios que hayan incurrido en conductas inapropiadas y/o fraudulentas.</Typography>

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