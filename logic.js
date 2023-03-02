const axios = require("axios");
const { generateConfig } = require("./utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("./constants");
const { google } = require("googleapis");
const { ids } = require("googleapis/build/src/apis/ids");

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
      subject: "Re: vacation-email-responder",
      text: "Hey, I am on a vacation",
    };

    await transport.sendMail(mailoptions);
  } catch (error) {
    console.log(error);
  }
}

function getEmailId(dataa) {
  for(var i=0; i<dataa.payload.headers.length; i++) {
    for(var keyy in dataa.payload.headers[i]) {
      if(dataa.payload.headers[i][keyy] === "From") {
        const val = dataa.payload.headers[i].value        
        var matches = val.match(/\<(.*?)\>/);
        if (matches) {
          var submatch = matches[1];
        }
        return submatch;
      }
    }
  }
}

async function readMail(messageId) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages/${messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    let dataa = await response.data;
    return getEmailId(dataa);
  } catch (error) {
    console.log(error);
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

function sendMailToIDs(idSet) {
  idSet.forEach(async (id) => {
    try{
      const emailId = await readMail(id);
      if(emailId === "kavyaofficial711@gmail.com") {
        sendMail(emailId);
      }
    }
    catch(error){
      console.log(error);
    }
  });
}

async function getMessage(email){
  try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages`
      const {token} = await oAuth2Client.getAccessToken();        
      const config = generateConfig(url,token);
      const response = await axios(config);
      
      const idSet = getIDsToReply(response.data.messages);
      sendMailToIDs(idSet);
  }catch(error){
      console.log(error)
  }
};


module.exports = {
    sendMail,
    readMail,
    getMessage
};
