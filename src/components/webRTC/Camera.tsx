import * as React from 'react'

const { useRef } = React

type Props = {
  style?: any
  poster?: any
  className?: string
  mediaStream: any
}

const Camera: React.FC<Props> = ({ style, poster, className, mediaStream }) => {
  const videoRef = useRef(null)

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream
  }

  function handleCanPlay() {
    videoRef.current.play()
  }

  return (
    <video
      ref={videoRef}
      onCanPlay={handleCanPlay}
      autoPlay
      playsInline
      muted
      style={style}
      poster={poster}
      className={className}
    />
  )
}

export default Camera
