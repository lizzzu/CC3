import { doc, getDoc } from '@firebase/firestore';

export default defineNuxtRouteMiddleware(async to => {
  const user = useCookie('user').value;
  if (!user && to.path.startsWith('/chats')) {
    return navigateTo('/');
  }
  if (user) {
    if (to.path === '/') {
      return navigateTo('/chats');
    }
    if (to.path.startsWith('/chats/')) {
      const userId = user.uid;
      const chatId = to.path.slice('/chats/'.length);
      if (chatId === '') return;
      const chatDoc = await getDoc(doc(useNuxtApp().$firestore, 'chats', chatId));
      if (!chatDoc.exists() || chatDoc.data().users.findIndex(user => user.userId === userId && user.accepted)) {
        return createError({ statusCode: 404 });
      }
    }
  }
});
