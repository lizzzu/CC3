<script>
import { signOut } from 'firebase/auth';
import { doc, addDoc, deleteDoc, collection, query, where, orderBy, onSnapshot } from '@firebase/firestore';

export default {
  data() {
    return {
      userId: useCookie('user', { sameSite: 'none', secure: true }).value.uid,
      chats: [],
      newChatName: '',
      unsubscribe: () => { }
    };
  },
  async mounted() {
    this.unsubscribe = onSnapshot(query(
      collection(this.$firestore, 'chats'),
      where('userIds', 'array-contains', this.userId),
      orderBy('name')
    ), chatsSnapshot => {
      const chats = [];
      chatsSnapshot.forEach(chat => {
        chats.push({
          id: chat.id,
          name: chat.data().name
        });
      });
      this.chats = chats;
    });
  },
  unmounted() {
    this.unsubscribe();
  },
  methods: {
    async logOut() {
      try {
        await signOut(this.$auth);
        useCookie('user', { sameSite: 'none', secure: true }).value = null;
        await navigateTo('/');
      }
      catch (error) {
        console.error(error);
        alert(error.message);
      }
    },
    async addChat() {
      await addDoc(collection(this.$firestore, 'chats'), {
        name: this.newChatName,
        userIds: [this.userId],
        messages: []
      });
      this.newChatName = '';
    },
    async deleteChat(chatId) {
      if (confirm(`Are you sure you want to delete chat ${chatId}?`)) {
        await deleteDoc(doc(this.$firestore, 'chats', chatId));
      }
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
    <NuxtLink v-for="chat of chats" :to="`/chats/${chat.id}`" :key="chat.id" class="chat">
      <div>
        <span>[{{ chat.id }}]</span>
        {{ chat.name }}
      </div>
      <button @click="$event.preventDefault(); deleteChat(chat.id)">Delete</button>
    </NuxtLink>
  </TransitionGroup>
  <form class="new-chat" @submit.prevent>
    <input v-model.trim="newChatName" placeholder="New chat name" />
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
  transition-duration: .5s;
  transition-timing-function: ease;
  transition-property: transform, background-color;
  background-color: #222;
}

a:where(:hover, :focus-visible) {
  transform: scale(1.03);
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
