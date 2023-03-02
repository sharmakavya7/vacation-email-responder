const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/:email', controller.repeat); 

module.exports = router