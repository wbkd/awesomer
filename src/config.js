const nconf = require('nconf');

module.exports = () => {
  nconf
    .argv()
    .env({
      lowerCase: true,
    })
    .file({ file: 'config.json' })
    .defaults({
      dest: 'data.json',
      image_dest: false,
      list_url:
        'https://raw.githubusercontent.com/wbkd/awesome-d3/master/README.md',
    })
    .required(['github_api_token']);

  return nconf.get();
};
