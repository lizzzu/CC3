<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signIn = async () => {
  try {
    const { user } = await signInWithPopup(useNuxtApp().$auth, new GoogleAuthProvider());
    useCookie('user').value = user;
    await navigateTo('/chats');
  }
  catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Head>
    <Title>Our chat</Title>
  </Head>
  <h1>Our chat</h1>
  <button @click="signIn">Sign in</button>
</template>

<style scoped>
code {
  padding: .15rem .25rem;
  font-family: 'Source Code Pro', monospace;
  background-color: #0004;
}

li {
  margin: .5rem 0;
}

span, li::marker {
  color: pink;
}
</style>
