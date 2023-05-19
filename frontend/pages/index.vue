<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const { $auth } = useNuxtApp()
const authUser = useFirebaseAuth()

async function logIn() {
  try {
    const { user } = await signInWithPopup($auth, new GoogleAuthProvider())
    authUser.value = user
    await navigateTo('/chats')
  }
  catch (error) {
    console.error(error)
    alert(error.message)
  }
}
</script>

<template>
  <Head>
    <Title>Our chat</Title>
  </Head>
  <header>
    <h1>Our chat</h1>
    <button @click="logIn">Sign in</button>
  </header>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  text-align: center;
}
</style>
