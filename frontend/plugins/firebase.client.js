import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import firebaseConfig from '@/firebase.config.js';

export default defineNuxtPlugin(nuxtApp => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const messaging = getMessaging(app);
  const firestore = getFirestore(app);
  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);
  nuxtApp.vueApp.provide('firestore', firestore);
  nuxtApp.provide('firestore', firestore);
  nuxtApp.vueApp.provide('messaging', messaging);
  nuxtApp.provide('messaging', messaging);
});
