<template lang="html">
  <div class="post">
      <h3 class="title">
      {{post.title}}
      <button @click="$emit('remove', post.id)">X</button>
    </h3>
    <div class="content">
      {{post.content}}
    </div>

    <comment-form @input="addComment($event)"></comment-form>

    <comment
      v-for="(comment, index) of post.comments"
      :key="index"
      :comment="comment"
      @remove="removeComment($event)"
    ></comment>
  </div>
</template>

<script>
import Comment from './Comment.vue'
import CommentForm from './CommentForm.vue'

export default {
  name: 'post',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    addComment(content) {
      this.$emit('addComment', {
        postId: this.post.id,
        content
      })
    },
    removeComment(id) {
      this.$emit('removeComment', {
        id,
        postId: this.post.id
      })
    }
  },
  components: {
    Comment, CommentForm
  }
}
</script>

<style lang="css">
</style>
