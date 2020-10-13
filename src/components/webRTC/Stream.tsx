import * as React from 'react'

const { useRef, useEffect } = React

type Props = {
  style?: any
  className?: string
  roomID: string
  socket: SocketIOClientStatic
  mediaStream: any
  onRemoteStream?: (any) => null
}

const Stream: React.FC<Props> = ({ roomID, className, style, socket, mediaStream, onRemoteStream }) => {
  const localMedia = useRef<any>()
  const socketRef = useRef<any>()
  const remoteUser = useRef<any>()
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const rtcPeerConnection = useRef<any>()

  const onUnload = async () => {
    await socketRef.current.emit('disconnect')
  }

  useEffect(() => {
    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0
    var eventName = iOS ? 'pagehide' : 'beforeunload'

    window.addEventListener(eventName, onUnload)

    if (mediaStream) {
      console.log('connect')
      localMedia.current = mediaStream

      socketRef.current = socket

      socketRef.current.emit('start call', roomID)

      socketRef.current.on('call partner', partnerID => {
        console.log('call partner')
        rtcPeerConnection.current = createPeerConnection(partnerID)
        localMedia.current.getTracks().forEach(track => rtcPeerConnection.current.addTrack(track, localMedia.current))

        remoteUser.current = partnerID
      })

      socketRef.current.on('call host', hostID => {
        console.log('call host')
        remoteUser.current = hostID
      })

      socketRef.current.on('offer', incomingOffer => {
        console.log('offer')
        rtcPeerConnection.current = createPeerConnection(null)
        rtcPeerConnection.current
          .setRemoteDescription(new RTCSessionDescription(incomingOffer.sdp))
          .then(() => {
            localMedia.current
              .getTracks()
              .forEach(track => rtcPeerConnection.current.addTrack(track, localMedia.current))
          })
          .then(() => {
            return rtcPeerConnection.current.createAnswer()
          })
          .then(answer => {
            return rtcPeerConnection.current.setLocalDescription(answer)
          })
          .then(() => {
            const payload = {
              target: incomingOffer.caller,
              caller: socketRef.current.id,
              sdp: rtcPeerConnection.current.localDescription,
            }

            socketRef.current.emit('answer', payload)
          })
      })

      socketRef.current.on('answer', payload => {
        console.log('answer')
        rtcPeerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.sdp))
      })

      socketRef.current.on('ice-candidate', incomingCandidate => {
        console.log('ice-candidate')
        rtcPeerConnection.current.addIceCandidate(new RTCIceCandidate(incomingCandidate))
      })

      socketRef.current.on('user disconnects', () => {
        remoteUser.current = null
        rtcPeerConnection.current = null
        remoteVideo.current.srcObject = null
      })
    }

    return () => window.removeEventListener(eventName, onUnload)
  }, [mediaStream])

  function createPeerConnection(userID) {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.stunprotocol.org',
        },
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com',
        },
      ],
    })

    peerConnection.onnegotiationneeded = () => {
      rtcPeerConnection.current
        .createOffer()
        .then(offer => {
          return rtcPeerConnection.current.setLocalDescription(offer)
        })
        .then(() => {
          const payload = {
            target: userID,
            caller: socketRef.current.id,
            sdp: rtcPeerConnection.current.localDescription,
          }

          socketRef.current.emit('offer', payload)
        })
        .catch(e => console.log(e))
    }

    peerConnection.onicecandidate = e => {
      if (e.candidate) {
        const payload = {
          target: remoteUser.current,
          candidate: e.candidate,
        }

        socketRef.current.emit('ice-candidate', payload)
      }
    }

    peerConnection.ontrack = e => {
      if (mediaStream && remoteVideo.current) {
        remoteVideo.current.srcObject = e.streams[0]
        if (onRemoteStream) onRemoteStream(e.streams[0])
      }
    }

    return peerConnection
  }

  return <video playsInline autoPlay ref={remoteVideo} className={className} style={style} />
}

export default Stream
