import {fetchJSON, renderProjects, fetchGitHubData} from '/portfolio/global.js';

const projects = await fetchJSON('/portfolio/lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('Anshu-b');
const profileStats = document.querySelector('.profile-stats');
console.log('Profile stats container:', profileStats);
if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repositories:</dt><dd>${githubData.public_repos}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
          </dl>
      `;
  } else {
    console.error('Profile stats container not found');
}