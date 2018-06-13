require('dotenv').config();
const fs = require('fs');
const graphqlQuery = require('./graphql-query');
const githubParser = require('./github-parser');
const awesomeParser = require('./awesome-parser');

const main = async() => {
  const projects = await awesomeParser();
  const query = JSON.stringify(graphqlQuery(projects));
  const githubResults = await githubParser.getProjects({query, token: process.env.GITHUB_API_TOKEN});
  const result = await githubParser.parseResult(githubResults, projects);
  const dest = process.env.DEST || 'data.json';
  fs.writeFileSync(dest, JSON.stringify(result));
}

main();