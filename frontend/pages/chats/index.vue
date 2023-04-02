<script setup>
import { signOut } from 'firebase/auth';

const logOut = async () => {
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

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <h1>Chats</h1>
  <button @click="logOut">Sign out</button>
</template>
