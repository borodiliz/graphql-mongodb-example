<template lang="html">
  <div class="comment">
    <div class="content">
      {{comment.content}}
      <button @click="$emit('remove', comment.id)">X</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="css">
.comment {
  font-size: 0.8rem;
  padding-left: 15px;
}
</style>
