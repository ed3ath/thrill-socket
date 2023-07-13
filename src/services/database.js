import knex from 'knex'

import config from './config.js'

const connection = knex({
  client: 'mysql',
  connection: config.mysql,
  pool: { min: 0, max: 10 }
})

export default connection
