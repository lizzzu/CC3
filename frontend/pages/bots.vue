<script setup>
import { doc, updateDoc, arrayUnion, arrayRemove, collection, query, where, orderBy } from '@firebase/firestore'
import { createCheckoutSession } from '@stripe/firestore-stripe-payments'

const { $firestore, $payments } = useNuxtApp()
const authUser = useFirebaseAuth()

const tokenCount = ref(null)
const bots = ref([])
const apiKey = ref(null)

useSnapshot(doc($firestore, 'users', authUser.value.uid), async userSnapshot => {
  tokenCount.value = userSnapshot.data().tokenCount
  bots.value = [...userSnapshot.data().bots]
  apiKey.value = userSnapshot.data().apiKey
})

async function generateApiKey() {
  await updateDoc(doc($firestore, 'users', authUser.value.uid), {
    apiKey: randomApiKey()
  })
}

const tokenCountToBuy = ref(100)

async function buyTokens() {
  const session = await createCheckoutSession($payments, {
    mode: 'payment',
    price: 'price_1NCQ7DBCY48b4Ldy5XLvLx9L',
    quantity: tokenCountToBuy.value / 100
  })
  window.location.assign(session.url)
}

const chats = ref([])

useSnapshot(query(
  collection($firestore, 'chats'),
  where('userIds', 'array-contains', authUser.value.uid),
  orderBy('name')
), chatsSnapshot => {
  const chatDocs = []
  chatsSnapshot.forEach(chat => {
    chatDocs.push({
      id: chat.id,
      name: chat.data().name
    })
  })
  chats.value = chatDocs
})

const chatId = ref('')

async function addBot() {
  await updateDoc(doc($firestore, 'users', authUser.value.uid), {
    bots: arrayUnion(chatId.value)
  })
}

async function deleteBot(bot) {
  await updateDoc(doc($firestore, 'users', authUser.value.uid), {
    bots: arrayRemove(bot)
  })
}
</script>

<template>
  <header>
    <NuxtLink to="/chats" class="to-chats">← Back to chats</NuxtLink>
    <h1>My Chat Bots</h1>
  </header>
  <div class="info">
    <p class="wide">Your API key: <span>{{ apiKey ?? 'No API key yet' }}</span></p>
    <button @click="generateApiKey">{{ apiKey == null ? 'Generate' : 'Regenerate' }}</button>
    <button @click="copyToClipboard(apiKey)" :disabled="apiKey == null" :title="apiKey == null ? 'No API key to copy!' : ''">Copy</button>
  </div>
  <div class="info">
    <p class="wide">Your token count: <span>{{ tokenCount }}</span></p>
    <div class="range">
      <input v-model="tokenCountToBuy" type="range" min="100" max="1000" step="100" />
    </div>
    <button @click="buyTokens">Buy {{ tokenCountToBuy }} tokens!</button>
  </div>
  <p v-if="bots.length === 0">No bots yet</p>
  <TransitionGroup v-else tag="main">
    <article v-for="bot of bots" :key="bot" class="bot">
      <div v-html="`<span style='color: gold'>[${chats.find(chat => chat.id === bot)?.id}]</span> ` + compileText(chats.find(chat => chat.id === bot)?.name ?? '', [])" />
      <div class="buttons">
        <button class="copy" @click="copyToClipboard(chats.find(chat => chat.id === bot)?.id)">Copy</button>
        <button class="delete" @click="deleteBot(bot)">Delete</button>
      </div>
    </article>
  </TransitionGroup>
  <form class="new-bot" @submit.prevent>
    <select v-model="chatId">
      <option value="" disabled>Choose bot's chat</option>
      <option v-for="chat of chats.filter(chat => !bots.includes(chat.id))" :value="chat.id">{{ chat.name }}</option>
    </select>
    <button @click="addBot" :disabled="chatId === ''">Create new bot</button>
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

header .to-chats {
  position: absolute;
  top: 0;
  left: 0;
}

header .to-chats:where(:hover, :focus-visible) {
  text-decoration: underline 1px dashed #aaa;
  text-underline-offset: .3em;
}

h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  font-weight: lighter;
  text-align: center;
}

p, article {
  display: block;
  margin: .5rem 0;
  padding: .7rem;
  font-size: 1.3rem;
}

article {
  background-color: #2c2c2c;
  border: 1px solid #ddd;
  transition-duration: .5s;
  transition-timing-function: ease;
  transition-property: transform, background-color;
}

article:where(:hover, :focus-visible) {
  transform: scale(1.03);
}

article:has(+ article:where(:hover, :focus-visible)), article:where(:hover, :focus-visible) + article {
  transform: scale(1.02);
  transition-duration: .75s;
}

article:has(+ article + article:where(:hover, :focus-visible)), article:where(:hover, :focus-visible) + article + article {
  transform: scale(1.01);
  transition-duration: 1s;
}

.buttons {
  display: flex;
  gap: .5rem;
}

.copy {
  color: lightskyblue;
  border: 1px solid lightskyblue;
}

.delete {
  color: #ffa1d5;
  border: 1px solid #ffa1d5;
}

.new-bot {
  display: flex;
  align-items: center;
  margin: 1rem 0 2rem 0;
  gap: .3rem;
}

.new-bot select {
  flex: 1;
}

.bot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot div span:first-child {
  color: gold;
}

.bot div span:last-child {
  font-size: .5em;
}

.info {
  display: flex;
  align-items: stretch;
  gap: .5rem;
  margin: .5rem 0;
}

.info:last-of-type {
  margin-bottom: 1rem;
}

.info * {
  font-size: 1rem;
  background-color: #444;
}

.info p {
  margin: 0;
}

.info button {
  background-color: #333;
}

.info button:where(:hover, :focus-visible) {
  background-color: #444;
}

.info .wide {
  flex-grow: 1;
}

.info .wide span {
  color: lightskyblue;
}

.range {
  display: flex;
  padding: .5rem;
  background-color: #444;
}

.range input {
  padding: 0;
}

@media (max-width: 700px) {
  p, article {
    margin: 1rem 0;
    padding: .5rem;
    font-size: 1rem;
  }

  .new-bot {
    flex-direction: column;
  }

  .new-bot select {
    min-width: 100%;
  }
}
</style>
