const fetch = require("node-fetch");
const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

//const proxyFileSUL = "https://raw.githubusercontent.com/sul-dlss/SearchWorks/master/config/ezproxy/sul_proxy_file.txt";
//const proxyFileLaw = "https://raw.githubusercontent.com/sul-dlss/SearchWorks/master/config/ezproxy/law_proxy_file.txt";
const inFile = path.resolve(__dirname, "..", "configs", "sul_proxy_file.txt");

async function loadData() {
  const domains = [];
  try {
    //const response = await fetch(proxyFileSUL);
    //const responseText = await response.text();
    let responseText = fs.readFileSync(inFile, "utf8");
    data = responseText.split("\n");
    data = data.filter((str) => str !== "");
    data.forEach((item) => domains.push({ id: nanoid(), domain: item }));
  } catch (err) {
    // handle error
    console.log(err);
  }
  return domains;
}

//loadData();
module.exports = {
  loadData,
};
