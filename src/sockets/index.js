import video from './video.js'

const socket = (socket) => ({
  ...video(socket)
})

export default socket
