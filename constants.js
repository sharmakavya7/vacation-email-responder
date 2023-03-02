require("dotenv").config();

// creating objects auth and mailoptions (for sending email)

const auth = {
  type: "OAuth2",
  user: "sharmakavya1002@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

module.exports = {
  auth
};