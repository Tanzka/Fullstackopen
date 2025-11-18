const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())
morgan.token("body", (request) => (request.method === "POST" ? JSON.stringify(request.body) : ""))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.use(express.static("dist"))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id 
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id 
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body 

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    }

    const checkName = persons.some(
        p => p.name.toLowerCase() === body.name.toLowerCase()
    )
    if (checkName) {
        return response.status(400).json({error: "name must be unique"})
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    response.json(person)
})

app.get("/info", (request, response) => {
    let size = persons.length
    let time = new Date()
    response.send(`
        <p>Phonebook has info for ${size} people</p>
        <p>${time}</p>`)
})

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})