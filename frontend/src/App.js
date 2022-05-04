//import axios from 'axios'
import { useState, useEffect } from 'react'

import personService from './services/persons'
import PhoneList from './components/PhoneList'

const App = () => {

  const [message, setMessage] = useState([null, null])

  const [persons, setPersons] = useState([])
  const [personsFiltered, setPersonsFiltered] = useState(persons)

  const hook = () => {
    console.log('effect')
    personService
      .getAll()
      .then(initialList => {
        console.log('hook getAll', initialList)
        setPersons(initialList)
        setPersonsFiltered(initialList)
      })
  }
  useEffect(hook, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const clearEntries = () => {    
    setNewName('')
    setNewNumber('')
    setSearchTerm('')
  }  

  const showDBError = (error) => {
    //console.log('showDBError', error)
    if(error.response.data.error) {
      setMessage([error.response.data.error,'error'])
    } else {
      setMessage([error.message,'error'])
    }
    setTimeout(() => setMessage([null, null]), 5000)
  }

  const cleanupAddEntry = (returnedPerson) => {
    console.log('create', returnedPerson)
    if(persons.find(person => person.name === returnedPerson.name)) { //already deleted
      setPersons(persons.map(person => 
        person.name !== returnedPerson.name ? person : returnedPerson
      ))
      setPersonsFiltered(persons.map(person => 
        person.name !== returnedPerson.name ? person : returnedPerson
      ))
    } else {
      setPersons(persons.concat(returnedPerson))
      setPersonsFiltered(persons.concat(returnedPerson))
    }
    clearEntries()
    setMessage([`${returnedPerson.name} added`, 'confirm'])
    setTimeout(() => setMessage([null, null]), 5000)
  }

  const cleanupDelete = (id, name) => {
    console.log('deleted', id, name)
    setPersons(persons.filter(person => person.id !== id))
    setPersonsFiltered(persons.filter(person => person.id !== id))
    clearEntries()
    setMessage([`${name} deleted`, 'confirm'])
    setTimeout(() => setMessage([null, null]), 5000)
  }

  const cleanupDeleteDeletedError = (error, id, name) => {
    setMessage([`${name} already deleted`,'error'])
    setTimeout(() => setMessage([null, null]), 5000)
    console.log(error)
    clearEntries()    
    setPersons(
      persons.filter(person => person.id !== id)
    )
    setPersonsFiltered(
      persons.filter(person => person.id !== id)
    )
  }
  
  const cleanupNumberChange = (enteredPerson) => {
    console.log('before', persons)
    const matchedPerson = persons.find(person => person.name === enteredPerson.name )
    const updatedPerson = { ...matchedPerson, number:enteredPerson.number } 
    console.log(enteredPerson, matchedPerson, updatedPerson)
    personService
      .update(matchedPerson.id, enteredPerson)
      .then(person => {
        setPersons(
          persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson)
        )
        setPersonsFiltered(
          persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson)
        )
        console.log('updated', persons)
        setMessage([`${enteredPerson.name}'s number changed`, 'confirm'])
        setTimeout(()=>setMessage([null, null]), 5000)
        clearEntries()
      })
      .catch(error => {
        console.log(error.response)
        if(error.response.status === 404) {
          console.log('cleanupNumberChange error')
          cleanupUpdateDeletedPersonError(error, matchedPerson.id, matchedPerson.name)
        } else {
          showDBError(error)
        }
      })
  } 

  const cleanupUpdateDeletedPersonError = (error, id, name) => {
    //alert(`${entryObject.name} has been deleted`)
    setMessage([`${name} has been deleted previously`, 'error'])
    setTimeout(() => setMessage([null, null]), 5000)
    console.log(error)
    setPersons(
      persons.filter(person => person.id !== id)
    )
    setPersonsFiltered(
      persons.filter(person => person.id !== id)
    )
    clearEntries()
  } 

  const addEntry = (event) => {
    event.preventDefault()
    const enteredPerson = {
      name: newName,
      number: newNumber
    }
    personService
      .create(enteredPerson)
      .then(returnedPerson => {
        console.log('addEntry', returnedPerson)
        cleanupAddEntry(returnedPerson)
      })
      .catch((error) => {
        console.log('addEntry error', error.response.status)
        //showDBError(error)
        if(error.response.status === 409) {
          window.confirm('Person is listed, update number?')
          ? cleanupNumberChange(enteredPerson)
          : console.log('update declined')
        } else {
          showDBError(error)
        }
      })

  }

  const deleteEntry = (id, name) => {
    const check = window.confirm(`Delete ${name}?`)
    if(check) {
      personService
        .deleteObject(id)
        .then(()=> cleanupDelete(id, name))
        .catch(error => cleanupDeleteDeletedError(error, id, name))
    }
  }
  
  const handleNameChange = (event) => {
    console.log('name ', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('number ', event.target.value)
    setNewNumber(event.target.value)
  }
  
  const handleSearchTermChange = (event) => {
    //console.log('search ', event.target.value)
    setPersonsFiltered(
      persons.filter(person => 
        person.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    )
    setSearchTerm(event.target.value)
  }
  
  return (
    <PhoneList key='phonelist'
      message = {message[0]}
      messageType = {message[1]}
      search={searchTerm}
      handleSearch={handleSearchTermChange}
      addEntry={addEntry}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      personsFiltered={personsFiltered}
      deleteEntry={deleteEntry}
    />
  )
}

export default App


  
  