const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(req, res) {
  try {
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}
// get a email user
async function getUser(req, res) {
    try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
      const { token } = await oAuth2Client.getAccessToken();
      const config = generateConfig(url, token);
      const response = await axios(config);
      res.json(response.data);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

async function getDrafts(req, res) {
  try {
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function readMail(req, res) {
  try {
  } catch (error) {
    res.send(error);
  }
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  readMail,
};