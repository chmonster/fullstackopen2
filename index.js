const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const morgan = require('morgan')
morgan.token('person', function (req) {
  if (req.body && req.body.name && req.body.number) {
    return JSON.stringify(req.body)
  } else {
    return ''
  }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(express.static('build'))

const now = () => new Date(Date.now()).toString()

/* let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
] */

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(
      `<p>Phonebook has ${persons.length} listings <br /> ${now()}</p>`
    )
  })
})

app.post('/api/persons', (request, response, next) => {
  const newName = request.body.name
  const newNumber = request.body.number
  const person = new Person ({
    name: newName,
    number: newNumber
  })

  console.log('post checking for dupe')
  Person.findOne({ 'name': newName })
    .then(matchedPerson => {
      if(!matchedPerson) {
        person.save()
          .then(savedPerson => response.json(savedPerson))
          .catch(error => next(error))
      } else {
        console.log(matchedPerson.json)
        response.status(409).end()
      }
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log('app.delete', result)
      result
        ? response.status(204).end()
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person
        ? response.json(person)
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  //console.log('put', request.body, request.params.id)
  const { name, number } = request.body
  Person.findByIdAndUpdate(request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      updatedPerson
        ? response.json(updatedPerson)
        : response.status(404).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  //console.error('errorHandler', error.message, error.response.data)
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT //|| 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})