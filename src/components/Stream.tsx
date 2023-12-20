import React, { useImperativeHandle, useRef, useEffect } from 'react'
import * as Sentry from '@sentry/react'

import { SetDebugValueFn, useWebRTCDebugger, WebRTCStats } from './WebRTCStats'
import { useCallStore } from '../store/callStore'
import { useLocation } from 'react-router-dom'
import { ICallStore } from '../store/types/types.store'

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

  const {
    setCurrentCallPath,
    peerConnectionStore,
    setPeerConnectionStore,
    setStreamRemote,
    streamRemote,
  } = useCallStore()

  const { sdpStats, iceStats, setDebugValue, active } = useWebRTCDebugger(false)

  const { pathname } = useLocation()

  useEffect(() => {
    if (!mediaStream || !room || !socket || !token) return

    createPeerConection({
      mediaStream,
      setStreamRemote,
      socket,
      room,
      token,
      setDebugValue,
      onCallStateChange,
      pathname,
      setCurrentCallPath,
      peerConnectionStore,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaStream, room, setDebugValue, socket, onCallStateChange, instance, token, pathname])

  useEffect(() => {
    if (remoteVideo.current) {
      remoteVideo.current.srcObject = streamRemote
    }
  }, [streamRemote])

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
  setStreamRemote: (arg: MediaStream) => void
  socket: SocketIOClient.Socket
  room: string
  token: string
  onCallStateChange: (arg: CallState) => void
  setDebugValue: SetDebugValueFn
  pathname: string
  setCurrentCallPath: ICallStore['setCurrentCallPath']
  peerConnectionStore: ICallStore['peerConnectionStore']
}

const createPeerConection = (props: createPeerConnectionProps) => {
  const {
    mediaStream,
    setStreamRemote,
    socket,
    room,
    token,
    onCallStateChange,
    setDebugValue,
    pathname,
    setCurrentCallPath,
    peerConnectionStore: pc,
  } = props

  let offerSent

  if (!['completed', 'connected'].includes(pc?.iceConnectionState)) {
    offerSent = false

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
      Sentry.setTag('iceConnectionState', pc.connectionState ?? '')
      Sentry.captureException(err)
    }

    // Handling incoming tracks
    pc.ontrack = ({ track, streams }: RTCTrackEvent) => {
      setStreamRemote(streams[0])
    }

    //
    // Begin: The perfect negotiation
    //
    // 2.
    // Handle SDP Offers
    //

    // Handle outgoing offers
    pc.onnegotiationneeded = async () => {
      try {
        if (!offerSent) {
          await pc.setLocalDescription(
            await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            })
          )
          socket.emit('sdp offer', { room: room, sdp: pc.localDescription, token })
          offerSent = true
        }
      } catch (err) {
        console.error(err)
        Sentry.setTag('iceConnectionState', pc.connectionState ?? '')
        Sentry.captureException(err)
      }
    }

    //
    // 3.
    // Handle ICE Candidates
    //
    // Handle outgoing candidates
    pc.onicecandidate = ({ candidate }: RTCPeerConnectionIceEvent) => {
      socket.emit('ice candidate', { room: room, ice: candidate, token })
    }
  }

  // Handle incoming candidates
  type CandidateMessage = { ice: RTCIceCandidate; room: string; fingerprint: string }
  socket.on('ice candidate', async (message: CandidateMessage) => {
    try {
      await pc.addIceCandidate(message.ice)
    } catch (err) {
      Sentry.setTag('iceConnectionState', pc.connectionState ?? '')
      Sentry.captureException(err)
      if (err instanceof TypeError) return console.log(err.message)
      throw err
    }
  })

  // Handle incoming offers
  type OfferMessage = { sdp: RTCSessionDescription; room: string; fingerprint: string }
  socket.on('sdp offer', async (message: OfferMessage) => {
    try {
      if (offerSent && pc.signalingState !== 'stable') await pc.setRemoteDescription(message.sdp)
    } catch (err) {
      Sentry.setTag('iceConnectionState', pc.connectionState ?? '')
      Sentry.captureException(err)
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
        setCurrentCallPath(pathname)
        break
      }
      case 'disconnected': {
        onCallStateChange('disconnected')
        // close if disconnected for 11 seconds
        timeout = setTimeout(() => onCallStateChange('closed'), 3 * 1000)
        break
      }
      case 'closed':
      case 'failed':
        onCallStateChange('closed')
        setCurrentCallPath('')
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

  // pc.ontrack = ontrack // 1
  // pc.onnegotiationneeded = onnegotiationneeded // 2
  // pc.onicecandidate = onicecandidate // 3
  pc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent // 4
  pc.onsignalingstatechange = handleSignalingStateChangeEvent // 4
}
