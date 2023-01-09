import React from 'react'

export const Download = () => {
  let device = navigator.userAgent
  if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/iPhone|iPad|iPod/i)) {
    window.location.href = 'https://apps.apple.com/us/app/boldo/id1614655648' //URL del APP Store
  } else {
    if (device.match(/Android/i)) {
      
      window.location.href = 'https://play.google.com/store/apps/details?id=py.org.pti.boldo' //URL del Play Store
    } else {
      window.location.href = 'https://www.pti.org.py/' //En el caso que el cliente este visitando desde un computador, lo enviamos a la web.
    }
  }
  return <></>
}
