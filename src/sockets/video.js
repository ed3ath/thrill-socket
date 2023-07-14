import _ from 'lodash'

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

  socket.on(VIDEO_EVENTS.VIEW, async (data) => {
    try {
      if (_.isNil(data.video_id)) throw Error('The video id field is required.')
      if (_.isEmpty(await pool('videos').select('*').where('id', data.video_id))) throw Error('The selected video id is invalid.')
      await pool('video_views').where('video_id', data.video_id).increment({ counter: 1 })
      const [result] = await pool('video_views').where('video_id', data.video_id)
      socket.emit(VIDEO_EVENTS.VIEW, {
        status: true,
        data: {
          counter: result.counter
        },
        message: 'View counter is updated.',
        error: false
      })
    } catch (e) {
      socket.emit(VIDEO_EVENTS.VIEW, {
        status: false,
        data: [],
        message: e.message,
        error: true
      })
    }
  })

  socket.on(VIDEO_EVENTS.LIKE, async (data) => {
    try {
      if (_.isNil(data.video_id)) throw Error('The video id field is required.')
      if (_.isNil(data.is_like)) throw Error('The is like by field is required.')
      if (_.isEmpty(await pool('videos').select('*').where('id', data.video_id))) throw Error('The selected video id is invalid.')
      if (data.is_like) {
        await pool('video_likes').where('video_id', data.video_id).increment({ counter: 1 })
      }
      const [result] = await pool('video_likes').where('video_id', data.video_id)
      socket.emit(VIDEO_EVENTS.LIKE, {
        status: true,
        data: {
          likes: result.counter
        },
        message: 'Like counter is updated.',
        error: false
      })
    } catch (e) {
      socket.emit(VIDEO_EVENTS.LIKE, {
        status: false,
        data: [],
        message: e.message,
        error: true
      })
    }
  })

  socket.on(VIDEO_EVENTS.COMMENT, async (data) => {
    try {
      if (_.isNil(data.video_id)) throw Error('The video id field is required.')
      if (_.isNil(data.comment_by)) throw Error('The comment by field is required.')
      if (_.isNil(data.comment)) throw Error('The comment field is required.')
      if (_.isEmpty(await pool('videos').select('*').where('id', data.video_id))) throw Error('The selected video id is invalid.')
      if (_.isEmpty(await pool('users').select('*').where('id', data.comment_by))) throw Error('The selected comment by is invalid.')
      const [commentId] = await pool('video_comments').insert(_.assign(data, {
        created_at: new Date(),
        updated_at: new Date()
      }))
      const [result] = await pool('video_comments').where('id', commentId)
      socket.emit(VIDEO_EVENTS.COMMENT, {
        status: true,
        data: result,
        message: 'comment done.',
        error: false
      })
    } catch (e) {
      socket.emit(VIDEO_EVENTS.COMMENT, {
        status: false,
        data: [],
        message: e.message,
        error: true
      })
    }
  })
}

export default video
