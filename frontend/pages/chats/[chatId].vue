<script>
import { doc, updateDoc, collection, arrayUnion, onSnapshot, Timestamp } from '@firebase/firestore';

export default {
  data() {
    return {
      chatId: this.$route.params.chatId,
      chat: null,
      newMessage: '',
      newUser: null,
      users: [],
      unsubscribeChat: () => { },
      unsubscribeUsers: () => { }
    };
  },
  mounted() {
    this.unsubscribeChat = onSnapshot(doc(this.$firestore, 'chats', this.chatId), async chatSnapshot => {
      if (!chatSnapshot.exists()) {
        return await navigateTo('/chats');
      }
      this.chat = chatSnapshot.data();
      setTimeout(() => this.$refs.main.scrollTop = 1e9, 0);
    });
    this.unsubscribeUsers = onSnapshot(collection(this.$firestore, 'users'), usersSnapshot => {
      const users = [];
      usersSnapshot.forEach(user => {
        users.push({
          id: user.id,
          username: user.data().username
        });
      });
      this.users = users;
    });
  },
  unmounted() {
    this.unsubscribeChat();
    this.unsubscribeUsers();
  },
  computed: {
    usersNotInChat() {
      return this.users.filter(user => this.chat.userIds.indexOf(user.id) === -1);
    }
  },
  methods: {
    async sendMessage() {
      const match = this.newMessage.match(/^\$ rename (?<newName>.+)/);
      if (match != null) {
        const newName = match.groups.newName;
        await updateDoc(doc(collection(this.$firestore, 'chats'), this.chatId), {
          name: newName
        });
        await updateDoc(doc(collection(this.$firestore, 'chats'), this.chatId), {
          messages: arrayUnion({
            text: `Chat renamed to ${newName}.`,
            username: '',
            timestamp: Timestamp.now()
          })
        });
      }
      else {
        await updateDoc(doc(collection(this.$firestore, 'chats'), this.chatId), {
          messages: arrayUnion({
            text: this.newMessage,
            username: useCookie('user').value.displayName,
            timestamp: Timestamp.now()
          })
        });
      }
      this.newMessage = '';
    },
    async addUser() {
      await updateDoc(doc(collection(this.$firestore, 'chats'), this.chatId), {
        messages: arrayUnion({
          text: `User ${this.newUser.username} ${this.randomJoinMessage()}`,
          username: '',
          timestamp: Timestamp.now()
        })
      });
      await updateDoc(doc(collection(this.$firestore, 'chats'), this.chatId), {
        userIds: arrayUnion(this.newUser.id)
      });
    },
    randomJoinMessage() {
      const messages = [
        'just joined the chat.',
        'joined the party!',
        'is here!',
        'just landed.',
        'appeared.',
        'just arrived.',
        'has spawned in the chat!',
        'showed up!',
        'hopped into the server.'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    },
    timestampToString(timestamp) {
      return timestamp.toDate().toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    highlightMentions(message) {
      return message
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replace(/@\w+/g, match => `<span style="color: gold">${match}</span>`);
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
      <NuxtLink to="/chats" class="to-chats">← Back to chats</NuxtLink>
      <h1>{{ chat.name }}</h1>
      <form @submit.prevent>
        <select v-model="newUser">
          <option :value="null" disabled>New user</option>
          <option v-for="user of usersNotInChat" :value="user">{{ user.username }}</option>
        </select>
        <button @click="addUser" :disabled="newUser === null">Add</button>
      </form>
    </header>
    <div class="main-wrapper">
      <main ref="main">
        <div v-for="message in chat.messages" class="message">
          <div>
            <p class="user">{{ message.username }}</p>
            <p class="time">{{ timestampToString(message.timestamp) }}</p>
          </div>
          <p :style="{
            textAlign:
              message.username === '' ? 'center' :
              message.username === useCookie('user').value.displayName ? 'right' : 'left',
            ...(message.username === '' ? { color: '#666' } : { })
          }" v-html="highlightMentions(message.text)" />
        </div>
      </main>
    </div>
    <form class="new-message" @submit.prevent>
      <input v-model.trim="newMessage" placeholder="Type..." />
      <button @click="sendMessage" :disabled="newMessage === ''">Send</button>
    </form>
  </div>
  <p v-else>Loading...</p>
</template>

<style scoped>
header {
  position: relative;
}

header .to-chats {
  position: absolute;
  top: 0;
  left: 0;
}

header .to-chats:where(:hover, :focus-visible) {
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
  justify-content: space-between;
  gap: .3rem;
  font-size: .75rem;
}

.message .user {
  color: #ffa1d5;
}

.message .time {
  color: #4affde;
}

.new-message {
  display: flex;
  align-items: center;
  margin-top: .5rem;
  gap: .3rem;
}

.new-message input {
  flex: 1;
}

main {
  height: 70vh;
  overflow-x: hidden;
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
