<script setup>
const bots = [
  'id-chat-1',
  'id-chat-2'
]

const conversationId = ref('')
</script>

<template>
  <header>
    <NuxtLink to="/chats" class="to-chats">← Back to chats</NuxtLink>
    <h1>My Chat Bots</h1>
  </header>
  <p v-if="bots.length === 0">No bots yet</p>
  <TransitionGroup v-else tag="main">
    <article v-for="bot of bots" :key="bot" class="bot">
      <div>{{ bot }}</div>
      <button @click="deleteBot(bot)">Delete</button>
    </article>
  </TransitionGroup>
  <form class="new-bot" @submit.prevent>
    <select v-model="conversationId">
      <option value="" disabled>Choose bot's conversation</option>
      <option v-for="conversation of conversations" :value="conversation.id">{{ conversation.name }}</option>
    </select>
    <button @click="addBot" :disabled="conversationId === ''">Create new bot</button>
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

.new-bot {
  display: flex;
  align-items: center;
  margin: 1rem 0 2rem 0;
  gap: .3rem;
}

.new-bot input {
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

.bot button {
  color: #ffa1d5;
  border: 1px solid #ffa1d5;
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

  .new-bot input {
    min-width: 100%;
  }
}
</style>
