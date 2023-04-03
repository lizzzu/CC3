<script>
import { doc, onSnapshot, collection, updateDoc, arrayUnion, Timestamp } from '@firebase/firestore';

export default {
  data() {
    return {
      chatId: this.$route.params.chatId,
      chat: null,
      newMessage: '',
      newUser: '',
      unsubscribe: () => { }
    };
  },
  mounted() {
    this.unsubscribe = onSnapshot(doc(this.$firestore, 'chats', this.chatId), chatSnapshot => {
      this.chat = chatSnapshot.data();
    });
    setTimeout(() => this.$refs.main.scrollTop = 1e9, 1000);
  },
  unmounted() {
    this.unsubscribe();
  },
  methods: {
    async sendMessage() {
      if (this.newMessage === '') return;
      await updateDoc(doc(collection(this.$firestore, 'chats'), this.chatId), {
        messages: arrayUnion({
          text: this.newMessage,
          userId: useCookie('user').value.uid,
          timestamp: Timestamp.now()
        })
      });
      this.newMessage = '';
      this.$refs.main.scrollTop = 1e9;
    }
  }
}
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <div v-if="chat != null">
    <header>
      <NuxtLink to="/chats" id="to-chats">← Back to chats</NuxtLink>
      <h1>{{ chat.name }}</h1>
      <form @submit.prevent>
        <select v-model="newUser">
          <option value="" disabled>New user</option>
          <option>gareth618</option>
          <option>lizzzu</option>
          <option>gabysk</option>
          <option>andreea</option>
          <option>mihai</option>
        </select>
        <button>Add</button>
      </form>
    </header>
    <div class="main-wrapper">
      <main ref="main">
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
      </main>
    </div>
    <form class="new-message" @submit.prevent>
      <input v-model="newMessage" placeholder="Type..." />
      <button @click="sendMessage">Send</button>
    </form>
  </div>
  <p v-else>Loading...</p>
</template>

<style scoped>
header {
  position: relative;
}

header #to-chats {
  position: absolute;
  top: 0;
  left: 0;
}

header #to-chats:where(:hover, :focus-visible) {
  text-decoration: underline 1px dashed #aaa;
  text-underline-offset: .3em;
}

header form {
  display: flex;
  gap: .25rem;
  position: absolute;
  top: 0;
  right: 0;
}

h1 {
  margin: 0 auto 1rem auto;
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
  margin-top: .5rem;
  gap: .3rem;
}

.new-message input {
  flex: 1;
}

main {
  height: 70vh;
  overflow-y: scroll;
  padding-right: .25rem;
}

main::-webkit-scrollbar {
  width: .5rem;
}

main::-webkit-scrollbar-thumb {
  background-color: #444;
}

main > :first-child {
  margin-top: 1rem;
}

main > :last-child {
  margin-bottom: 1rem;
}

.main-wrapper {
  position: relative;
  padding: 1px 0;
}

.main-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rem;
  background-image: linear-gradient(to bottom, #222, transparent);
}

.main-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background-image: linear-gradient(to top, #222, transparent);
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
