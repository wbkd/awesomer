const axios = require('axios');
const marked = require('marked');

module.exports = async (url='https://raw.githubusercontent.com/wbkd/awesome-d3/master/README.md') => {
    try {
        // get awesome list
        const res = await axios.get(url);

        // parse markdown
        const md = marked.lexer(res.data);
        let category = '';
        const projects = md.map(line => {
            if (line.type === 'heading' && line.depth > 1) {
                // find category
                category = line.text.toLowerCase();
            }
            if (line.type === 'text') {
                // add entry
                const text = line.text;
                if (text.match(/\[(.*?)\]/)) {
                  return {
                      name: text.match(/\[(.*?)\]/)[1],
                      repo: text.match(/\((.*?)\)/)[1],
                      description: text.split(' - ')[1],
                      category: category
                  };
                }
              }
        }).filter(line => typeof line !== 'undefined');

        return projects;
    } catch (err) {
        console.error(err);
    }
};
