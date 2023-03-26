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
  gitClone();
  const data = await loadData();
  return res.status(200).json(data);
};

const writeToFile = async (domains) => {
  //if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  shelljs.echo("inside writeToFile");
  shelljs.echo(shelljs.pwd());
  shelljs.echo(outFile);
  try {
    fs.writeFileSync(outFile, domains.join("\n"));
  } catch (error) {
    shelljs.echo(error);
  }
};

const gitClone = async () => {
  if (!fs.existsSync(path.resolve(__dirname, dirToSave))) {
    shelljs.exec(`git config user.email ${username}@stanford.edu`);
    shelljs.exec(`git config user.name Irina Trapido`);
    shelljs.exec(`git clone ${gitUrl} ${dirToSave}`);
  } else {
    //shelljs.exec(`git remote set-url origin ${gitUrl}`);
    shelljs.exec(`git config --list`);
    shelljs.cd(dirToSave);
    shelljs.exec(`git pull`);
  }
};

const gitAdd = async () => {
  try {
    shelljs.exec(`git config user.email ${username}@stanford.edu`);
    shelljs.exec(`git config user.name Irina Trapido`);
    shelljs.cd(dirToSave);
    shelljs.exec(`git add --all`);
    shelljs.exec(`git commit -m "Updated repo"`);
    shelljs.exec(`git push -u origin main`);
  } catch (error) {
    shelljs.echo("Error while pushing files to git repo, the error is ", error);
  }
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
  await writeToFile(domainsList);
  await gitAdd();
  return res.status(201).json(data);
};

module.exports = { httpGetDomains, httpSaveDomains, gitAdd };
