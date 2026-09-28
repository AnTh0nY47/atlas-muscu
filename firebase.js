// Connexion au projet Firebase du propriétaire de l'appli (compte gratuit, offre Spark).
// Ce fichier ne fait qu'exposer quelques fonctions sur window.cloud ; toute la logique
// de synchronisation vit dans app.js pour rester lisible d'un seul bloc.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, onSnapshot,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBJs3i1Xz6qWiGTp0P1FcfElrsTXvGBlQo",
  authDomain: "atlas-muscu.firebaseapp.com",
  projectId: "atlas-muscu",
  storageBucket: "atlas-muscu.firebasestorage.app",
  messagingSenderId: "755145867902",
  appId: "1:755145867902:web:beeda44ec7410e847a4e2f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.cloud = {
  onAuth(cb) { return onAuthStateChanged(auth, cb); },
  signUp(email, pw) { return createUserWithEmailAndPassword(auth, email, pw).then(c => c.user); },
  signIn(email, pw) { return signInWithEmailAndPassword(auth, email, pw).then(c => c.user); },
  signOutUser() { return signOut(auth); },
  resetPassword(email) { return sendPasswordResetEmail(auth, email); },
  fetchData(uid) { return getDoc(doc(db, 'users', uid)).then(s => (s.exists() ? s.data() : null)); },
  pushData(uid, data) { return setDoc(doc(db, 'users', uid), data); },
  watch(uid, cb) { return onSnapshot(doc(db, 'users', uid), s => cb(s.data(), s.metadata.hasPendingWrites)); },
};
window.dispatchEvent(new CustomEvent('cloud-ready'));
