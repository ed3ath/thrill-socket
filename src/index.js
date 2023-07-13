import { createServer } from 'http'
import { Server } from 'socket.io'
import sockets from './sockets/index.js'

import config from './services/config.js'

const server = createServer()
const io = new Server(server, config.socket)

io.on('connection', (socket) => sockets(socket))

server.listen(3000)
