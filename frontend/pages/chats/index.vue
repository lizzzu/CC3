<script setup>
import { signOut } from 'firebase/auth';
import { addDoc, collection } from '@firebase/firestore';

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

async function addChat() {
  try {
    const chat = await addDoc(collection(useNuxtApp().$firestore, 'chats'), {
      name: 'New chat',
      users: [{
        userId: useCookie('user').value.uid,
        accepted: true
      }],
      messages: []
    });
    alert(`New chat created: ${chat.id}`);
  }
  catch (error) {
    console.error(error);
    alert(error.message);
  }
};
</script>

<script>
import { onAuthStateChanged } from '@firebase/auth';
import { collection, query, where, onSnapshot } from '@firebase/firestore';

const baseUrl
  = process.env.NODE_ENV === 'production'
  ? 'https://cloud-computing-3.netlify.app'
  : 'http://localhost:3000';

export default {
  data() {
    return {
      userId: '',
      chats: [],
      unsubscribe: () => { }
    };
  },
  async mounted() {
    onAuthStateChanged(useNuxtApp().$auth, user => {
      this.userId = user?.uid || '';
      this.unsubscribe = onSnapshot(query(
        collection(useNuxtApp().$firestore, 'chats'),
        where('users', 'array-contains', { userId: this.userId, accepted: true })
      ), chatsSnapshot => {
        const chats = [];
        chatsSnapshot.forEach(chat => {
          chats.push({
            name: `${chat.data().name}: ${chat.id}`,
            url: `${baseUrl}/chats/${chat.id}`
          });
        });
        this.chats = [...chats];
      });
    });
  },
  unmounted() {
    this.unsubscribe();
  }
};
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <h1>Chats</h1>
  <button @click="logOut">Sign out</button>
  <button @click="addChat">Create new chat</button>
  <p v-if="chats.length === 0">No chats yet</p>
  <TransitionGroup v-else tag="main">
    <NuxtLink v-for="chat of chats" :to="chat.url" :key="chat.url">{{ chat.name }}</NuxtLink>
  </TransitionGroup>
</template>

<style scoped>
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
