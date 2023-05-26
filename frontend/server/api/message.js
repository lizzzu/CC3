import { initializeApp } from 'firebase/app'
import { getFirestore, updateDoc, increment, arrayUnion, doc, getDoc, getDocs, query, collection, where, Timestamp } from 'firebase/firestore'
import firebaseConfig from '@/firebase.config.js'

const app = initializeApp(firebaseConfig)
const $firestore = getFirestore(app)

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const userDocs = await getDocs(query(collection($firestore, 'users'), where('apiKey', '==', body.apiKey)))
  const users = []
  userDocs.forEach(userDoc => users.push({ id: userDoc.id, ...userDoc.data() }))
  if (users.length !== 1) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Wrong API key!'
    })
  }
  if (!(await getDoc(doc($firestore, 'chats', body.bot))).exists()) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Wrong bot ID!'
    })
  }
  const { tokenCount } = users[0];
  if (tokenCount === 0) {
    throw createError({
      statusCode: 402,
      statusMessage: 'No more tokens!'
    })
  }
  await updateDoc(doc($firestore, 'chats', body.bot), {
    messages: arrayUnion({
      text: body.message,
      username: 'BOT',
      timestamp: Timestamp.now()
    })
  })
  await updateDoc(doc($firestore, 'users', users[0].id), {
    tokenCount: increment(-1)
  })
  return 'Message sent!'
})
