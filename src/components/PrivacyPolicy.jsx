import React, { useEffect, createContext, useState, useContext, useRef, useMemo } from 'react'
import axios from 'axios'
import { Route, Switch, Redirect } from 'react-router-dom'
import io from 'socket.io-client'

const PrivacyPolicy = () => {
  return(
    <>
      <h1>POLITICA DE PRIVACIDAD</h1>
      <p> Alcance y consentimiento </p>
      <p>Usted acepta esta Política de Privacidad al registrarse, acceder o utilizar los servicios, contenido, funcionalidades, tecnología o funciones disponibles de Boldo.</p>
      <h2>RECOPILACIÓN DE INFORMACIÓN PERSONAL</h2>
      <p>Recopilamos la siguiente información personal con el fin de proporcionarle el uso de los servicios de Boldo y poder personalizar y mejorar su experiencia.</p>
      <p>Información que recopilamos automáticamente: información que nos envía su teléfono móvil u otro dispositivo de acceso: dirección de IP del dispositivo, identificación del dispositivo o identificador único, tipo de dispositivo, identificación del navegador e información de geolocalización.</p>
      <p>Información que usted nos proporciona: cualquier información que nos proporcione al usar Boldo, incluso cuando incluye información en un formulario web, incorpora o actualiza la información de su cuenta, participa en discuciones, charlas o resoluciones de controversias en la comunidad, o cuando se comunica con nosotros para tratar acerca del servicios Boldo: Información de contacto, como su nombre y apellido, sexo, fecha de nacimiento, número de documento de indentidad, tipo de documento, dirección, número de teléfono, correo electrónico y otra información similar; información médica, como dianósticos, recetas, medicamentos que consume, le son recetados y/o dispensados, indicaciones médicas, etc.</p>
      <p>También podemos recopilar información de usted o acerca de usted de otras fuentes, como por ejemplo, a través de comunicaciones con nosotros, lo que incluye a nuestro equipo de soporte técnico, sus resusltados cuando responde una encuesta y sus interacciones con los miembros del equipo de boldo u otras empresas (sujeto a sus políticas de priv acidad y a las leyes vigentes). Además, para fines de calidad y capacitación o por su propia protección, Boldo puede controlar o grabar las conversaciones telefónicas que tengamos con usted o con cualquier persona que actúe en su nomnbre. Al comunicarse con el soporte técnico de Boldo, usted reconoce que la comunicación podría ser escuchada, controlada o grabada sin notificación o advertencia.</p>
      <p>Puede optar por proporcionarnos acceso a cierta información personal almacenada por terceros, tales como sitios de redes sociales (por ejemplo, Facebook y Twitter). La información que podemos recibir varía según el sitio y es controlada por dicho sitio. Al asociar una cuenta administrada por un tercero con su cuenta de Boldo y al autorizar a Boldo a tener acceso a esta información, usted acepta que Boldo pueda recopilar, almacenar y utilizar esta información de acuerdo con esta Política de Privacidad.</p>
      <p>Autenticación y detección de fraudes: A fin de poder protegerlo contra fraudes y el mal uso de su información personal, podemos recopilar información acerca de usted y de sus interacciones con el servicio de Boldo. Como utilizamos la información personal que recopilamos</p>
      <p>Nuestro principal objetivo al recopilar información personal es proporcionarle una experiencia segura, fluida, eficiente y personalizada. Podemos utilizar su información personal para: </p>
      <ol>
        <li>Verificar su identidad, incluso durante los procesos de creación de la cuenta y de restablecimiento de la contraseña, asignación de roles en la plataforma, etc.</li>
        <li>Administar riesgos o detectar, prevenir y/o remediar actos prohibidos o ilegales.</li>
        <li>Detectar, prevenir o remediar infracciones de las políticas o condiciones de uso aplicables.</li>
        <li>Mejorar el servicio mediante la personalización de la experiencia del usuario.</li>
        <li>Administrar y proteger nuestra infraestructura de tecnología de la información.</li>
        <li>Proporcionar mercadeo y publicidad dirigida, notificaciones de actualizaciones de servicios y ofertas promocionales.</li>
        <li>Comunicarnos en cualquier número de teléfono, mediante una llamada de voz o por medio de texto (SMS) o mensajes de correo electrónico.</li>
      </ol>
      <p>Podemos contactarlo por vía telefónica o por correo postal para notificarlo de información relacionada con su cuenta, solucionar problemas con su cuenta, resolver una controversia, agrupar sus opiniones a través de encuestas o cuestionarios o de otro modo, según sea necesario para brindar servicio técnico a su cuenta. Además, podemos contactarlo para ofrecerle cupones, descuentos y poromociones, y para informarle acerca de Boldo.</p>
      <p>Finalmente, podemos según sea necesario para fines de cumplimiento de nuestras políticas, de las leyes vigentes o de cualquier acuerdo que pudiéramos tener con usted. Al contactarnos con usted por vía telefónica de la forma más eficiente podemos utilizar, y usted da su concentimiento para recibir, llamadas de marcación automática o pregrabadas y mensajes de texto.</p>
      <h2>DIVULGACIÓN DE CONTENIDO</h2>
      <p>Salvo la cláusula que sigue, sin su concentimiento explícito, no vendemos ni alquilamos ni divulgamos su información particular a terceros.</p>
      <p>En caso que se detecte algún servicio fraudulento, Boldo notificará a los usuarios afectados con todos los datos del responsable.</p>
      <p>Boldo generará información médica estadística y podrá compartir, a su solo criterio, con autoridades de salud nacionales, departamentales y municipales. No se compartirá, salvo medidas legales especiales, información personal individualizada.</p>
      <p>Boldo generará información médica estadística y podrá compartir, a su solo criterio, con autoridades y organismos de salud internacionales y transnacionales. No se compartirá, salvo medidas legales especiales, información personal individualizada.</p>
      <p>Boldo generará información estadística de medicamentos recetados y/o dispensados y podrá comercializar y/o compartir, a su solo criterio, con empresas farmaceúticas y laboratorios. No se compartirá, salvo medidas legales especiales, información personal individualizada.</p>
    </>
  )
}

export default PrivacyPolicy