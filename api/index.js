const express = require('express');
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(express.json());
app.use(cors())

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})

const register = require('../routes/register')
const login = require('../routes/login')
const check = require('../routes/check')
const send = require('../routes/send');
const getChats = require('../routes/getChats');
const unreadMessagesCount = require('../routes/unreadMessagesCount')
const getUsers = require('../routes/getUsers')

app.get('/', (req, res) => {
    res.send("<h1>Servidor</h1>")
})

app.use('/register', register)

app.use('/login', login)

app.use('/home', check)

app.use('/send', send)

app.use('/get_chats', getChats)

app.use('/unread_messages_count', unreadMessagesCount)

app.use('/getUsers', getUsers)

module.exports = app
