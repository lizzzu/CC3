import { doc, getDoc } from '@firebase/firestore'

export default defineNuxtRouteMiddleware(async to => {
  const nuxtApp = useNuxtApp()
  const authUser = useFirebaseAuth()
  if (authUser.value == null && to.path.startsWith('/chats')) {
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
      const chatDoc = await getDoc(doc(nuxtApp.$firestore, 'chats', chatId))
      if (!chatDoc.exists() || chatDoc.data().userIds.indexOf(userId) === -1) {
        return createError({ statusCode: 404 })
      }
    }
  }
})
