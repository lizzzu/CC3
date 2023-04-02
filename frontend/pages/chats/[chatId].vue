<script>
import { doc, onSnapshot, collection, updateDoc, arrayUnion } from '@firebase/firestore';

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
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage) {
        return;
      }
      const chatRef = doc(collection(this.$firestore, 'chats'), this.chatId);
      updateDoc(chatRef, {
        messages: arrayUnion({
          text: this.newMessage,
          userId: useCookie('user').value.uid,
          timestamp: new Date()
        })
      }).then(() => {
        this.newMessage = '';
      }).catch((error) => {
        console.error(error);
      });
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
      <br>
      <p>Text: {{ message.text }}</p>
      <p>User: {{ message.userId }}</p>
      <p>Time: {{ message.timestamp.toDate().toLocaleDateString('ro-RO', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      }) }}</p>
    </div>
    <input v-model="newMessage" placeholder="Type..." />
    <button @click="sendMessage">Send</button>
  </div>
  <p v-else>Loading...</p>
  <NuxtLink to="/chats">Back to chats</NuxtLink>
</template>
