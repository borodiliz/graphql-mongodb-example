import { Comment } from './Comment'
import { ObjectID } from 'mongodb'

export interface Post {
  _id?: ObjectID
  title: string
  content: string
  comments?: [Comment]
}
