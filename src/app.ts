import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import { Post, Comment } from './models'
import { GraphQLScalarType } from 'graphql'

require('dotenv').config()

export const createServer = async () => {

  try {
    const client = await MongoClient.connect(process.env.MONGO_URL, { useNewUrlParser: true })
    const db = client.db('blog')

    const Posts = db.collection<Post>('posts')
    const Comments = db.collection<Comment>('comments')

    const typeDefs = gql`
      scalar ObjectId

      type Query {
        post(_id: String): Post
        posts: [Post]
        comment(_id: String): Comment
      }

      type Post {
        _id: ObjectId!
        title: String!
        content: String
        comments: [Comment!]
      }

      type Comment {
        _id: ObjectId!
        postId: String!
        content: String!
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
      ObjectId: new GraphQLScalarType({
        name: 'ObjectId',
        serialize: val => new ObjectId(val)
      }),
      Query: {
        post: (root, { _id }: Post) => {
          return Posts.findOne(_id)
        },
        posts: () => {
          return Posts.find({}).toArray()
        },
        comment: (root, { _id }: Comment) => {
          return Comments.findOne(_id)
        }
      },
      Post: {
        comments: ({ _id }: Post) => {
          return Comments.find({ postId: _id.toString() }).toArray()
        }
      },
      Comment: {
        post: ({ postId }: Comment) => {
          return Posts.findOne(new ObjectId(postId))
        }
      },
      Mutation: {
        createPost: async (root, args, context, info) => {
          const res = await Posts.insertOne(args)
          return Posts.findOne({ _id: res.insertedId })
        },
        createComment: async (root, args) => {
          const res = await Comments.insertOne(args)
          return Comments.findOne({ _id: res.insertedId })
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
