import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(nuxtApp => {
  const config = {
    apiKey: 'AIzaSyBw2qNzEaRvar6WD8alpEyNPeybHTzMVGc',
    authDomain: 'upheld-garage-381905.firebaseapp.com',
    projectId: 'upheld-garage-381905',
    storageBucket: 'upheld-garage-381905.appspot.com',
    messagingSenderId: '933668001119',
    appId: '1:933668001119:web:b2690d1cbf8b8874db92ea'
  };

  const app = initializeApp(config);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  nuxtApp.vueApp.provide('auth', auth);
  nuxtApp.provide('auth', auth);
  nuxtApp.vueApp.provide('firestore', firestore);
  nuxtApp.provide('firestore', firestore);
});
