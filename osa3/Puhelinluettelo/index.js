require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const app = express()
const Person = require("./models/person")

morgan.token("body", (request) => (request.method === "POST" ? JSON.stringify(request.body) : ""))

const errorHandler = (error, request, response, next) => {
    console.error("BEEP", error.message)

    if(error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(express.static("dist"))
app.use(express.json())

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))



app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(people => {
            if (people) {
                response.json(people)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deletedPerson => {
            if (!deletedPerson) {
                return response.status(404).end()
            }
            response.json(deletedPerson)
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson)
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body 

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name 
            person.number = number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.get("/info", (request, response, next) => {
    Person.countDocuments({})
        .then(objectCount => {
            const t = new Date()
            response.send(`
                <p>Phonebook has info for ${objectCount} people</p>
                <p>${t}</p>`)
        })
        .catch(error => next(error))

})

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})