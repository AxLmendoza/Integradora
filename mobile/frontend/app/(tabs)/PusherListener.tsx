import { useEffect } from 'react'
import Pusher from 'pusher-js'

const PusherListener = () => {
  useEffect(() => {
    const pusher = new Pusher('c15b5b5c30caf961aaa8', {
      cluster: 'us2'
    })

    const channel = pusher.subscribe('mi-canal')

    channel.bind('nuevo-mensaje', (data: { mensaje: string }) => {
      alert(`Nuevo mensaje: ${data.mensaje}`)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  return null
}

export default PusherListener
