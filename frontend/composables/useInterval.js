export function useInterval(callback, interval) {
  const intervalId = ref('')
  onMounted(() => {
    callback()
    intervalId.value = setInterval(callback, interval)
  })
  onUnmounted(() => clearInterval(intervalId.value))
}
