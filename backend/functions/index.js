import admin from 'firebase-admin';
import functions from 'firebase-functions';

admin.initializeApp();

export const addUserToFirestore = functions.auth.user().onCreate(async user => {
  await admin.firestore().doc(`users/${user.uid}`).set({
    username: user.displayName
  });
});
