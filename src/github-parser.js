const axios = require('axios');
const github = require('@octokit/rest')();

const fs = require('fs');

const getProjects = async ({query='', url='https://api.github.com/graphql', token='', method='POST'}) => {
  github.authenticate({
    type: 'token',
    token
  });

  try {
    const req = {
      method,
      url,
      data: query,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios(req);
    const githubErrors = response.data.errors;
    if (githubErrors) {
      console.error(`Error requesting ${url}:`, githubErrors);
    }

    return response.data.data;
  } catch (err) {
    console.error(`Error requesting ${url}:`, err);
  }
};

const parseResult = async (result, projects) => {
  const githubProjects = [];
  for (res in result) {
    const project = result[res];
    if (project) {
      const listEntry = projects.find(p => p && (p.name.toLowerCase() === project.name.toLowerCase()));

      const githubRequest = await github.repos.getContributors({
        owner: project.owner.login,
        repo: project.name,
        per_page: 100
      });

      const contributors = await sumContributors(githubRequest, 0);

      const entry = {
        name: project.name,
        githubDescription: project.description,
        description: listEntry && listEntry.description,
        category: listEntry && listEntry.category,
        homepage: project.homepageUrl,
        license: project.licenseInfo.name,
        stars: project.stargazers.totalCount,
        contributors,
        owner: project.owner.login,
        issues: project.issues.totalCount,
        pullRequests: project.pullRequests.totalCount,
        watchers: project.watchers.totalCount,
        url: project.url,
        size: project.diskUsage
      };

      if (project.ref) entry.lastUpdate = project.ref.target.committedDate;
      githubProjects.push(entry)
    }
  }

  return githubProjects;
};

const sumContributors = async (request, i) => {
  const contributors = request.data.length;
  const sum = i + contributors;
  if (github.hasNextPage(request)) {
    const nextPage = await github.getNextPage(request);
    return sumContributors(nextPage, sum);
  } else {
    return sum;
  }
};

module.exports = {
  getProjects,
  parseResult
};
