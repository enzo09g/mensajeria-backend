const express = require('express');
const controllers = require('../controllers/controllers')

const login = express.Router();

login.post('/', controllers.login)

module.exports = login