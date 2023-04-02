<script setup>
const signOut = async () => {
  try {
    useCookie('user').value = null;
    await navigateTo('/');
  }
  catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <Head>
    <Title>Chats</Title>
  </Head>
  <h1>Chats</h1>
  <button @click="signOut">Sign out</button>
</template>
