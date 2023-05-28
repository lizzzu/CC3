<script setup>
const emit = defineEmits(['upload'])

function onChange(event) {
  if (event.target.files.length === 1) {
    emit('upload', event.target.files[0])
  }
}
</script>

<template>
  <label>
    <input type="file" accept="image/*" @change="onChange" />
    <slot />
  </label>
</template>

<style scoped>
input {
  display: none;
}

label {
  cursor: pointer;
}
</style>
