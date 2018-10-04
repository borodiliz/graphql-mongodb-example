import supertest, { SuperTest, Test } from 'supertest'
import { createServer } from '~/app'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'

export class Request {
  public readonly req: SuperTest<Test>

  constructor(
    public readonly app: Express,
    public readonly server: ApolloServer
  ) {
    this.req = supertest(app)
  }

  public get graphqlPath() { return this.server.graphqlPath }

  public query(query: string) {
    return this.req.get(this.graphqlPath)
      .query({ query })
      .expect(200)
  }

  public mutation(query: string) {
    return this.req.post(this.graphqlPath).send({
      query: `
        mutation {
          ${query}
        }
      `
    }).expect(200)
  }

}

export async function createRequest() {
  const { app, server } = await createServer()

  return new Request(app, server)
}
