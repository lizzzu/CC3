<script>
import { doc, getDoc } from '@firebase/firestore';

export default {
  data() {
    return {
      chatId: this.$route.params.chatId,
      chat: null
    };
  },
  async mounted() {
    try {
      const chatRef = doc(useNuxtApp().$firestore, 'chats', this.chatId);
      const chatDoc = await getDoc(chatRef);
      if (chatDoc.exists()) {
        this.chat = chatDoc.data();
        console.log(this.chat);
      }
    }
    catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <h1>Name: {{ chat.name }}</h1>
  <h2>Id: {{ chatId }}</h2>
</template>
