<script setup>
import { getDownloadURL, ref as storageRef } from '@firebase/storage'

const { $storage } = useNuxtApp()

const { imageName } = defineProps(['imageName'])
const imageUrl = ref('')

onMounted(async () => {
  imageUrl.value = await getDownloadURL(storageRef($storage, `images/${imageName}`))
})

const optimizedImageUrl = computed(() => {
  const operations = [
    {
      operation: 'input',
      type: 'url',
      url: encodeURI(imageUrl.value)
    },
    {
      operation: 'output',
      format: 'webp'
    }
  ]
  return 'https://europe-west3-upheld-garage-381905.cloudfunctions.net/ext-image-processing-api-handler/process?operations=' + encodeURIComponent(JSON.stringify(operations))
})
</script>

<template>
  <p v-if="imageUrl === ''">Loading image...</p>
  <img v-else :src="optimizedImageUrl" :alt="imageName">
</template>

<style scoped>
img {
  height: auto;
  max-height: 400px;
  max-width: 60%;
}
</style>
