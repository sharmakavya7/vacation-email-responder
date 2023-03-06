const logic = require('./logic');

function repeat(req, res) {
  logic.getMessage(500);
  res.send("People have been notified about you being on a vacation");
}
  
module.exports = {
  repeat
};