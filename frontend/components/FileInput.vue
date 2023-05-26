<script setup>
const emit = defineEmits(['upload'])

function onChange(event) {
  emit('upload', event.target.files[0])
}
</script>

<template>
  <label>
    <!-- TODO @lizzzu -->
    <!-- știu că voiai mai multe tipuri de fișiere -->
    <!-- tre să modifici `accept`, o să vezi că-i simplu -->
    <input type="file" accept="image/png" @change="onChange" />
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
