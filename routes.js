const express = require('express');
const controllers=require('./controllers');
const router = express.Router();

// Sends an email via Nodemailer
// router.get('/mail/send',controllers.sendMail);

// Gets an email from its message ID
// router.get('/mail/read/:messageId', controllers.readMail);

router.get('/mail/list/:email', controllers.getMessage); 

module.exports = router