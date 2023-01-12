const axios = require('axios');
const { Octokit } = require('@octokit/rest');

const getProjects = async ({
  query = '',
  url = 'https://api.github.com/graphql',
  token = '',
  method = 'POST',
}) => {
  try {
    const req = {
      method,
      url,
      data: query,
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

const parseResult = async (result, projects, token) => {
  const githubProjects = [];
  const octokit = new Octokit({
    type: 'token',
    token,
  });

  for (res in result) {
    const project = result[res];
    if (project) {
      const listEntry = projects.find(
        (p) => p && p.name.toLowerCase() === project.name.toLowerCase()
      );

      const contributors = await octokit.paginate(
        octokit.rest.issues.listContributors,
        {
          owner: project.owner.login,
          repo: project.name,
        }
      );

      const contributorsCount = contributors.length;

      const entry = {
        name: project.name,
        githubDescription: project.description,
        description: listEntry && listEntry.description,
        category: listEntry && listEntry.category,
        homepage: project.homepageUrl,
        stars: project.stargazers.totalCount,
        contributors: contributorsCount,
        owner: project.owner.login,
        issues: project.issues.totalCount,
        pullRequests: project.pullRequests.totalCount,
        watchers: project.watchers.totalCount,
        url: project.url,
        size: project.diskUsage,
      };

      if (project.ref) entry.lastUpdate = project.ref.target.committedDate;
      if (project.licenseInfo) entry.license = project.licenseInfo.name;
      githubProjects.push(entry);
    }
  }

  return githubProjects;
};

module.exports = {
  getProjects,
  parseResult,
};
