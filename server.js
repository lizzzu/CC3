import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Express from "express";

const app = Express();

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

const firebaseConfig = {
  apiKey: "AIzaSyBw2qNzEaRvar6WD8alpEyNPeybHTzMVGc",
  authDomain: "upheld-garage-381905.firebaseapp.com",
  projectId: "upheld-garage-381905",
  storageBucket: "upheld-garage-381905.appspot.com",
  messagingSenderId: "933668001119",
  appId: "1:933668001119:web:b2690d1cbf8b8874db92ea"
};

const ap = initializeApp(firebaseConfig);
const store = getFirestore(ap);

const users = collection(store, "users");
addDoc(users, {
  name: "lizzzu",
  password: "lizu123"
});
