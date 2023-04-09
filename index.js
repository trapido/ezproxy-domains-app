const express = require("express");
const cors = require("cors");
const app = express();
const domainsRoute = require("./routes/domains.route");
const expressWinston = require('express-winston');
const winston = require('winston');
const path = require('path')


//middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("build"));
//to view logs, go to "<url>/static/error.log"
app.use('/static', express.static(path.join(__dirname, 'logs')))
// Place the express-winston logger before the router.
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
    })
  ]
}));

//set up domains router
app.use("/v1/domains", domainsRoute);
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      json: true,
      filename: './logs/error.log'
    })
  ]
})); 

const port = process.env.PORT || 3001;
const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
