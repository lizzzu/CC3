import firebaseConfig from '@/firebase.config.js'
import { initializeApp } from '@firebase/app'
import { getAuth } from '@firebase/auth'
import { getFirestore } from '@firebase/firestore'
import { getMessaging } from '@firebase/messaging'
import { getStripePayments } from '@stripe/firestore-stripe-payments'

export default defineNuxtPlugin(nuxtApp => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const messaging = getMessaging(app)
  const payments = getStripePayments(app, {
    productsCollection: 'products',
    customersCollection: 'users'
  })
  nuxtApp.provide('firebase', app)
  nuxtApp.provide('auth', auth)
  nuxtApp.provide('firestore', firestore)
  nuxtApp.provide('messaging', messaging)
  // TODO @lizzzu
  // așa cum am expus până acum `auth`/ `firestore`/ `messaging`
  // așa trebuie acum expus și `storage`
  nuxtApp.provide('payments', payments)
})
