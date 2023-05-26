<script setup>
import { watch } from 'vue'
import { doc, updateDoc, collection, arrayUnion, Timestamp, increment } from '@firebase/firestore'

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

const typing = ref(false)

watch(typing, async newTyping => {
  await updateDoc(doc($firestore, 'chats', chatId), {
    typingCount: increment(newTyping ? +1 : -1)
  })
})

const messages = computed(() => {
  const messages = [...chat.value.messages]
  if (chat.value.typingCount > 1 || chat.value.typingCount === 1 && !typing.value) {
    messages.push({
      text: 'Somebody is typing...',
      username: '$',
      timestamp: Timestamp.now()
    })
  }
  return messages
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

const usernamesInChat = computed(() => {
  return users.value.filter(user => chat.value.userIds.includes(user.id)).map(user => user.username)
})

const usersNotInChat = computed(() => {
  return users.value.filter(user => !chat.value.userIds.includes(user.id))
})

const newMessage = ref('')

function tryMention(event) {
  const tag = newMessage.value.match(/@(?<tag>.*)$/)?.groups.tag
  if (tag == null) return
  const validUsernames = usernamesInChat.value.filter(username => username.toLowerCase().startsWith(tag.toLowerCase()))
  if (validUsernames.length !== 1) return
  event.preventDefault()
  newMessage.value = newMessage.value.slice(0, -tag.length) + validUsernames[0]
}

async function sendMessage() {
  const newName = newMessage.value.match(/^\$ rename (?<newName>.+)/)?.groups.newName
  if (newName != null) {
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

async function uploadPhoto(file) {
  // TODO @lizzzu
  // din `file` o să iei numele fișierului cu `.name`
  // și de urcat îl urci cu `uploadBytes(fileRef, file)`
  //
  // `fileRef` e referința la fișier în storage
  // adică un path de genul `a/b/c.png`, așa cum e și în firestore
  // la noi `fileRef` o să fie direct `file.name`
  //
  // o să trebuiască să creezi și un document în firestore
  // mai precis să adaugi un mesaj special la chatul curent
  // care să conțină numele fișierului în `.fileName`
  // și descrierea sa generată de ai în `.imageDescription` (inițial `''`)
  //
  // după ce termini toate astea, vedem cu optimizarea și cu ai-ul
  // cred că fac eu una și sperând că merge ușor îți dau ție cealaltă
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
        <div v-for="(message, index) in messages" class="message">
          <div v-if="message.username !== '$'" :class="{ special: index > 0 && message.username === messages[index - 1].username && message.timestamp - messages[index - 1].timestamp < 5 }">
            <p class="user">{{ message.username }}</p>
            <p class="time">{{ timestampToString(message.timestamp) }}</p>
          </div>
          <!-- TODO @lizzzu -->
          <!-- `p`-ul de mai jos ar trebui să conțină un `v-if` -->
          <!-- dacă `message` conține câmpul `fileName` o să afișezi imagine, altfel paragraf -->
          <!-- ca să iei URL-ul propriu-zis al unei imagini din storage ai funcția `getDownloadURL(storage, fileName)` -->
          <p :style="{
            textAlign:
              message.username === '' ? 'center' :
              message.username === authUser.displayName ? 'right' : 'left',
            ...(message.username === '' ? { color: '#666' } : { })
          }" v-html="compileMessage(message.text, usernamesInChat)" />
        </div>
      </main>
    </div>
    <form class="new-message" @submit.prevent>
      <FileInput @upload="uploadPhoto">Send photo</FileInput>
      <input v-model.trim="newMessage" @keydown.tab="tryMention" placeholder="Type..." @focusin="typing = true" @focusout="typing = false" />
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
  background-color: #2c2c2c;
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

.message .special {
  display: none;
}

.message:has(.special) {
  margin-top: -1.5rem;
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
  background-color: #2c2c2c;
}

main > :first-child {
  margin-top: 1rem;
}

main > :last-child {
  margin-bottom: 1rem;
}

.main-wrapper {
  overflow: hidden;
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
