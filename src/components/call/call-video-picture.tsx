import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { useCallStore } from '../../store/callStore'
import { useLocation } from 'react-router-dom'

const VWIDTH = 200
const VHEIGHT = 355

const initPicture = async (video: HTMLVideoElement, stream: MediaStream) => {
  try {
    // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (video) {
      video.srcObject = stream
      await video.play()
      video.width = VWIDTH
      video.height = VHEIGHT
    }
  } catch (error) {
    console.error('Error al obtener el stream o activar PiP:', error)
  }
}

const VideoPicture = () => {
  const video = useRef<HTMLVideoElement>(null)
  const location = useLocation()
  const [position, setPosition] = useState({
    bounds: {
      left: 0,
      top: 0,
      right: window.innerWidth - (VWIDTH + 5),
      bottom: window.innerHeight - (VHEIGHT + 5),
    },
    initialPos: {
      x: window.innerWidth - (VWIDTH + 20),
      y: window.innerHeight - (VHEIGHT + 20),
    },
  })
  const { streamRemote, setStreamRemote, openPicture, setOpenPicture } = useCallStore()

  useEffect(() => {
    const updateWindows = () => {
      setPosition({
        bounds: {
          left: 5,
          top: 5,
          right: window.innerWidth - (VWIDTH + 5),
          bottom: window.innerHeight - (VHEIGHT + 5),
        },
        initialPos: { x: window.innerWidth - (VWIDTH + 20), y: window.innerHeight - (VHEIGHT + 20) },
      })
    }
    window.addEventListener('resize', updateWindows)

    return () => {
      window.removeEventListener('resize', updateWindows)
    }
  }, [])

  useEffect(() => {
    if (streamRemote && openPicture) {
      initPicture(video.current, streamRemote)
    }
  }, [streamRemote, setStreamRemote, openPicture])

  useEffect(() => {
    if (location.pathname.match('call')) {
      setOpenPicture(false)
    } else {
      setOpenPicture(true)
    }
  }, [location, setOpenPicture])

  return streamRemote && openPicture ? (
    <Draggable bounds={position.bounds} defaultPosition={position.initialPos}>
      <video className={`absolute z-50 rounded-md shadow-2xl`} ref={video} style={{ width: VWIDTH, height: VHEIGHT }} />
    </Draggable>
  ) : (
    <></>
  )
}

export default VideoPicture
