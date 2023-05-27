import firebaseConfig from '@/firebase.config.js'
import { initializeApp } from '@firebase/app'
import { getFirestore } from '@firebase/firestore'

export default defineNuxtPlugin(nuxtApp => {
  const app = initializeApp(firebaseConfig)
  const firestore = getFirestore(app)
  nuxtApp.provide('firestore', firestore)
})
