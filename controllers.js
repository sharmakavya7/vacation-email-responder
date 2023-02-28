const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");
const { prettyPrintJson } = require('pretty-print-json'); 


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
      const drafts = response.data.drafts;
      console.log(drafts.length); 
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
      console.log(data);
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

async function getMessage(req,res){
  try{
      // const url=`https://www.googleapis.com/gmail/v1/users/me/messages?q=${req.params.search}`
      const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages`
      const {token} = await oAuth2Client.getAccessToken();        
      const config = generateConfig(url,token)
      const response = await axios(config);
      res.json(response.data)
  }catch(error){
      console.log(error)
      res.send(error)
  }
};
// const auth = {...CONSTANTS.auth};

// function listMessages(auth) {
//   return new Promise((resolve, reject) => {
//     const gmail = google.gmail({ auth: auth, version: 'v1' });

//     gmail.users.messages.list(      
//       {        
//         userId: 'me',             
//       },(err, res) => {
//         if (err) {                    
//           reject(err);          
//           return;        
//         }        
//         if (!res.data.messages) {                    
//           resolve([]);          
//           return;        
//         }                
//         resolve(res.data.messages);      
//       }    
//     );
//   })
// }

// function getMessage(messageId, auth) {
//   const gmail = google.gmail({ auth: auth, version: 'v1' });
  
//   const response = gmail.users.messages.get({
//     'userId': 'me',
//     'id': messageId
//   });
//   console.log(response.data);
// }

// const messages = listMessages(auth, 'label:inbox subject:reminder');

// console.log(listLabels(auth));

module.exports = {
    getUser,
    sendMail,
    getDrafts,
    searchMail,
    readMail,
    getMessage
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
