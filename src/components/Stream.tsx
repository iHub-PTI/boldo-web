import React, { useImperativeHandle, useState, useRef, useEffect, useCallback } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import adapter from 'webrtc-adapter'

type Props = {
  style?: React.CSSProperties
  className?: string
  room: string
  socket: SocketIOClient.Socket | undefined
  mediaStream: MediaStream | undefined
}

const Stream = React.forwardRef<HTMLVideoElement | undefined, Props>(
  ({ room, className, style, socket, mediaStream }, ref) => {
    const remoteVideo = useRef<HTMLVideoElement>(null)
    useImperativeHandle(ref, () => remoteVideo.current || undefined)

    const { sdpStats, iceStats, setDebugValue, active } = useWebRTCDebugger(false)

    useEffect(() => {
      if (!mediaStream || !room || !socket) return

      const setMediaStream = (stream: MediaStream) => {
        if (remoteVideo.current) remoteVideo.current.srcObject = stream
      }

      // During lifecycle of this component execute once
      // Establishes the WebRTC Call
      const { cleanup } = createPeerConection(mediaStream, setMediaStream, socket, room, setDebugValue)

      return () => {
        cleanup()
      }
    }, [mediaStream, room, setDebugValue, socket])

    return (
      <>
        <video playsInline autoPlay ref={remoteVideo} className={className} style={style} />
        <WebRTCStats iceStats={iceStats} sdpStats={sdpStats} active={active} />
      </>
    )
  }
)

export default Stream

type createPeerConection = (
  mediaStream: MediaStream,
  setMediaStream: (arg: MediaStream) => void,
  socket: SocketIOClient.Socket,
  room: string,
  setDebugValue: SetDebugValueFn
) => { pc: RTCPeerConnection; cleanup: () => void }

