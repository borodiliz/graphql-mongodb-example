<template lang="html">
  <div class="container">
    <post-form @input="save($event)"></post-form>
    <post
      v-for="(post, index) of posts"
      :key="index"
      :post="post"
      @remove="remove($event)"
      @addComment="addComment($event)"
      @removeComment="removeComment($event)"
    ></post>
  </div>
</template>

<script>
import Post from '~/components/Post.vue'
import PostForm from '~/components/PostForm.vue'
import gql from 'graphql-tag'

export default {
  data: () => ({
      posts: []
  }),
  async beforeMount() {
    this.posts = await this.list()
  },
  methods: {
    async save(post) {
      const createdPost = await this.$apollo.mutate({
        mutation: gql`
          mutation($title: String!, $content: String!) {
            createPost(title: $title, content: $content) {
              id title content
              comments {
                id content
              }
            }
          }
        `,
        variables: post
      }).then(res => res.data.createPost)

      this.posts.push(createdPost)
    },

    async list() {
      return this.$apollo.query({
        query: gql`{
          posts {
            id title content
            comments {
              id content
            }
          }
        }`
      }).then(res => res.data.posts)
    },

    async remove(id) {
      const res = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: String!) {
            removePost(id: $id)
          }
        `,
        variables: { id }
      })

      if (res.data.removePost) {
        const idx = this.posts.findIndex(post => post.id === id)
        this.posts.splice(idx, 1)
      }
    },

    async addComment(comment) {
      const createdComment = await this.$apollo.mutate({
        mutation: gql`
          mutation($postId: String!, $content: String!) {
            createComment(postId: $postId, content: $content) {
              id content
            }
          }
        `,
        variables: comment
      }).then(res => res.data.createComment)

      const idx = this.posts.findIndex(post => post.id === comment.postId)
      this.posts[idx].comments.push(createdComment)
    },

    async removeComment(comment) {
      const res = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: String!) {
            removeComment(id: $id)
          }
        `,
        variables: comment
      })

      if (res.data.removeComment) {
        const idx = this.posts.findIndex(post => post.id === comment.postId)
        const commentIdx = this.posts[idx].comments.findIndex(comment => comment.id === comment.id)
        this.posts[idx].comments.splice(commentIdx, 1)
      }
    }
  },
  components: {
    Post, PostForm
  }
}
</script>

<style lang="css">
</style>
