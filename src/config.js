const nconf = require('nconf');

module.exports = () => {
  nconf.argv()
  .env({
    lowerCase: true
  })
  .file({file: 'config.json'})
  .defaults({
    dest: 'data.json',
    image_dest: false
  })
  .required(['github_api_token']);

  return nconf.get();
};
