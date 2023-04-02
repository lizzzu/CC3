<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

async function logIn() {
  try {
    const { user } = await signInWithPopup(useNuxtApp().$auth, new GoogleAuthProvider());
    useCookie('user').value = user;
    await navigateTo('/chats');
  }
  catch (error) {
    console.error(error);
    alert(error.message);
  }
};
</script>

<template>
  <Head>
    <Title>Our chat</Title>
  </Head>
  <h1>Our chat</h1>
  <button @click="logIn">Sign in 🔑</button>
</template>

<style scoped>
h1 {
  margin: 0 auto 2rem auto;
  width: fit-content;
  font-size: 3rem;
  text-align: center;
}
</style>
