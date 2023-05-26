import { onSnapshot } from 'firebase/firestore'

export function useSnapshot(query, callback) {
  let unsubscribe = () => { }
  onMounted(() => unsubscribe = onSnapshot(query, callback))
  onUnmounted(unsubscribe)
}
