const axios = require("axios");
const { generateConfig, findOccurrenceInList } = require("./utils");
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
  if(!emailId) {
    return;
  }
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

    // await transport.sendMail(mailoptions);
    transport.sendMail(mailoptions, (err, info) => {
      if(err) {
        console.log(err);
      } else {
        // Add a label to the email message
        const messageId = info.messageId;
        const labelId = "AutoResponse";
        const removeLabelId = "INBOX";

        console.log(messageId);

        gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          resource: {
            addLabelIds: [labelId],
            removeLabelIds: [removeLabelId]
          }
        }, (err, res) => {
          if (err) {
            console.error(err);
          } else {
            console.log(res);
          }
        });
      }
    })
  } catch (error) {
    console.log("error in sendMail function", messageId);
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
    return getEmailId(response.data);
  } catch (error) {
    console.log("error in readMail function", messageId);
    return "-1";
  }
}

function getIDsToReply(list) {
  const msgIdsToReply = findOccurrenceInList(list);
  const msgIdListToReply = [];
  Object.keys(msgIdsToReply).forEach((key) => {
    if(msgIdsToReply[key] === 1) {
      msgIdListToReply.push(key);
    } 
  });
  console.log(msgIdListToReply);
  return msgIdListToReply;
}

function sendMailToIDs(idSet) {
  idSet.forEach(async (id) => {
    try{
      const emailId = await readMail(id);
      if(emailId === "-1") {
        return;
      }
      if(emailId === "kavyaofficial711@gmail.com") {
        sendMail(emailId);
      }
    }
    catch(error){
      console.log("error in sendMailToIDs function", messageId);
    }
  });
}

async function getMessage(email){
  try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?maxResults=100`
      const {token} = await oAuth2Client.getAccessToken();        
      const config = generateConfig(url,token);
      const response = await axios(config);
      
      const idSet = getIDsToReply(response.data.messages);
      sendMailToIDs(idSet);
  }catch(error){
    console.log("error in getMessage function", messageId);
  }
};


module.exports = {
    sendMail,
    readMail,
    getMessage
};
