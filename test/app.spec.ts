import { expect } from 'chai'
import { Post, Comment } from '../src/models'

import { createRequest, Request } from './request'

describe('GraphQL', () => {
  let req: Request

  before(async () => {
    req = await createRequest()
  })

  it('mutation - createPost', async () => {
    const post: Post = {
      title: 'Title',
      content: 'Content'
    }

    const resPost = await req.mutation(`
      createPost(title: "${post.title}", content: "${post.content}") {
        title content
      }
    `).then(res => res.body.data.createPost as Post)

    expect(resPost).to.eql(post)
  })

  it('mutation - createComment', async () => {
    const post = await req.mutation(`
      createPost(title: "Title", content: "Content") {
        _id
      }
    `).then(res => res.body.data.createPost as Post)

    const comment: Comment = {
      postId: post._id.toString(),
      content: 'Comment'
    }

    const resComment = await req.mutation(`
      createComment(postId: "${comment.postId}", content: "${comment.content}") {
        postId content
      }
    `).then(res => res.body.data.createComment as Comment)

    expect(resComment).to.eql(comment)
  })
})
