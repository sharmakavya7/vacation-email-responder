const express = require('express');
const controllers=require('./controllers');
const router = express.Router();

// Fetches information about a Gmail user
router.get('/mail/user/:email',controllers.getUser)

// Sends an email via Nodemailer
router.get('/mail/send',controllers.sendMail);

// Gets all the drafts for a user
router.get('/mail/drafts/:email', controllers.getDrafts);

// Gets an email from its message ID
router.get('/mail/read/:messageId', controllers.readMail);

module.exports = router