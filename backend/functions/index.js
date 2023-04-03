import admin from 'firebase-admin';
import functions from 'firebase-functions';

admin.initializeApp();

export const logNewChatCreation = functions.firestore
  .document(`chats/{newChatId}`)
  .onCreate(async chat => {
    console.log(chat);
    const chatId = chat.id;
    await admin.firestore().doc(`logs/${Math.floor(Math.random() * 10)}`).set({
      test: `a new chat with id ${chatId} has just been created`
    });
  });
