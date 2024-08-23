import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAERVfxYXvjVPaCO7fib_CA1xCCvfjMFkU",
  authDomain: "opendictionarydata.firebaseapp.com",
  projectId: "opendictionarydata",
  storageBucket: "opendictionarydata.appspot.com",
  messagingSenderId: "503954008335",
  appId: "1:503954008335:web:45e2cda0a81f3c6d8db67a",
  measurementId: "G-X4YF5QSE12"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

