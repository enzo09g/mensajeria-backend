const express = require('express');
const controllers = require('../controllers/controllers')

const getChats = express.Router();

getChats.post('/', controllers.getChats)

module.exports = getChats