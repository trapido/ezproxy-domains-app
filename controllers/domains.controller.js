const { loadData } = require("../models/domains.model");
const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");
const git = simpleGit();
const shelljs = require("shelljs");
require("dotenv").config();
const username = process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;
const dirToSave = path.resolve(__dirname, "..", "config");
const repo = "ezproxy-domains.git";
const gitUrl = `https://${username}:${token}@github.com/${username}/${repo}`;
const outFile = path.resolve(__dirname, "..", "config", "sul_proxy_file.txt");

const httpGetDomains = async (req, res) => {
  if (!fs.existsSync(dirToSave)) {
    shelljs.exec(`git clone ${gitUrl} ${dirToSave}`);
  } else {
    //shelljs.cd(dirToSave);
    shelljs.echo(">I inside pull");
    shelljs.echo(shelljs.ls("."))

    shelljs.exec(`git -C ${dirToSave} pull`);
  }
  const data = await loadData();
  res.status(200).json(data);
};

const httpSaveDomains = async (req, res) => {
  const data = req.body;
  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      error: "No data to submit",
    });
  }
  const domainsList = data.map((item) => {
    return item.domain;
  });

  try {
    shelljs.echo("Inside httpSave");
    shelljs.echo(shelljs.ls("."))
  
    fs.writeFileSync(outFile, domainsList.join("\n"));
    //shelljs.cd(dirToSave);
    shelljs.exec(`git -C ${dirToSave} config user.email ${username}@stanford.edu`);
    shelljs.exec(`git -C ${dirToSave} config user.name Irina Trapido`);
    shelljs.exec(`git -C ${dirToSave} add --all`);
    shelljs.exec(`git -C ${dirToSave} commit -m "Updated repo"`);
    shelljs.exec(`git -C ${dirToSave} push -u origin main`);
  } catch (error) {
    shelljs.echo("Error while pushing files to git repo, the error is ", error);
  }

  return res.status(201).json(data);
};

module.exports = { httpGetDomains, httpSaveDomains };
