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
      <p>También podemos recopilar información</p>

    </>
  )
}

export default PrivacyPolicy