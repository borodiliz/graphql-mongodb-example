import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { Post, Comment } from './models'

require('dotenv').config()

const prepare = (o) => {
  o._id = o._id.toString()
  return o
}

export const createServer = async () => {

  try {
    const client = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    const db = client.db('blog')

    const Posts = db.collection<Post>('posts')
    const Comments = db.collection<Comment>('comments')

    const typeDefs = gql`
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
    `

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
          return prepare(await Posts.findOne({ _id: res.insertedId }))
        },
        createComment: async (root, args) => {
          const res = await Comments.insertOne(args)
          return prepare(await Comments.findOne({ _id: res.insertedId }))
        }
      }
    }

    const server = new ApolloServer({
      typeDefs,
      resolvers
    })

    const app = express()

    server.applyMiddleware({ app })

    return { app, server }

  } catch (e) {
    console.log(e)
  }
}
