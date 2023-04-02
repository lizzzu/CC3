export default defineNuxtRouteMiddleware(to => {
  const user = useCookie('user').value;
  if (to.path === '/chats' && !user) {
    return navigateTo('/');
  }
  if (to.path === '/' && user) {
    return navigateTo('/chats');
  }
});
