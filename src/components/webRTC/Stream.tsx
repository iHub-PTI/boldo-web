import React from 'react'
import { useHistory } from 'react-router-dom'
const { useRef, useEffect } = React

interface Offer {
  sdp: RTCSessionDescriptionInit

  appointmentId: string
}

type Props = {
  style?: React.CSSProperties
  className?: string
  roomID: string
  socket: SocketIOClient.Socket | undefined
  mediaStream: MediaStream | undefined
  _ref: any // React.RefObject<HTMLVideoElement> | null
}

// FIXME: This file needs urgent fixing for cleaning up conections.
// Currently there are listeners set that are not removed afterwards.
// The problem exists in Both: SocketIO and WebRTC
// For SocketIO see: https://stackoverflow.com/a/34716449/5157205
// For WebRTC See Ticket Info

const Stream: React.FC<Props> = ({ _ref, roomID, className, style, socket, mediaStream }) => {
  const localMedia = useRef<MediaStream>()
  const socketRef = useRef<SocketIOClient.Socket>()
  const remoteUser = useRef<string>()
  const remoteVideo = useRef<HTMLVideoElement>(null)

  // FIXME: this is not a very pretty way of handeling this
  // We are passing the ref to the video to the parent component.
  // Essentialy we are creating here a ref.current.current which seems to be a hack.
  if (_ref) _ref.current = remoteVideo

  const rtcPeerConnection = useRef<RTCPeerConnection>()
  const history = useHistory()

  useEffect(() => {
    var iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0
    var eventName = iOS ? 'pagehide' : 'beforeunload'

    const onUnload = async () => {
      socketRef.current?.emit('end call', roomID)
    }

    window.addEventListener(eventName, onUnload)

    if (mediaStream && socket) {
      console.log('connect')

      localMedia.current = mediaStream
      socketRef.current = socket

      socketRef.current.emit('start call', roomID)

      socketRef.current.on('call partner', (partnerID: string) => {
        console.log('call partner')
        rtcPeerConnection.current = createPeerConnection(partnerID)

        localMedia.current?.getTracks().forEach(track => {
          if (localMedia.current) rtcPeerConnection.current?.addTrack(track, localMedia.current)
        })

        remoteUser.current = partnerID
      })

      socketRef.current.on('call host', (hostID: string) => {
        console.log('call host')
        remoteUser.current = hostID
      })

      socketRef.current.on('offer', (incomingOffer: Offer) => {
        console.log('VERY NICE offer', incomingOffer)
        rtcPeerConnection.current = createPeerConnection(null)
        rtcPeerConnection.current
          .setRemoteDescription(new RTCSessionDescription(incomingOffer.sdp))
          .then(() => {
            localMedia.current?.getTracks().forEach(track => {
              if (localMedia.current) rtcPeerConnection.current?.addTrack(track, localMedia.current)
            })
          })
          .then(() => {
            return rtcPeerConnection.current?.createAnswer()
          })
          .then(answer => {
            if (answer) return rtcPeerConnection.current?.setLocalDescription(answer)
          })
          .then(() => {
            const payload = {
              appointmentId: incomingOffer.appointmentId,

              sdp: rtcPeerConnection.current?.localDescription,
            }

            socketRef.current?.emit('answer', payload)
          })
          .catch(e =>
            //FIXME: Handle possible addTrack error.
            console.log(e)
          )
      })

      socketRef.current.on('answer', (payload: Offer) => {
        console.log('answer')
        rtcPeerConnection.current?.setRemoteDescription(new RTCSessionDescription(payload.sdp))
      })

      socketRef.current.on('ice-candidate', (incomingCandidate: RTCIceCandidateInit) => {
        console.log('ice-candidate')
        rtcPeerConnection.current?.addIceCandidate(new RTCIceCandidate(incomingCandidate))
      })

      socketRef.current.on('end call', () => {
        remoteUser.current = undefined
        rtcPeerConnection.current = undefined
        if (remoteVideo.current) remoteVideo.current.srcObject = null
        history.push('/dashboard')
      })
    }

    function createPeerConnection(userID: string | null) {
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
          ?.createOffer()
          .then(offer => {
            return rtcPeerConnection.current?.setLocalDescription(offer)
          })
          .then(() => {
            const payload = {
              appointmentId: roomID,

              sdp: rtcPeerConnection.current?.localDescription,
            }

            socketRef.current?.emit('offer', payload)
          })
          .catch((e: Error) => console.log(e))
      }

      peerConnection.onicecandidate = e => {
        if (e.candidate) {
          const payload = {
            appointmentId: roomID,
            candidate: e.candidate,
          }

          socketRef.current?.emit('ice-candidate', payload)
        }
      }

      peerConnection.ontrack = e => {
        if (mediaStream && remoteVideo.current) {
          remoteVideo.current.srcObject = e.streams[0]
        }
      }

      return peerConnection
    }

    return () => window.removeEventListener(eventName, onUnload)
  }, [mediaStream, roomID, socket, history])

  return <video playsInline autoPlay ref={remoteVideo} className={className} style={style} />
}

export default Stream
