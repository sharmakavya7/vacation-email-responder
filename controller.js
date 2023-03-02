const logic = require('./logic');

function repeat(req, res) {
    const email = req.params.email;
    logic.getMessage(email);
    res.send("people have been notified about us being on a vacation");
  }
  
  module.exports = {
    repeat
  };