import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({message, className}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Filter = ({filter, onChange}) => (
  <div>
    Filter shown with:
    <input value={filter} onChange={onChange} />
  </div>
)

const PersonsForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => (
  <form onSubmit={addPerson}>
    <div>
      Name:
      <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      Number:
      <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">Add</button>
    </div>
  </form>
)

const Persons = ({persons, removePerson}) => (
  <ul>
    {persons.map(person =>
      <li key={person.name}>
        {person.name} {person.number}{' '}
        <button onClick={() => removePerson(person.name, person.id)}>
          Delete
        </button>
      </li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notification = (message) => {
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
  }

  const errorMessage = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if(existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService 
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
            notification(`Updated number for ${returnedPerson.name}`)
          })
          .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
              errorMessage(error.response.data.error)
            } else {
              errorMessage(`${existingPerson.name} has already been removed from the server`)
              setPersons(persons.filter(p => p.id !== existingPerson.id))
            }
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        notification(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        errorMessage(error.response.data.error)
      })
  }

  const removePerson = (name, id) => {
    const confirmDelete = window.confirm(`Delete ${name}?`)
    if(!confirmDelete) return

    personService 
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        notification(`Deleted ${name}`)
      })
      .catch(() => {
        errorMessage(`${name} was already removed from the server.`)
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} className={"notification"} />
      <Notification message={error} className={"error"} />
      
      <Filter filter={filter} onChange={(event) => setFilter(event.target.value)} />

      <h3>Add a new</h3>
      <PersonsForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
      />
      
      <h3>Numbers</h3>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )

}

export default App