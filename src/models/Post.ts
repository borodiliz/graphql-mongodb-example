import { Comment } from './Comment'

export interface Post {
  _id?: string
  title: string
  content: string
  comments?: [Comment]
}
