import supertest, { SuperTest, Test } from 'supertest'
import { createServer, IMutations } from '../src/start'
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

  public mutation(query: string) {
    return this.req.post(this.graphqlPath).send({
      query: `
        mutation {
          ${query}
        }
      `
    })
  }

  public mutationObject<T>(obj: {[K in keyof IMutations]: T}, returning: string): Promise<T> {
    const method = Object.keys(obj)[0]
    const query = `
      mutation {
        ${method} (
          ${
            Object.keys(obj[method]).map(field => {
              const val = obj[method][field]
              if (typeof val === 'string') {
                return `${field}: "${val}"`
              } else {
                return `${field}: ${val}`
              }
            })
          }
        ) {
          ${returning}
        }
      }
    `

    return this.req.post(this.graphqlPath)
      .send({ query })
      .then(res => res.body.data[method] as T)
  }
}

export async function createRequest() {
  const { app, server } = await createServer()

  return new Request(app, server)
}
