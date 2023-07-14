import { App } from 'uWebSockets.js'
import { Server } from 'socket.io'
import sockets from './sockets/index.js'

import config from './services/config.js'

const app = App()

const io = new Server(config.socket)
io.attachApp(app)

io.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`)
})
io.on('connection', (socket) => sockets(socket))

app.listen(3000, (res) => {
  if (!res) {
    console.warn('port already in use')
  }
})
