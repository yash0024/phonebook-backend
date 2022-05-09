require('dotenv').config()
const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('tiny'));

const Person = require('./models/person')

morgan.token('postData', (request) => {
    if (request.method == 'POST') {
        return JSON.stringify(request.body)
    }
    else {
        return ' '
    }
})

app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
))

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
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
  })

app.get('/info', (request, response) => {
    response.send(`
        <div>
            <p>
                Phonebook has info for ${persons.length} people
            </p>
            <p>
                ${new Date()}
            </p>
        </div>`
    )
  })


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
      })
    })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }
    
    // if (persons.map(person => person.name).includes(body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})