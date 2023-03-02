const express = require("express");
const routes=require("./routes");

require("dotenv").config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});

app.use('/vacation-mail-responder',routes);

app.get("/", async (req, res) => {
  // const result=await sendMail();
  res.send("Welcome to vacation email responder with NodeJS");
});