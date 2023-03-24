const express = require("express");
const cors = require("cors");
const app = express();

const domainsRoute = require("./routes/domains.route");

//middleware
<<<<<<< HEAD:server/index.js
app.use(cors({ origin: "*" }));
||||||| 828a322:server/server.js
app.use(cors({ origin: "*" }));
app.use(morgan("combined"));
=======
app.use(cors());
app.use(morgan("combined"));
>>>>>>> f2b43e39b6853e8ed2de3f92358f379b9c7f7b71:server/server.js
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
