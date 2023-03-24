const express = require("express");
const router = express.Router();
const {
  httpGetDomains,
  httpSaveDomains,
} = require("../controllers/domains.controller");

router.route("/").get(httpGetDomains).post(httpSaveDomains);

module.exports = router;
