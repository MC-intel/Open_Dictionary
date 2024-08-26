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
      <div className="signin-section">
        {!user && (
          <button onClick={handleSignIn}>
            <i className="fab fa-google"></i> Sign in with Google
          </button>
        )}
      </div>
      <div className="search-section">
        <label htmlFor="search">Search for a word:</label>
        <input
          id="search"
          type="text"
          placeholder="Enter a word..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>
          <i className="fas fa-search"></i> Search
        </button>
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
            <label htmlFor="new-word">New word:</label>
            <input
              id="new-word"
              type="text"
              placeholder="Enter the new word..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <label htmlFor="new-definition">Definition:</label>
            <input
              id="new-definition"
              type="text"
              placeholder="Enter the definition..."
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
            />
            <button onClick={handleAddWord}>
              <i className="fas fa-plus"></i> Add Word
            </button>
          </>
        ) : (
          <p>Please sign in to add a new word.</p>
        )}
      </div>
    </div>
  )
}

export default App
