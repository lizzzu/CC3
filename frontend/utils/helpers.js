export function randomJoinMessage() {
  const messages = [
    'just joined the chat.',
    'joined the party!',
    'is here!',
    'just landed.',
    'appeared.',
    'just arrived.',
    'has spawned in the chat!',
    'showed up!',
    'hopped into the server.'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export function timestampToString(timestamp) {
  return timestamp.toDate().toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function highlightMentions(message) {
  return message
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/@\w+/g, match => `<span style="color: gold">${match}</span>`)
}
