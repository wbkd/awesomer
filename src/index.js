#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const readConfig = require('./config');
const graphqlQuery = require('./graphql-query');
const githubParser = require('./github-parser');
const awesomeParser = require('./awesome-parser');
const screenshots = require('./screenshot');

const main = async () => {
  const config = readConfig();
  const { github_api_token: token, dest, image_dest, list_url } = config;

  let result;
  try {
    const projects = await awesomeParser(list_url);
    const query = JSON.stringify(graphqlQuery(projects));

    const githubResults = await githubParser.getProjects({ query, token });
    result = await githubParser.parseResult(githubResults, projects, token);
  } catch (err) {
    console.error('Runtime error:', err);
    process.exit(1);
  }

  const datapath = path.resolve(dest);
  fs.writeFileSync(datapath, JSON.stringify(result));

  if (image_dest) {
    try {
      await screenshots(image_dest, result);
    } catch (err) {
      console.error('Error downloading images:', err);
    }
  }
};

main().catch(console.error);
