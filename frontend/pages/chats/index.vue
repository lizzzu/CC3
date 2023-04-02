<script setup>
import { signOut } from 'firebase/auth';

async function logOut() {
  try {
    await signOut(useNuxtApp().$auth);
    useCookie('user').value = null;
    await navigateTo('/');
  }
  catch (error) {
    console.error(error);
    alert(error.message);
  }
};
</script>

<script>
import { addDoc, collection, query, where, onSnapshot } from '@firebase/firestore';

export default {
  data() {
    return {
      userId: useCookie('user').value.uid,
      chats: [],
      newChatName: '',
      unsubscribe: () => { }
    };
  },
  async mounted() {
    this.unsubscribe = onSnapshot(query(
      collection(this.$firestore, 'chats'),
      where('users', 'array-contains', { userId: this.userId, accepted: true })
    ), chatsSnapshot => {
      const chats = [];
      chatsSnapshot.forEach(chat => {
        chats.push({
          name: `${chat.data().name}: ${chat.id}`,
          url: `/chats/${chat.id}`
        });
      });
      this.chats = [...chats];
    });
  },
  unmounted() {
    this.unsubscribe();
  },
  methods: {
    async addChat() {
      const chat = await addDoc(collection(this.$firestore, 'chats'), {
        name: this.newChatName,
        users: [{
          userId: this.userId,
          accepted: true
        }],
        messages: []
      });
      alert(`New chat created: ${chat.id}`);
      this.newChatName = '';
    }
  }
};
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <h1>Chats</h1>
  <button @click="logOut">Sign out</button>
  <input v-model="newChatName" placeholder="New chat name" />
  <button @click="addChat" :disabled="newChatName === ''">Create new chat</button>
  <p v-if="chats.length === 0">No chats yet</p>
  <TransitionGroup v-else tag="main">
    <NuxtLink v-for="chat of chats" :to="chat.url" :key="chat.url">{{ chat.name }}</NuxtLink>
  </TransitionGroup>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  text-align: center;
}

a {
  display: block;
  padding: 1rem;
  font-size: 1.5rem;
}
</style>
