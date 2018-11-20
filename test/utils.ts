import { createConnection } from 'typeorm'

export function initDB() {
  return createConnection({
    name: 'default',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'blog',
    entities: [
      'src/models/**/*.ts'
    ]
  })
}
