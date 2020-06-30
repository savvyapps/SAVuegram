<template>
  <div class="c-modal">
    <div class="c-container">
      <a @click="$emit('close')">close</a>
      <p>add a comment</p>
      <form @submit.prevent>
        <textarea v-model.trim="comment"></textarea>
        <button @click="addComment()" :disabled="comment == ''" class="button">add comment</button>
      </form>
    </div>
  </div>
</template>

<script>
import { commentsCollection, postsCollection, auth } from '@/firebase'

export default {
  props: ['post'],
  data() {
    return {
      comment: ''
    }
  },
  methods: {
    async addComment() {
      // create comment
      await commentsCollection.add({
        createdOn: new Date(),
        content: this.comment,
        postId: this.post.id,
        userId: auth.currentUser.uid,
        userName: this.$store.state.userProfile.name
      })

      // update comment count on post
      await postsCollection.doc(this.post.id).update({
        comments: parseInt(this.post.comments) + 1
      })

      // close modal
      this.$emit('close')
    }
  }
}
</script>
