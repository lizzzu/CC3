<script setup>
import { getDownloadURL, ref as storageRef } from '@firebase/storage'

const { $storage } = useNuxtApp()

const { imageName } = defineProps(['imageName'])
const imageUrl = ref('')

onMounted(async () => {
  imageUrl.value = await getDownloadURL(storageRef($storage, `images/${imageName}`))
})
</script>

<template>
  <p v-if="imageUrl === ''">Loading image...</p>
  <img v-else :src="imageUrl" :alt="imageName">
</template>

<style scoped>
img {
  max-height: 300px;
  max-width: 600px;
}
</style>
