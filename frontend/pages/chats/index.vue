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
import { addDoc, collection, query, where, onSnapshot, doc, deleteDoc } from '@firebase/firestore';

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
          id: chat.id,
          name: chat.data().name,
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
      await addDoc(collection(this.$firestore, 'chats'), {
        name: this.newChatName,
        users: [{
          userId: this.userId,
          accepted: true
        }],
        messages: []
      });
      this.newChatName = '';
    },
    async deleteChat(index) {
      const chat = this.chats[index];
      await deleteDoc(doc(this.$firestore, 'chats', chat.id));
      this.chats.splice(index, 1);
    }
  }
};
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <header>
    <button @click="logOut">Sign out</button>
    <h1>Chats</h1>
  </header>
  <p v-if="chats.length === 0">No chats yet</p>
  <TransitionGroup v-else tag="main">
    <NuxtLink v-for="(chat, index) of chats" :to="chat.url" :key="chat.url" class="chat">
      <div>
        <span>[{{ chat.id }}]</span>
        {{ chat.name }}
      </div>
      <button @click="deleteChat(index)">Delete</button>
    </NuxtLink>
  </TransitionGroup>
  <form class="new-chat" @submit.prevent>
    <input v-model="newChatName" placeholder="New chat name" />
    <button @click="addChat" :disabled="newChatName === ''">Create new chat</button>
  </form>
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

header {
  position: relative;
}

header button {
  position: absolute;
  right: 0;
}

h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  font-weight: lighter;
  text-align: center;
}

p, a {
  display: block;
  margin: .5rem 0;
  padding: .7rem;
  font-size: 1.3rem;
}

a {
  border: 1px solid #ddd;
  background-color: var(--middground);
  transition-duration: .5s;
  transition-timing-function: ease;
  transition-property: transform, background-color;
  background-color: #222;
}

a:where(:hover, :focus-visible) {
  transform: scale(1.03);
  background-color: var(--bordground);
}

a:has(+ a:where(:hover, :focus-visible)), a:where(:hover, :focus-visible) + a {
  transform: scale(1.02);
  transition-duration: .75s;
}

a:has(+ a + a:where(:hover, :focus-visible)), a:where(:hover, :focus-visible) + a + a {
  transform: scale(1.01);
  transition-duration: 1s;
}

.new-chat {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1rem 0 2rem 0;
  gap: .3rem;
}

.new-chat input {
  flex: 1;
}

.chat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat span {
  color: gold;
}

.chat button {
  color: #ffa1d5;
  border: 1px solid #ffa1d5;
}

@media (max-width: 700px) {
  p, a {
    margin: 1rem 0;
    padding: .5rem;
    font-size: 1rem;
  }

  .new-chat {
    flex-direction: column;
  }

  .new-chat input {
    min-width: 100%;
  }
}
</style>
