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
  const data = await loadData();
  return res.status(200).json(data);
};

const writeToFile = async (domains) => {
  if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
  await fs.writeFileSync(outFile, domains.join("\n"));
};

const gitClone = async () => {
  if (!fs.existsSync(path.resolve(__dirname, dirToSave))) {
    await shelljs.exec(`git clone ${gitUrl} ${dirToSave}`);
  } else {
    await shelljs.exec(`git remote set-url origin ${gitUrl}`);
    await shelljs.exec(`git pull origin main --allow-unrelated-histories`);
  }
};

const gitAdd = async () => {
  try {
    await shelljs.cd(dirToSave);
    await shelljs.exec(`git add --all`);
    await shelljs.exec(`git commit -m "Updated repo"`);
    await shelljs.exec(`git push -u origin main`);
  } catch (error) {
    console.log("Error while pushing files to git repo, the error is ", error);
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
