let chatId

self.addEventListener('push', event => {
  const data = event.data.json()
  chatId = data.data.chatId
  self.registration.showNotification('New chat!', {
    requireInteraction: true,
    title: 'New chat!',
    body: `You've been added to ${data.data.chatName}.`
  })
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow(`/chats/${chatId}`))
})
