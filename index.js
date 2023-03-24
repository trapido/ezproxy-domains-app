const express = require("express");
const cors = require("cors");
const app = express();

const domainsRoute = require("./routes/domains.route");

//middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("build"));
//set up domains router
app.use("/v1/domains", domainsRoute);

const port = process.env.PORT || 3001;
const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();