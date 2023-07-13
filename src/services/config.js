import dotenv from 'dotenv'

dotenv.config()

const config = {
  mysql: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: +process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'thrill',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || ''
  },
  socket: {
    cors: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket']
  }
}

export default config
