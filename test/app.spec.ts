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
    const res = await req.mutation(`
      createPost(title: "${post.title}", content: "${post.content}") {
        title content
      }
    `)

    expect(res.body.data.createPost).to.eql(post)
  })

  it('mutation - createComment', async () => {
    let res = await req.mutation(`
      createPost(title: "Title", content: "Post") {
        _id
      }
    `)

    const comment: Comment = {
      postId: res.body.data.createPost._id as string,
      content: 'Comment'
    }

    res = await req.mutation(`
      createComment(postId: "${comment.postId}", content: "${comment.content}") {
        postId content
      }
    `)

    expect(res.body.data.createComment).to.eql(comment)
  })
})
