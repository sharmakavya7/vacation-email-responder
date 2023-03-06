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

async function modifyLabel(messageId, removeLabelIds) {
  if(!messageId) {
    return;
  }
  console.log("remove: "+removeLabelIds);
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${CONSTANTS.auth.user}/messages/${messageId}/modify`;
    const {token} = await oAuth2Client.getAccessToken();        
    const requestBody = {
      addLabelIds: [
        'CATEGORY_PERSONAL'
      ],
      removeLabelIds: ["INBOX"]
    };
    const headers = {
      Authorization: `Bearer ${token} `,
      "Content-type": "application/json",
    };
    axios.post(url, requestBody, {headers: headers})
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error + "error");
      });
    
  } catch (error) {
    console.log("error in sendMail function", messageId);
  }
}

async function sendMail(emailId, subject) {
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
      subject: `Re: ${subject}`,
      text: "Hey, I am on a vacation",
    };
    await transport.sendMail(mailoptions);
  } catch (error) {
    console.log("error in sendMail function", messageId);
  }
}

function getEmailIdAndSubjectAndLabelIds(dataa, temp) {
  const result = {};
  result.removeLabelIds = dataa.labelIds;
  for(var i=0; i<dataa.payload.headers.length; i++) {
    for(var keyy in dataa.payload.headers[i]) {
      if(dataa.payload.headers[i][keyy] === "Subject") {
        result.subject = dataa.payload.headers[i].value ;
      }
      if(dataa.payload.headers[i][keyy] === "From") {
        const val = dataa.payload.headers[i].value        
        var matches = val.match(/\<(.*?)\>/);
        if (matches) {
          var submatch = matches[1];
          result.email = submatch;
        }
      }
    }
  }
  return result;
}

async function readMail(messageId, temp) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages/${messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    const ans = getEmailIdAndSubjectAndLabelIds(response.data, temp);
    return ans;
  } catch (error) {
    console.log("error in readMail function", messageId);
    return "-1";
  }
}

function getIDsToReply(list) {
  const freqOfThreadIdObj = findOccurrenceInList(list);
  const msgIdListToReply = [];
  Object.keys(freqOfThreadIdObj).forEach((key) => {
    if(freqOfThreadIdObj[key] === 1) {
      msgIdListToReply.push(key);
    } 
  });
  return msgIdListToReply;
}

async function sendMailToIDs(idList) {
  idList.forEach(async (id) => {
    try{
      const { email, subject } = await readMail(id);
      if(email === "-1") {
        return;
      }
      if(email === "rastogiritesh1340@gmail.com" || email === "riteshrastogi1340@gmail.com" || email == "kavyaofficial711@gmail.com") {
        await sendMail(email, subject);
        getMessage(1);
      }
    }
    catch(error){
      console.log("error in sendMailToIDs function", messageId);
    }
  });
}
async function getMessage(maxMessagesToFetch){
  try {
      const url = `https://gmail.googleapis.com/gmail/v1/users/${CONSTANTS.auth.user}/messages?maxResults=${maxMessagesToFetch}`;
      const {token} = await oAuth2Client.getAccessToken();        
      const config = generateConfig(url,token);
      const response = await axios(config);

      const idList = getIDsToReply(response.data.messages);
      if(maxMessagesToFetch === 1) {
        const messageIdOfSentMessage = idList[0];
        const ans = await readMail(messageIdOfSentMessage, 2);
        await modifyLabel(messageIdOfSentMessage, ans.removeLabelIds);
      } 
      else {
        await sendMailToIDs(idList);
      }
  }catch(error){
    console.log(error);
  }
};


module.exports = {
    sendMail,
    readMail,
    getMessage
};
