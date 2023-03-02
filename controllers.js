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

async function sendMail(emailId) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    const mailoptions = {
      from: "Kavya <sharmakavya1002@gmail.com>",
      to: emailId, 
      subject: "vacation-email-responder",
      text: "Hey, I am on a vacation",
    };

    await transport.sendMail(mailoptions);
    // res.send(result);
  } catch (error) {
    // console.log(error);
    // res.send(error);
  }
}

async function readMail(messageId) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages/${messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    let dataa = await response.data;
    // console.log(dataa);
    const freshEmails = [];
    for(var i=0; i<dataa.payload.headers.length; i++) {
      for(var keyy in dataa.payload.headers[i]) {
        if(dataa.payload.headers[i][keyy] === "From") {
          const val = dataa.payload.headers[i].value        
          // console.log(val);
          var matches = val.match(/\<(.*?)\>/);
          if (matches) {
            var submatch = matches[1];
          }
          // console.log("submatch: " + submatch);
          return submatch;
        }
      }
    }
    // const val = dataa.payload.headers[18].value;
    // console.log(val);
    // console.log(freshEmails);
    // sendMail(freshEmails);
    res.json(dataa);
    // return freshEmails;
  } catch (error) {
    // console.log(error)
    // res.send(error);
  }
}

function getIDsToReply(list) {
  const msgIdSet = new Set();
  list.forEach(obj => {
    if(obj.id === obj.threadId) {
      msgIdSet.add(obj.id);
    }
  });
  return msgIdSet;
}

async function getMessage(req,res){
  try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages`
      const {token} = await oAuth2Client.getAccessToken();        
      const config = generateConfig(url,token);
      const response = await axios(config);
      
      const idSet = getIDsToReply(response.data.messages);
      idSet.forEach(id => {
        const emailId = readMail(id);
        // console.log(emailId);
        if(emailId === "officiallycreated7@gmail.com") {
          console.log("hey");
        } else {
          console.log(".");
        }
      });
      res.json(response.data);
  }catch(error){
      console.log(error)
      res.send(error)
  }
};

module.exports = {
    sendMail,
    readMail,
    getMessage
};



// to hume basically krna ye hai ki
// - hum realtime reply krre hai right, jaise hi koi bhi fresh mail aaega to uska msgid and threadid
// same hi hoga, to hume vo saare same wale collect krne hai (40sec tak)and unko reply kr dena hai


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
