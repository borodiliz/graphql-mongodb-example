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

    // const res = await req.mutation(`
    //   createPost(title: "${post.title}", content: "${post.content}") {
    //     title content
    //   }
    // `)

    const resPost = await req.mutationObject<Post>({
      createPost: post
    }, 'title content')

    expect(resPost).to.eql(post)
  })

  it('mutation - createComment', async () => {
    const post = await req.mutationObject<Post>({
      createPost: { title: 'Title', content: 'Content' }
    }, '_id')

    const comment: Comment = {
      postId: post._id,
      content: 'Comment'
    }

    const resComment = await req.mutationObject({
      createComment: comment
    }, 'postId content')

    expect(resComment).to.eql(comment)
  })
})
