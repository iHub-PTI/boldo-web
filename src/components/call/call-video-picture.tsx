import React, { useEffect, useRef } from 'react'
import Draggable from 'react-draggable'

const initPicture = async (video: HTMLVideoElement) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (video) {
      video.srcObject = stream
      const aspectRatio = 16 / 9
      const width = 200
      const height = width / aspectRatio
      video.width = width
      video.height = height
      await video.play()
    }
  } catch (error) {
    console.error('Error al obtener el stream o activar PiP:', error)
  }
}

const VideoPicture = () => {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    initPicture(video.current)
  }, [])

  return (
    <Draggable>
      <video className='absolute z-50 rounded-md shadow bottom-10 right-20 hover:cursor-pointer' ref={video} />
    </Draggable>
  )
}

export default VideoPicture
