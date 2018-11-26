<template lang="html">
  <form @submit.prevent="onSubmit($event)">
    <input name="title" type="text" placeholder="Title" autofocus>
    <input name="content" type="text" placeholder="Content">
    <button>Post</button>
  </form>
</template>

<script>
export default {
  name: 'PostForm',
  methods: {
    onSubmit({target}) {
      this.$emit('input', {
        title: target.title.value,
        content: target.content.value
      })
      target.reset()
    }
  }
}
</script>

<style lang="css">
</style>
