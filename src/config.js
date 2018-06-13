const nconf = require('nconf');
const defaults = require('../../defaults');

// read config hierarchically from:
nconf.argv()          // cli arguments
  .env({              // env variables
    lowerCase: true   // convert to lowercase
  })
  .file({file: 'config.json'})  // config.json file
  .defaults({                   // fallback to the default
    output: 'data.json'
  })
  .required(['github_api_key']);  // required fields

module.exports = nconf.get();
