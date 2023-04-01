<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const signIn = async () => {
  const { user } = await signInWithPopup(useNuxtApp().$auth, new GoogleAuthProvider());
  useCookie('user').value = user;
};
</script>

<template>
  <Head>
    <Title>hello liz</Title>
  </Head>
  <button @click="signIn">test</button>
  <h1>hello <span>liz</span>!</h1>
  <ol>
    <li>am schimbat <code>npm</code> în <code>yarn</code> 🐬</li>
    <li>din firebase cel mai probabil o să folosim <strong>firestore</strong> și <strong>auth</strong>, așa că le-am exportat din <code>firebase.js</code> 🔥</li>
    <li><strong>nuxt</strong> e framework-ul frontend de bază pentru site-urile făcute cu vue 🏗️</li>
    <li>dacă nu-ți place ceva la css în general, poți modifica <code>assets/css/global.css</code> 🎨</li>
    <li>dacă vrei să modifici fontul sau să adaugi altele, du-te în <code>nuxt.config.ts</code> 🔧</li>
    <li>am configurat twemoji (în cel mai țărănesc mod posibil) să-ți convertească toate emoji-urile normale în emoji-uri twitter 🐦</li>
    <li>soluția a fost să fac un layout (wrapper pentru toată pagina) default în care emoji-urile normale sunt convertite o dată la fiecare secundă ⏳</li>
    <li>nu ne mai batem capul cu fontawesome 😉</li>
    <li>cel mai probabil nu mai avem nevoie de backend explicit din moment ce avem google cloud 😶‍🌫️</li>
    <li>probabil doar câteva fișiere ca să ruleze la ei pe servere, cum ar fi funcțiile cloud 🚀</li>
    <li>dar nu sunt sigur, vedem, momentan lăsăm așa 🦦</li>
  </ol>
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
