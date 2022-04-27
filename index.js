//const http = require('http')
const express = require('express')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')

morgan.token('person', function (req, res) { 
    if (req.body && req.body.name && req.body.number) {
        return JSON.stringify(req.body)
    } else {
        return ''
    }
})

//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

const now = () => new Date(Date.now()).toString()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has ${persons.length} listings <br /> ${now()}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) { 
        response.json(person) 
    } else { 
        response.statusMessage = 'person not found'
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    if(persons.find(person => person.id === id)) {
        persons = persons.filter(person => person.id !== id)
    } 
    else { 
        response.statusMessage = 'person not found'
    }
    response.status(204).end()
})

const newID = () => {
    /*return persons.length > 0 
    ? Math.max(...persons.map(p=>p.id)) + 1
    : 0 */
    return Math.floor(100*Math.random())
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: newID(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

