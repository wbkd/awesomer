
module.exports = (projects) => {
    projects = projects.filter(project => project.repo.startsWith('https://github.com/')).map(project => {
        const projectId = project.repo.replace('https://github.com/', '').split('/');
        const owner = projectId[0];
        const name = projectId[1];
        const res = `${name.replace(/-/g, '_').replace(/\./g, '_').replace(/\s/g, '_')}: repository(owner: "${owner}", name: "${name}") {
            ...requestedFields
        }`;
        return res;
    })
    .filter(project => !project.startsWith('bullet_chart')) // @FIXME
    .join('\n');


    return {query: `query GetGithubData {
        ${projects}
    }

    fragment requestedFields on Repository {
        name
        description
        homepageUrl
        licenseInfo{
            name
        }
        stargazers {
            totalCount
        }
        owner {
            login
        }
        issues(states: [OPEN]) {
            totalCount
        }
        pullRequests(states: [OPEN]) {
            totalCount
        }
        watchers {
            totalCount
        }
        ref(qualifiedName: "master") {
            target {
                ... on Commit {
                    committedDate
                }
            }
        }
        url
        diskUsage
    }`};
};
