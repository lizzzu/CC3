<script>
import { doc, onSnapshot } from '@firebase/firestore';

export default {
  data() {
    return {
      chatId: this.$route.params.chatId,
      chat: null,
      newMessage: '',
      unsubscribe: () => { }
    };
  },
  mounted() {
    this.unsubscribe = onSnapshot(doc(this.$firestore, 'chats', this.chatId), chatSnapshot => {
      this.chat = chatSnapshot.data();
    });
  },
  unmounted() {
    this.unsubscribe();
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
    <input v-model="newMessage" placeholder="Type..." />
    <button>Send 🕊️</button>
  </div>
  <p v-else>Loading...</p>
  <NuxtLink to="/chats">Back to chats</NuxtLink>
</template>
