import { useState, useEffect } from 'react'
import { getDatabase, ref, get, set, child } from 'firebase/database'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { signInWithGoogle } from './main'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [definition, setDefinition] = useState('')
  const [newWord, setNewWord] = useState('')
  const [newDefinition, setNewDefinition] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
  }, [])

  const handleSearch = async () => {
    const dbRef = ref(getDatabase())
    const snapshot = await get(child(dbRef, `words/${searchTerm}`))
    if (snapshot.exists()) {
      setDefinition(snapshot.val())
    } else {
      setDefinition('Word not found in the database.')
    }
  }

  const handleAddWord = async () => {
    if (!user) {
      alert('You must be signed in to add a word.')
      return
    }
    const db = getDatabase()
    await set(ref(db, 'words/' + newWord), newDefinition)
    setNewWord('')
    setNewDefinition('')
    alert('Word added successfully!')
  }

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  return (
    <div id="root">
      <h1>Dictionary</h1>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="definition-section">
        {definition && (
          <p>
            <strong>Definition:</strong> {definition}
          </p>
        )}
      </div>
      <div className="add-word-section">
        <h2>Add a New Word</h2>
        {user ? (
          <>
            <input
              type="text"
              placeholder="New word..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <input
              type="text"
              placeholder="Definition..."
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
            />
            <button onClick={handleAddWord}>Add Word</button>
          </>
        ) : (
          <button onClick={handleSignIn}>Sign in with Google to add a word</button>
        )}
      </div>
    </div>
  )
}

export default App

