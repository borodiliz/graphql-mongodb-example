import { expect } from 'chai'
import supertest from 'supertest'
import { app, server } from '~/app'
import { initDB } from './utils'

describe('GraphQL', () => {
  const req = supertest(app)
  const url = server.graphqlPath

  before(initDB)

  it('query posts - returns 200 OK', async () => {
    const res = await req.get(url)
      .query({
        query: `{
            posts {
              title
            }
          }`
      })
      .expect(200)

    const posts = res.body.data.posts
    expect(posts).is.an('array')
  })

})
