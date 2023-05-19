<script setup>
import twemoji from 'twemoji'
import { getToken } from 'firebase/messaging'
import { doc, updateDoc, collection } from 'firebase/firestore'

const VAPID_KEY = 'BE-Q2JjRYQJGQ8xIXtDv35i0dnnCXHZx9SF2h1o5yeHOzJ-4QXH5VUpg5P7C7ANgAeY-kUOq40SjPHrpz3Zb_5g'

useInterval(() => {
  twemoji.parse(document.body, {
    folder: 'svg',
    ext: '.svg'
  })
}, 1000)

const { $messaging, $firestore } = useNuxtApp()
const authUser = useFirebaseAuth()

onMounted(async () => {
  if (authUser.value == null) return
  try {
    const token = await getToken($messaging, { vapidKey: VAPID_KEY })
    await updateDoc(doc(collection($firestore, 'users'), authUser.value.uid), { fcmToken: token })
  }
  catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <slot />
</template>
