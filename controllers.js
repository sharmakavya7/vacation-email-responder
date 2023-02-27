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
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      ...CONSTANTS.mailoptions,
      text: "Hey, I am on a vacation",
    };

    const result = await transport.sendMail(mailOptions);
    res.send(result);
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

  // It gives us back a bunch of draft IDs and corresponding message information.
  // Each message object has an id, which is the ID of the actual message, and a threadId.
  async function getDrafts(req, res) {
    try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
      const { token } = await oAuth2Client.getAccessToken();
      const config = generateConfig(url, token);
      const response = await axios(config);
      // the result is not json, input: json and producing a javascript obj
      res.json(response.data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function readMail(req, res) {
    try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages/${req.params.messageId}`;
      const { token } = await oAuth2Client.getAccessToken();
      const config = generateConfig(url, token);
      const response = await axios(config);
  
      let data = await response.data;
  
      res.json(data);
    } catch (error) {
      res.send(error);
    }
  }
// http://localhost:8000/api/mail/read/17f63b4513fb51c0
async function searchMail(req,res){
    try{
        const url=`https://www.googleapis.com/gmail/v1/users/me/messages?q=${req.params.search}`
        const {token}=await oAuth2Client.getAccessToken();        
        const config=generateConfig(url,token)
        const response=await axios(config);
        console.log(response);
        res.json(response.data)
    }catch(error){
        console.log(error)
        res.send(error)
    }
};

module.exports = {
    getUser,
    sendMail,
    getDrafts,
    searchMail,
    readMail,
};

// const filteredProduct = drafts.filter(messageObj => !!messageObj.message?.threadId);
// console.log(filteredProduct);

// !! null –> false
// !! [1, 2, 3] –> true

// How to make API requests with intervals
// let i = 0;
//     let idInterval = setInterval(() => {
//       if (i < dataFortheAPI.length) {
//         funtionThatMakestheApiRequest(dataFortheAPI[i]);
//         i++;
//       } else {
//         clearInterval(idInterval);
//       }
//     }, 22000);
