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

    const mailoptions = {
      from: "Kavya <sharmakavya1002@gmail.com>",
      to: freshEmails, 
      subject: "vacation-email-responder",
      text: "Hey, I am on a vacation",
    };

    const result = await transport.sendMail(mailoptions);
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

const freshEmails = [];
async function readMail(req, res) {
  try {
    // console.log("idd:" + idd);
    const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages/${req.params.messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    let dataa = await response.data;
    // console.log(dataa);
    // for(var i=0; i<dataa.payload.headers.length; i++) {
    //   for(var keyy in dataa.payload.headers[i]) {
    //     if(dataa.payload.headers[i][keyy] === "From") {
    //       const val = dataa.payload.headers[i].value        
    //       // console.log(val);
    //       var matches = val.match(/\<(.*?)\>/);
    //       if (matches) {
    //         var submatch = matches[1];
    //       }
    //       // console.log(submatch);
    //       freshEmails.push(submatch);
    //     }
    //   }
    // }
    
    // const val = dataa.payload.headers[18].value;
    // console.log(val);
    console.log(freshEmails);
    // sendMail(freshEmails);
    res.json(dataa);
    // return freshEmails;
  } catch (error) {
    // console.log(error)
    // res.send(error);
  }
}
const msgIdlist = new Set();
async function getMessage(req,res){
  try {
      // const url=`https://www.googleapis.com/gmail/v1/users/me/messages?q=${req.params.search}`
      const url = `https://gmail.googleapis.com/gmail/v1/users/sharmakavya1002@gmail.com/messages`
      const {token} = await oAuth2Client.getAccessToken();        
      const config = generateConfig(url,token);
      const response = await axios(config);
      // list.push(response.data);
      const list = response.data;
      // console.log(list);
      for(var i=0; i<list.messages.length; i++) {
        for(var keyy in list.messages[i]) {
          // console.log(keyy + ' ' + list.messages[i][keyy]);
          if(list.messages[i].id === list.messages[i].threadId) {
            // console.log(list.messages[i][keyy]);
            msgIdlist.add(list.messages[i].id);
          }
        }
      }
      console.log(msgIdlist);
      console.log(msgIdlist.size);
      // const emailList = await readMail();
      // console.log("emailList: " + emailList);
      res.json(response.data);
  }catch(error){
      console.log(error)
      res.send(error)
  }
};

/*
            // console.log(list.messages[i].id);
            const emailList = await readMail(req, res, list.messages[i].id);
            console.log(emailList);
            // console.log(freshEmails)
*/

module.exports = {
    getUser,
    sendMail,
    getDrafts,
    searchMail,
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
