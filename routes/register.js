const express = require('express');
const controllers = require('../controllers/controllers')

const register = express.Router();

register.post('/', controllers.register);

module.exports = register;
