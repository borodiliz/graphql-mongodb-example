<template lang="html">
  <form @submit.prevent="onSubmit($event)">
    <input name="content" type="text">
  </form>
</template>

<script>
export default {
  name: 'CommentForm',
  methods: {
    onSubmit({target}) {
      this.$emit('input', target.content.value)
      target.reset()
    }
  }
}
</script>

<style lang="css">
</style>
