const logic = require('./logic');

function repeat(req, res) {
  const email = req.params.email;
  logic.getMessage(email);
  res.send("People have been notified about you being on a vacation");
}
  
module.exports = {
  repeat
};