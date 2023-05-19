import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import firebaseConfig from '@/firebase.config.js'

export default defineNuxtPlugin(nuxtApp => {
  const app = initializeApp(firebaseConfig)
  const firestore = getFirestore(app)
  nuxtApp.provide('firestore', firestore)
})
