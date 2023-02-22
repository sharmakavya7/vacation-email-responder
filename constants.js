require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "sharmakavya1002@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Kavya <sharmakavya1002@gmail.com>",
  to: "sharmakavya1002@gmail.com",
  subject: "vacation-email-responder",
};

module.exports = {
  auth,
  mailoptions,
};