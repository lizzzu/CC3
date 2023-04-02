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
  <div v-if="chat != null">
    <h1>Name: {{ chat.name }}</h1>
    <h2>Id: {{ chatId }}</h2>
    <div v-for="message in chat.messages" :key="message.id">
      <p>Text: {{ message.text }}</p>
      <p>User: {{ message.userId }}</p>
      <p>Time: {{ message.timestamp.toDate() }}</p>
    </div>
  </div>
  <p v-else>Loading...</p>
</template>
