<script setup>
import { getToken } from 'firebase/messaging'
import { doc, updateDoc } from 'firebase/firestore'

const { $messaging, $firestore } = useNuxtApp()
const authUser = useFirebaseAuth()

onMounted(async () => {
  if (authUser.value == null) return
  try {
    const token = await getToken($messaging, { vapidKey: 'BE-Q2JjRYQJGQ8xIXtDv35i0dnnCXHZx9SF2h1o5yeHOzJ-4QXH5VUpg5P7C7ANgAeY-kUOq40SjPHrpz3Zb_5g' })
    await updateDoc(doc($firestore, 'users', authUser.value.uid), { fcmToken: token })
  }
  catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <slot />
</template>
