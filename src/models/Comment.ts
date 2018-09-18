import { Post } from './Post'
import { ObjectID } from 'mongodb'

export interface Comment {
  _id?: ObjectID
  postId: string
  content: string
  post?: Post
}
