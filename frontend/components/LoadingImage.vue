<script setup>
import { query, collection, where } from '@firebase/firestore'
import { getDownloadURL, ref as storageRef } from '@firebase/storage'

const { $firestore, $storage } = useNuxtApp()

const { imageName, align } = defineProps(['imageName', 'align'])
const imageUrl = ref('')

onMounted(async () => {
  imageUrl.value = await getDownloadURL(storageRef($storage, `images/${imageName}`))
})

const labels = ref([])

useSnapshot(query(
  collection($firestore, 'imageLabels'),
  where('file', '==', `gs://upheld-garage-381905.appspot.com/images/${imageName}`)
), labelsSnapshot => {
  labelsSnapshot.forEach(document => {
    labels.value = document.data().labels
  })
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
  <template v-if="align === 'left'">
    <img :src="optimizedImageUrl" :alt="labels.join(', ')">
    <p v-html="labels.join('<br />')"></p>
  </template>
  <template v-else>
    <p v-html="labels.join('<br />')"></p>
    <img :src="optimizedImageUrl" :alt="labels.join(', ')">
  </template>
</template>

<style scoped>
img {
  height: auto;
  max-height: 400px;
  max-width: 60%;
  margin: .1rem .4rem;
}
</style>
