export default defineNuxtRouteMiddleware(to => {
  const user = useCookie('user').value;
  if (to.path === '/user' && !user) {
    return navigateTo('/');
  }
});
