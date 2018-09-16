import { Post } from './Post'

export interface Comment {
  _id?: string
  postId: string
  content: string
  post?: Post
}
