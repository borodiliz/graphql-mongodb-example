import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import { makeExecutableSchema } from 'graphql-tools'

const URL = 'http://localhost'
const PORT = 3001
const MONGO_URL = 'mongodb://localhost:27017/'

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

interface Comment {
  _id: string
  postId: string
  content: string
  post: Post
}

interface Post {
  _id: string
  title: string
  content: string
  comments: [Comment]
}

export const start = async () => {
  try {
    const client = await MongoClient.connect(MONGO_URL)
    const db = client.db('blog')

    const Posts = db.collection<Post>('posts')
    const Comments = db.collection<Comment>('comments')

    const typeDefs = [`
      type Query {
        post(_id: String): Post
        posts: [Post]
        comment(_id: String): Comment
      }

      type Post {
        _id: String
        title: String
        content: String
        comments: [Comment]
      }

      type Comment {
        _id: String
        postId: String
        content: String
        post: Post
      }

      type Mutation {
        createPost(title: String, content: String): Post
        createComment(postId: String, content: String): Comment
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `]

    const resolvers = {
      Query: {
        post: async (root, { _id }: Post) => {
          return prepare(await Posts.findOne(new ObjectId(_id)))
        },
        posts: async () => {
          return (await Posts.find({}).toArray()).map(prepare)
        },
        comment: async (root, { _id }: Comment) => {
          return prepare(await Comments.findOne(new ObjectId(_id)))
        }
      },
      Post: {
        comments: async ({ _id }) => {
          return (await Comments.find({ postId: _id }).toArray()).map(prepare)
        }
      },
      Comment: {
        post: async ({ postId }: Comment) => {
          return prepare(await Posts.findOne(new ObjectId(postId)))
        }
      },
      Mutation: {
        createPost: async (root, args, context, info) => {
          const res = await Posts.insertOne(args)
          console.log(res)
          return prepare(await Posts.findOne({ _id: res.insertedId }))
        },
        createComment: async (root, args) => {
          const res = await Comments.insert(args)
          return prepare(await Comments.findOne({ _id: res.insertedId }))
        }
      }
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()

    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

    const homePath = '/graphiql'

    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  }

}
