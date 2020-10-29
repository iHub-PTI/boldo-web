import { useState, useEffect } from 'react'
import io from 'socket.io-client'

let socket: SocketIOClient.Socket

export const useSocket = () => {
  const [rerender, setRerender] = useState(false)
  useEffect(() => {
    function cleanup() {
      if (!socket) return
      // FIXME: Is handled for every use hook and will break the still existing hooks.
      // socket.disconnect()
    }
    if (socket) return cleanup

    socket = io.connect(process.env.REACT_APP_SOCKETS_ADDRESS!)
    setRerender(!rerender)

    return cleanup
  }, [])

  return socket
}
