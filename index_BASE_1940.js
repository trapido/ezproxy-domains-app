const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const domainsRoute = require("./routes/domains.route");

//middleware
app.use(cors({ origin: "*" }));
app.use(morgan("combined"));
app.use(express.json());
//set up domains router
app.use("/domains", domainsRoute);

const port = process.env.PORT || 3001;
const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
