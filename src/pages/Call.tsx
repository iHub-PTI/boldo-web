import * as React from 'react'
import { useHistory } from 'react-router-dom'

import { useSocket } from '../components/hooks/sockets'
import Camera from '../components/webRTC/Camera'
import Stream from '../components/webRTC/Stream'
import Layout from '../components/Layout'

const { useEffect, useState } = React

const CAPTURE_OPTIONS: MediaStreamConstraints = {
  audio: true,
  video: { width: 1280, height: 640 },
}

const Call = () => {
  const [roomID, setRoomID] = useState<string>('')

  const mediaStream = useUserMedia(CAPTURE_OPTIONS)
  const socket = useSocket()
  const history = useHistory()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const room = urlParams.get('room')
    if (!room) return alert('Invalid room ID.')
    setRoomID(room)
  }, [])

  const hangUp = async () => {
    if (socket) {
      socket.emit('end call', roomID)
      history.push('/dashboard')
    }
  }

  return (
    <Layout>
      <div className='m-10'>
        <div className='flex justify-between'>
          <div>
            <div className='flex'>
              <h1 className='text-3xl font-bold'>Video Call</h1>
              <button
                onClick={hangUp}
                className='flex items-center justify-center w-12 h-12 ml-4 text-white bg-red-600 rounded-full'
              >
                <svg
                  style={{ transform: 'rotate(134deg)' }}
                  height='30px'
                  width='30px'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
              </button>
            </div>

            <span className='text-gray-500 font-xl'>Room: {roomID}</span>
          </div>
          <span className='block mb-4 sm:ml-2 sm:inline-block'>
            <a href='/dashboard' className='font-bold underline'>
              &larr; Back
            </a>
          </span>
        </div>
      </div>
      <div className='m-10 md:flex md:items-end'>
        <div className='md:w-8/12'>
          <Stream roomID={roomID} className='rounded-lg' mediaStream={mediaStream} socket={socket} />
        </div>
        <div className='max-w-xs mt-8 md:ml-8 md:w-3/12 md:mt-0 md:max-w-none'>
          <Camera className='rounded-lg' mediaStream={mediaStream} style={{ transform: 'rotateY(180deg)' }} />
        </div>
      </div>
    </Layout>
  )
}

const useUserMedia = (requestedMedia: MediaStreamConstraints) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>()

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(requestedMedia)
        setMediaStream(stream)
      } catch (err) {
        console.log(err)
      }
    }

    if (!mediaStream) {
      enableStream()
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [mediaStream, requestedMedia])

  return mediaStream
}

export default Call
