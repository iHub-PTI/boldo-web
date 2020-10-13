import { useState, useEffect } from 'react'
import io from 'socket.io-client'

export function useSocket() {
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const socketIo = io.connect(process.env.SOCKETS_ADDRESS)
    setSocket(socketIo)
    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup
  }, [])
  return socket
}
