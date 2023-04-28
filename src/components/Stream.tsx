import React, { useImperativeHandle, useRef, useEffect } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from 'webrtc-adapter'

import { SetDebugValueFn, useWebRTCDebugger, WebRTCStats } from './WebRTCStats'

export type CallState = 'connecting' | 'connected' | 'disconnected' | 'closed'

type Props = {
  room: string
  token: string
  instance: number
  socket: SocketIOClient.Socket | undefined
  mediaStream: MediaStream | undefined
  onCallStateChange: (arg: CallState) => void
}

const Stream = React.forwardRef<HTMLVideoElement | undefined, Props>((props, ref) => {
  const { room, token, instance, socket, mediaStream, onCallStateChange } = props

  const remoteVideo = useRef<HTMLVideoElement>(null)
  useImperativeHandle(ref, () => remoteVideo.current || undefined)

  const { sdpStats, iceStats, setDebugValue, active } = useWebRTCDebugger(false)

  useEffect(() => {
    if (!mediaStream || !room || !socket || !token) return

    const setMediaStream = (stream: MediaStream) => {
      if (remoteVideo.current) remoteVideo.current.srcObject = stream
    }

    const { cleanup } = createPeerConection({
      mediaStream,
      setMediaStream,
      socket,
      room,
      token,
      setDebugValue,
      onCallStateChange,
    })

    return () => {
      cleanup()
    }
  }, [mediaStream, room, setDebugValue, socket, onCallStateChange, instance, token])

  return (
    <>
      <video playsInline autoPlay ref={remoteVideo} className='w-full h-full' />
      <WebRTCStats iceStats={iceStats} sdpStats={sdpStats} active={active} />
    </>
  )
})

export default Stream

interface createPeerConnectionProps {
  mediaStream: MediaStream
  setMediaStream: (arg: MediaStream) => void
  socket: SocketIOClient.Socket
  room: string
  token: string
  onCallStateChange: (arg: CallState) => void
  setDebugValue: SetDebugValueFn
}

const createPeerConection = (props: createPeerConnectionProps) => {
  const { mediaStream, setMediaStream, socket, room, token, onCallStateChange, setDebugValue } = props

  const config = {
    iceServers: [
      {
        urls: 'turn:coturn.pti.org.py:3478',
        username: 'coturn',
        credential: 'VHJ1cGVyMjB4MjB4Lgo',
      },
      {
        urls: 'stun:coturn.pti.org.py:3478',
        username: 'coturn',
        credential: 'VHJ1cGVyMjB4MjB4Lgo',
      },
    ],
  }

  const pc = new RTCPeerConnection(config)

  //
  // 1.
  // Handle Audio/Video Tracks
  //

  // Handle outgoing tracks
  try {
    for (const track of mediaStream.getTracks()) {
      pc.addTrack(track, mediaStream)
    }
  } catch (err) {
    console.error(err)
  }
  // Handling incoming tracks
  const ontrack = ({ track, streams }: RTCTrackEvent) => {
    setMediaStream(streams[0])
  }

  //
  // Begin: The perfect negotiation
  //
  // 2.
  // Handle SDP Offers
  //

  // Handle outgoing offers
  const onnegotiationneeded = async () => {
    try {
      await pc.setLocalDescription(await pc.createOffer())
      socket.emit('sdp offer', { room: room, sdp: pc.localDescription, token })
    } catch (err) {
      console.error(err)
    }
  }
  // Handle incoming offers
  type OfferMessage = { sdp: RTCSessionDescription; room: string; fingerprint: string }
  socket.on('sdp offer', async (message: OfferMessage) => {
    await pc.setRemoteDescription(message.sdp)
  })

  //
  // 3.
  // Handle ICE Candidates
  //

  // Handle outgoing candidates
  const onicecandidate = ({ candidate }: RTCPeerConnectionIceEvent) => {
    socket.emit('ice candidate', { room: room, ice: candidate, token })
  }
  // Handle incoming candidates
  type CandidateMessage = { ice: RTCIceCandidate; room: string; fingerprint: string }
  socket.on('ice candidate', async (message: CandidateMessage) => {
    try {
      await pc.addIceCandidate(message.ice)
    } catch (err) {
      if (err instanceof TypeError) return console.log(err.message)
      throw err
    }
  })

  //
  // 4.
  // Handle State Changes
  //

  // Handle |iceconnectionstatechange| events. This will detect
  // when the ICE connection is closed, failed, or disconnected.
  //
  // This is called when the state of the ICE agent changes.
  // Important for us as this is the main source about failed conections.

  let timeout: NodeJS.Timeout

  const handleConnectionState = () => {
    clearTimeout(timeout)
    switch (pc.iceConnectionState) {
      case 'new':
      case 'checking': {
        onCallStateChange('connecting')
        break
      }
      case 'completed':
      case 'connected': {
        onCallStateChange('connected')
        break
      }
      case 'disconnected': {
        onCallStateChange('disconnected')
        // close if disconnected for 11 seconds
        timeout = setTimeout(() => onCallStateChange('closed'), 11 * 1000)
        break
      }
      case 'closed':
      case 'failed':
        onCallStateChange('closed')
        break
    }
  }

  handleConnectionState()
  setDebugValue({ iceState: pc.iceConnectionState })
  const handleICEConnectionStateChangeEvent = async (event: Event) => {
    setDebugValue({ iceState: pc.iceConnectionState })
    handleConnectionState()
  }

  // Set up a |signalingstatechange| event handler. This will detect when
  // the signaling connection is closed.
  //
  // NOTE: This will actually move to the new RTCPeerConnectionState enum
  // returned in the property RTCPeerConnection.connectionState when
  // browsers catch up with the latest version of the specification!

  setDebugValue({ sdpState: pc.signalingState })
  const handleSignalingStateChangeEvent = (event: Event) => {
    setDebugValue({ sdpState: pc.signalingState })
  }

  pc.ontrack = ontrack // 1
  pc.onnegotiationneeded = onnegotiationneeded // 2
  pc.onicecandidate = onicecandidate // 3
  pc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent // 4
  pc.onsignalingstatechange = handleSignalingStateChangeEvent // 4

  // FIXME: Probably should handle if track gets removed.

  const cleanup = () => {
    socket.off('sdp offer')
    socket.off('ice candidate')

    pc.ontrack = null
    pc.onnegotiationneeded = null
    pc.onicecandidate = null
    pc.oniceconnectionstatechange = null
    pc.onsignalingstatechange = null

    // FIXME: Probably should remove track in cleanup.

    pc.close()

    console.log('🧹 cleaned 🧹')
  }

  return { pc, cleanup }
}
