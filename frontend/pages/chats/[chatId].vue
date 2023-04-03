<script>
import { doc, onSnapshot, collection, updateDoc, arrayUnion, Timestamp } from '@firebase/firestore';

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
      await updateDoc(chatRef, {
        messages: arrayUnion({
          text: this.newMessage,
          userId: useCookie('user').value.uid,
          timestamp: Timestamp.now()
        })
      });
      this.newMessage = '';
    }
  }
}
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <div v-if="chat != null">
    <div class="header">
      <NuxtLink to="/chats" id="to-chats">← Back to chats</NuxtLink>
      <h1>{{ chat.name }}</h1>
    </div>
    <div v-for="message in chat.messages" :key="message.id" class="message">
      <div>
        <p id="user">[{{ message.userId }}]</p>
        <p id="time">{{ message.timestamp.toDate().toLocaleDateString('ro-RO', {
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit'
        }) }}</p>
      </div>
      <p id="text">{{ message.text }}</p>
    </div>
    <div class="new-message">
      <input v-model="newMessage" placeholder="Type..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
  <p v-else>Loading...</p>
</template>

<style scoped>
.header {
  position: relative;
}

.header #to-chats {
  position: absolute;
  left: 0;
}

h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  font-weight: lighter;
  text-align: center;
}

.message {
  display: flex;
  flex-direction: column;
  padding: .7rem;
  margin: .3rem 0;
  border: .1rem;
  gap: .3rem;
  border: 1px solid #ddd;
}

.message div {
  display: flex;
  flex-direction: row;
  gap: .3rem;
  font-size: .75rem;
}

.message #user {
  color: #ffa1d5;
}

.message #time {
  color: #4affde;
}

.new-message {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: .3rem;
}

.new-message input {
  flex: 1;
}

@media (max-width: 700px) {
  .message div {
    flex-direction: column;
  }

  .new-message {
    flex-direction: column;
  }

  .new-message input {
    min-width: 100%;
  }
}
</style>
