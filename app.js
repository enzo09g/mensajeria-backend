const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const secretKey = "Mi clave super ultra secreta"

const app = express()

app.use(express.json());
app.use(cors())

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})

const register = require('./routes/register')
const login = require('./routes/login')
const check = require('./routes/check')

app.get('/', (req, res) => {
    res.send("<h1>Funciona?</h1>")
})

app.use('/register', register)

app.use('/login', login)

app.use('/home', check)