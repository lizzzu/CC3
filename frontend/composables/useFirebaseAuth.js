export function useFirebaseAuth() {
  return useCookie('user', {
    secure: true,
    sameSite: 'none'
  })
}
