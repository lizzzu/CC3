<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const logIn = async () => {
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
  <button @click="logIn">Sign in</button>
</template>
