import { useState } from 'react'

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

const Persons = ({persons}) => (
  <ul>
    {persons.map(person =>
      <li key={person.name}>
        {person.name} {person.number}
      </li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }

    const personObject = { 
      name: newName,
      number: newNumber 
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={personsToShow} />
    </div>
  )

}

export default App