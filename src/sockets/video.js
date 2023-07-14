import pool from '../services/database.js'

import { VIDEO_EVENTS } from '../constants.js'

const video = (socket) => {
  socket.on(VIDEO_EVENTS.LIST, ({ filter = {}, offset = 0, limit = 25, sort = 'id' }) => {
    pool
      .select('*')
      .from('videos')
      .where(filter)
      .offset(offset)
      .limit(limit)
      .orderBy(sort)
      .then((list) => socket.emit(VIDEO_EVENTS.LIST, list))
  })

  socket.on(VIDEO_EVENTS.POST, (data) => {
    console.log('test')
    pool
      .insert(data)
      .into('videos')
      .then((id) =>
        pool.select('*').from('videos').where({ id: id[0] })
          .then(result => socket.emit(VIDEO_EVENTS.POST, result[0]))
      )
  })
}

export default video
