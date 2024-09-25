const express = require('express')
const controllers = require('../controllers/controllers')

const check = express.Router();

check.get('/', controllers.middleCheck)
check.get('/', controllers.check)


module.exports = check