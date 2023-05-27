import admin from 'firebase-admin'
import functions from 'firebase-functions'

admin.initializeApp()

export const addUserToFirestore = functions.auth.user().onCreate(async user => {
  await admin.firestore().doc(`users/${user.uid}`).set({
    username: user.displayName,
    tokenCount: 10,
    bots: []
  })
})

export const notifyUser = functions.firestore.document('chats/{chatId}').onUpdate(async (change, context) => {
  const { chatId } = context.params
  const newChat = change.after.data()
  const oldChat = change.before.data()
  if (newChat.userIds.length === oldChat.userIds.length + 1) {
    const userId = newChat.userIds.at(-1)
    const { fcmToken } = (await admin.firestore().collection('users').doc(userId).get()).data()
    const { name } = (await admin.firestore().collection('chats').doc(chatId).get()).data()
    admin.messaging().sendToDevice(fcmToken, {
      data: {
        chatId,
        chatName: name
      }
    })
  }
})

export const updateBalance = functions.firestore.document('users/{userId}/payments/{paymentId}').onCreate(async (snapshot, context) => {
  const { userId } = context.params
  const tokenCount = 100 * (snapshot.data().items[0].quantity ?? 1)
  admin.firestore().collection('users').doc(userId).update({
    tokenCount: admin.firestore.FieldValue.increment(tokenCount)
  })
})
