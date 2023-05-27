import { doc, getDoc } from '@firebase/firestore'

export default defineNuxtRouteMiddleware(async to => {
  const { $firestore } = useNuxtApp()
  const authUser = useFirebaseAuth()
  if (authUser.value == null && (to.path.startsWith('/chats') || to.path.startsWith('/bots'))) {
    return navigateTo('/')
  }
  if (authUser.value != null) {
    if (to.path === '/') {
      return navigateTo('/chats')
    }
    if (to.path.startsWith('/chats/')) {
      const userId = authUser.value.uid
      const chatId = to.path.slice('/chats/'.length)
      if (chatId === '') return
      const chatDoc = await getDoc(doc($firestore, 'chats', chatId))
      if (!chatDoc.exists() || !chatDoc.data().userIds.includes(userId)) {
        return createError({ statusCode: 404 })
      }
    }
  }
})
