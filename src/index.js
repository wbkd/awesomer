#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const readConfig = require('./config');
const graphqlQuery = require('./graphql-query');
const githubParser = require('./github-parser');
const awesomeParser = require('./awesome-parser');
const screenshots = require('./screenshot');

const main = async() => {
  const config = readConfig();
  const { github_api_token, dest, image_dest } = config;

  try {
    const projects = await awesomeParser();
    const query = JSON.stringify(graphqlQuery(projects));
    const githubResults = await githubParser.getProjects({query, token});
    const result = await githubParser.parseResult(githubResults, projects);
  } catch (err) {
    console.error('Runtime error:', err);
    process.exit(1);
  }

  const datapath = path.resolve(dest);
  fs.writeFileSync(datapath, JSON.stringify(result));

  const imagepath = path.resolve(image_dest);
  await screenshots(imagepath, result);
};

main().catch(console.error);
