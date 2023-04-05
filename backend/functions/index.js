import admin from 'firebase-admin';
import functions from 'firebase-functions';

admin.initializeApp();

export const addUserToFirestore = functions.auth.user().onCreate(async user => {
  await admin.firestore().doc(`users/${user.uid}`).set({
    username: user.displayName
  });
});

export const notifyUser = functions.firestore.document('chats/{chatId}').onUpdate(async (change, context) => {
  const chatId = context.params.chatId;
  const newChat = change.after.data();
  const oldChat = change.before.data();
  if (newChat.userIds.length === oldChat.userIds.length + 1) {
    const userId = newChat.userIds.at(-1);
    const { fcmToken } = (await admin.firestore().collection('users').doc(userId).get()).data();
    const { name } = (await admin.firestore().collection('chats').doc(chatId).get()).data();
    admin.messaging().sendToDevice(fcmToken, {
      data: {
        chatId,
        chatName: name
      }
    });
  }
});
