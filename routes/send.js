const express = require('express');
const controllers = require('../controllers/controllers')

const send = express.Router();

send.post('/', controllers.send);

module.exports = send