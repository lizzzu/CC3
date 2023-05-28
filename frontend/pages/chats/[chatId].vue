<script setup>
import { doc, updateDoc, collection, arrayUnion, Timestamp } from '@firebase/firestore'
import { uploadBytes, ref as storageRef } from '@firebase/storage'

const { chatId } = useRoute().params
const { $firestore, $storage } = useNuxtApp()
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

const typingCount = ref(0)

useInterval(() => {
  if (chat.value == null) return
  let count = 0
  for (const userId in chat.value.typing) {
    if (userId === authUser.value.uid) continue
    if (Timestamp.now() - chat.value.typing[userId] < 3) {
      count++
    }
  }
  typingCount.value = count
}, 1000)

const messages = computed(() => {
  const messages = [...chat.value.messages]
  if (typingCount.value > 0) {
    messages.push({
      text: (typingCount.value === 1 ? '1 person is' : typingCount.value + ' people are') + ' typing...',
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
  const tag = newMessage.value.match(/@(?<tag>[^@]*)$/)?.groups.tag
  if (tag == null) return
  const validUsernames = usernamesInChat.value.filter(username => username.toLowerCase().startsWith(tag.toLowerCase()))
  if (validUsernames.length !== 1) return
  event.preventDefault()
  newMessage.value = newMessage.value.slice(0, -tag.length) + validUsernames[0]
}

async function sendMessage() {
  const newName = newMessage.value.match(/^\$ rename (?<newName>.+)/)?.groups.newName
  if (newName != null) {
    await updateDoc(doc($firestore, 'chats', chatId), {
      name: newName
    })
    await updateDoc(doc($firestore, 'chats', chatId), {
      messages: arrayUnion({
        text: `Chat renamed to ${newName}.`,
        username: '',
        timestamp: Timestamp.now()
      })
    })
  }
  else {
    await updateDoc(doc($firestore, 'chats', chatId), {
      messages: arrayUnion({
        text: newMessage.value,
        username: authUser.value.displayName,
        timestamp: Timestamp.now()
      })
    })
  }
  newMessage.value = ''
}

watch(newMessage, async newNewMessage => {
  const typing = { }
  typing[authUser.value.uid] = newNewMessage === '' ? Timestamp.fromMillis(0) : Timestamp.now()
  await updateDoc(doc($firestore, 'chats', chatId), { typing })
})

const newUser = ref(null)

async function addUser() {
  await updateDoc(doc($firestore, 'chats', chatId), {
    messages: arrayUnion({
      text: `User ${newUser.value.username} ${randomJoinMessage()}`,
      username: '',
      timestamp: Timestamp.now()
    })
  })
  await updateDoc(doc($firestore, 'chats', chatId), {
    userIds: arrayUnion(newUser.value.id)
  })
}

async function uploadPhoto(file) {
  const fileName = randomKey()
  await uploadBytes(storageRef($storage, `images/${fileName}`), file)

  await updateDoc(doc($firestore, 'chats', chatId), {
    messages: arrayUnion({
      imageName: `${fileName}`,
      username: authUser.value.displayName,
      timestamp: Timestamp.now()
    })
  })
}
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <div v-if="chat != null">
    <header>
      <NuxtLink to="/chats" class="to-chats">← Back to chats</NuxtLink>
      <h1 v-html="compileText(chat.name, [])" />
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
        <div v-for="(message, index) of messages" class="message">
          <div v-if="message.username !== '$'" :class="{ special: index > 0 && message.username === messages[index - 1].username && message.timestamp - messages[index - 1].timestamp < 5 }">
            <p class="user" :class="{ bot: message.username === 'BOT' }">{{ message.username }}</p>
            <p class="time">{{ timestampToString(message.timestamp) }}</p>
          </div>
          <div class="message-content" :class="
            message.username === '' ? 'center' :
            message.username === authUser.displayName ? 'right' : 'left'"
          >
            <div v-if="'imageName' in message">
              <LoadingImage :imageName="message.imageName" />
            </div>
            <p v-else :style="{
              ...(message.username === '' ? { color: '#666' } : { })
            }" v-html="compileText(message.text, usernamesInChat)" />
          </div>
        </div>
      </main>
    </div>
    <form class="new-message" @submit.prevent>
      <FileInput @upload="uploadPhoto">Send photo</FileInput>
      <input v-model.trim="newMessage" @keydown.tab="tryMention" placeholder="Type..." />
      <button @click="sendMessage" :disabled="newMessage === ''">Send</button>
    </form>
  </div>
  <p v-else>Loading...</p>
</template>

<style scoped>
.message-content {
  display: flex;
}

.message-content.left {
  justify-content: left;
  text-align: left;
}

.message-content.right {
  justify-content: right;
  text-align: right;
}

.message-content.center {
  justify-content: center;
  text-align: center;
}

.message-content p {
  font-size: 1rem;
}

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

.message .user.bot {
  color: gold;
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
