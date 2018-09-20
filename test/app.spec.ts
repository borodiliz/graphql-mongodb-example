import { expect } from 'chai'
import { Post, Comment } from '~/models'

import { createRequest, Request } from './request'

describe('GraphQL', () => {
  let req: Request

  before(async () => {
    req = await createRequest()
  })

  it('query - post', async () => {
    const res = await req.query(`{
      post(_id: "5ba2f9874f71b576a1965cd9") {
        _id
      }
    }`)

    expect(res.body.error).to.be.a('undefined')
    expect(res.body.data.post._id).to.equal('5ba2f9874f71b576a1965cd9')
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
