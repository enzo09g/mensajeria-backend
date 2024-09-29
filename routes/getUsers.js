const express = require('express');
const getUsers = express.Router();

const controllers = require('../controllers/controllers')

getUsers.get('/', controllers.getUsers)

module.exports = getUsers