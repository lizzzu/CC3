import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBw2qNzEaRvar6WD8alpEyNPeybHTzMVGc',
  authDomain: 'upheld-garage-381905.firebaseapp.com',
  projectId: 'upheld-garage-381905',
  storageBucket: 'upheld-garage-381905.appspot.com',
  messagingSenderId: '933668001119',
  appId: '1:933668001119:web:b2690d1cbf8b8874db92ea'
};

const app = initializeApp(config);
const fire = getFirestore(app);
const auth = getAuth(app);

export { fire, auth };
