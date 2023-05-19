<script setup>
import { doc, updateDoc, collection, arrayUnion, Timestamp } from '@firebase/firestore'

const { chatId } = useRoute().params
const { $firestore } = useNuxtApp()
const authUser = useFirebaseAuth()

const chat = ref(null)
const main = ref(null)

useSnapshot(doc($firestore, 'chats', chatId), async chatSnapshot => {
  if (!chatSnapshot.exists()) {
    return await navigateTo('/chats')
  }
  chat.value = chatSnapshot.data()
  setTimeout(() => main.value.scrollTop = 1e9, 0)
})

const users = ref([])

useSnapshot(collection($firestore, 'users'), usersSnapshot => {
  const userDocs = []
  usersSnapshot.forEach(user => {
    userDocs.push({
      id: user.id,
      username: user.data().username
    })
  })
  users.value = userDocs
})

const usersNotInChat = computed(() => {
  return users.value.filter(user => chat.value.userIds.indexOf(user.id) === -1)
})

const newMessage = ref('')

async function sendMessage() {
  const match = newMessage.value.match(/^\$ rename (?<newName>.+)/)
  if (match != null) {
    const newName = match.groups.newName
    await updateDoc(doc(collection($firestore, 'chats'), chatId), {
      name: newName
    })
    await updateDoc(doc(collection($firestore, 'chats'), chatId), {
      messages: arrayUnion({
        text: `Chat renamed to ${newName}.`,
        username: '',
        timestamp: Timestamp.now()
      })
    })
  }
  else {
    await updateDoc(doc(collection($firestore, 'chats'), chatId), {
      messages: arrayUnion({
        text: newMessage.value,
        username: authUser.value.displayName,
        timestamp: Timestamp.now()
      })
    })
  }
  newMessage.value = ''
}

const newUser = ref(null)

async function addUser() {
  await updateDoc(doc(collection($firestore, 'chats'), chatId), {
    messages: arrayUnion({
      text: `User ${newUser.value.username} ${randomJoinMessage()}`,
      username: '',
      timestamp: Timestamp.now()
    })
  })
  await updateDoc(doc(collection($firestore, 'chats'), chatId), {
    userIds: arrayUnion(newUser.value.id)
  })
}

const { sasToken, storageAccountName } = useRuntimeConfig().public
const containerName = 'photos'
const uploadUrl = `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`

async function uploadPhoto(photo) {
  // TODO
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
              message.username === authUser.displayName ? 'right' : 'left',
            ...(message.username === '' ? { color: '#666' } : { })
          }" v-html="highlightMentions(message.text)" />
        </div>
      </main>
    </div>
    <form class="new-message" @submit.prevent>
      <FileInput @upload="uploadPhoto">Send photo</FileInput>
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
