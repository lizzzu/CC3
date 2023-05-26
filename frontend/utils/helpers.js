import katex from 'katex'
import twemoji from 'twemoji'

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

export function compileText(text, usernames) {
  return twemoji.parse(
    text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replace(/\$.+\$/g, match => katex.renderToString(match.slice(1, -1)))
      .replace(/https?:\/\/\S+/g, match => `<a href="${match}" target="_blank" style="color: cornflowerblue">${match.slice(0, 100) + (match.length > 100 ? '...' : '')}</a>`)
      .replace(new RegExp('@(' + usernames.join('|') + ')', 'g'), match => `<span style="color: gold">${match}</span>`),
    { folder: 'svg', ext: '.svg' }
  )
}