const createPeerConection: createPeerConection = (mediaStream, setMediaStream, socket, room, setDebugValue) => {
  let fingerprint = ''
  let makingOffer = false
  let ignoreOffer = false
  const polite = true

  const config = {
    iceServers: [{ urls: 'stun:stun.stunprotocol.org' }, { urls: 'stun:stun.l.google.com:19302' }],
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
  // The perfect negotiation logic
  //

  //
  // 2.
  // Handle SDP Offers
  //

  // Handle outgoing offers
  const onnegotiationneeded = async () => {
    // console.log('onnegotiationneeded')
    try {
      makingOffer = true
      await (pc as any).setLocalDescription()
      socket.emit('sdp offer', { room: room, sdp: pc.localDescription })
    } catch (err) {
      console.error(err)
    } finally {
      makingOffer = false
    }
  }
  // Handle incoming offers
  type OfferMessage = { sdp: RTCSessionDescription; room: string; fingerprint: string }
  socket.on('sdp offer', async (message: OfferMessage) => {
    if (!fingerprint) fingerprint = message.fingerprint
    else if (fingerprint !== message.fingerprint) return
    const description = message.sdp
    const offerCollision = description.type === 'offer' && (makingOffer || pc.signalingState !== 'stable')

    ignoreOffer = !polite && offerCollision
    if (ignoreOffer) return

    await pc.setRemoteDescription(description)
    if (description.type === 'offer') {
      await (pc as any).setLocalDescription()
      socket.emit('sdp offer', { room: room, sdp: pc.localDescription })
    }
  })

  //
  // 3.
  // Handle ICE Candidates
  //

  // Handle outgoing candidates
  const onicecandidate = ({ candidate }: RTCPeerConnectionIceEvent) => {
    socket.emit('ice candidate', { room: room, ice: candidate })
  }
  // Handle incoming candidates
  type CandidateMessage = { ice: RTCIceCandidate; room: string; fingerprint: string }
  socket.on('ice candidate', async (message: CandidateMessage) => {
    if (fingerprint !== message.fingerprint) return
    try {
      await pc.addIceCandidate(message.ice)
    } catch (err) {
      if (err instanceof TypeError) return console.log(err.message)
      if (!ignoreOffer) throw err
    }
  })

  //
  // 4.
  // Handle State Changes (currently NOOP)
  //

  // Handle |iceconnectionstatechange| events. This will detect
  // when the ICE connection is closed, failed, or disconnected.
  //
  // This is called when the state of the ICE agent changes.

  setDebugValue({ iceState: pc.iceConnectionState })
  const handleICEConnectionStateChangeEvent = async (event: Event) => {
    setDebugValue({ iceState: pc.iceConnectionState })
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

  // Handle the |icegatheringstatechange| event. This lets us know what the
  // ICE engine is currently working on: "new" means no networking has happened
  // yet, "gathering" means the ICE engine is currently gathering candidates,
  // and "complete" means gathering is complete. Note that the engine can
  // alternate between "gathering" and "complete" repeatedly as needs and
  // circumstances change.

  const handleICEGatheringStateChangeEvent = (event: Event) => {}

  // Hanlde the |connectionstatechange| event.

  const onconnectionstatechange = (event: Event) => {}

  // FIXME: Find out how to use getStats
  // const stats = await pc.getStats()

  pc.ontrack = ontrack // 1
  pc.onnegotiationneeded = onnegotiationneeded // 2
  pc.onicecandidate = onicecandidate // 3

  pc.onsignalingstatechange = handleSignalingStateChangeEvent // 4
  pc.oniceconnectionstatechange = handleICEConnectionStateChangeEvent // 4
  pc.onicegatheringstatechange = handleICEGatheringStateChangeEvent // 4
  pc.onconnectionstatechange = onconnectionstatechange // 4

  const cleanup = () => {
    socket.off('sdp offer')
    socket.off('ice candidate')

    pc.ontrack = null
    pc.onnegotiationneeded = null
    pc.onicecandidate = null

    pc.onsignalingstatechange = null
    pc.oniceconnectionstatechange = null
    pc.onicegatheringstatechange = null
    pc.onconnectionstatechange = null

    // pc.onremovetrack = null
    // pc.onremovestream = null

    pc.close()
  }

  return { pc, cleanup }
}

//
// Just for debugging!
//

const initialSdpStats = {
  stable: 0,
  'have-local-offer': 0,
  'have-remote-offer': 0,
  'have-local-pranswer': 0,
  'have-remote-pranswer': 0,
  closed: 0,
  current: '',
}
type SdpStats = typeof initialSdpStats
type SdpState = keyof Omit<SdpStats, 'current'>

const initialIceStats = {
  new: 0,
  checking: 0,
  connected: 0,
  completed: 0,
  failed: 0,
  disconnected: 0,
  closed: 0,
  current: '',
}
type IceStats = typeof initialIceStats
type IceState = keyof Omit<IceStats, 'current'>

type SetDebugValueFn = ({ iceState, sdpState }: { iceState?: IceState; sdpState?: SdpState }) => void

const useWebRTCDebugger = (active: boolean) => {
  const [sdpStats, setSdpStats] = useState<SdpStats>(initialSdpStats)
  const [iceStats, setIceStats] = useState<IceStats>(initialIceStats)

  const setDebugValue = useCallback(
    ({ iceState, sdpState }: { iceState?: IceState; sdpState?: SdpState }) => {
      if (!active) return
      if (iceState)
        setIceStats(iceStats => {
          const value = iceStats[iceState] + 1
          return { ...iceStats, [iceState]: value, current: iceState }
        })
      if (sdpState)
        setSdpStats(sdpStats => {
          const value = sdpStats[sdpState] + 1
          return { ...sdpStats, [sdpState]: value, current: sdpState }
        })
    },
    [active]
  )

  return { sdpStats, iceStats, setDebugValue, active }
}

const WebRTCStats = ({ sdpStats, iceStats, active }: { sdpStats: SdpStats; iceStats: IceStats; active: boolean }) => {
  if (!active) return null
  return (
    <div className='absolute z-50 flex w-full p-4 text-xs bg-white bottom-20' style={{ opacity: 0.95 }}>
      <div>
        <h3 className='font-bold'>SDP Offers</h3>
        <div className='grid grid-cols-2 gap-1'>
          <span className='font-semibold'>current:</span>
          <span>{sdpStats.current}</span>

          <span>stable</span>
          <span>{sdpStats['stable']}</span>

          <span>have-local-offer</span>
          <span>{sdpStats['have-local-offer']}</span>

          <span>have-remote-offer</span>
          <span>{sdpStats['have-remote-offer']}</span>

          <span>have-local-pranswer</span>
          <span>{sdpStats['have-local-pranswer']}</span>

          <span>have-remote-pranswer</span>
          <span>{sdpStats['have-remote-pranswer']}</span>

          <span>closed</span>
          <span>{sdpStats['closed']}</span>
        </div>
      </div>
      <div>
        <h3 className='font-bold text-md'>ICE connection state</h3>
        <div className='grid grid-cols-2 gap-1'>
          <span className='font-semibold'>current:</span>
          <span>{iceStats.current}</span>

          <span>new</span>
          <span>{iceStats['new']}</span>

          <span>checking</span>
          <span>{iceStats['checking']}</span>

          <span>connected</span>
          <span>{iceStats['connected']}</span>

          <span>completed</span>
          <span>{iceStats['completed']}</span>

          <span>failed</span>
          <span>{iceStats['failed']}</span>

          <span>disconnected</span>
          <span>{iceStats['disconnected']}</span>

          <span>closed</span>
          <span>{iceStats['closed']}</span>
        </div>
      </div>
    </div>
  )
}
