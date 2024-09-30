const express = require('express');
const controllers = require('../controllers/controllers')

const unreadMessagesCount = express.Router()

unreadMessagesCount.post('/', controllers.unreadMessages)

module.exports = unreadMessagesCount