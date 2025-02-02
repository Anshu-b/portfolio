console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );

// if (currentLink) {
//     // or if (currentLink !== undefined)
//     currentLink.classList.add('current');
//   }

let pages = [
    { url: '/index.html', title: 'Home' },
    { url: '/projects/index.html', title: 'Projects' },
    { url: '/contact/index.html', title: 'Contact' },
    { url: '/resume/index.html', title: 'Resume' },
    { url: 'https://github.com/Anshu-b', title: 'GitHub' },
  ];


let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    // TODO create link and add it to nav
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '/portfolio' + url;
      }

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    nav.append(a);

    a.classList.toggle('current', a.host === location.host && a.pathname === location.pathname);
    
    //nav.append(document.createElemeeent('br'));

    if (a.host != location.host) {
        a.target = '_blank';
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select id="color-scheme-selector">
              <option value="light dark">Automatic</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
          </select>
      </label>`
  );

  const select = document.querySelector('#color-scheme-selector');

if (localStorage.colorScheme) {
    select.value = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}

  select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
  });

  export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data; 


    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  const projectsTitleElement = document.querySelector('.projects-title');
  if (project.length === 0) {
      // Display a placeholder message if there are no projects
      const placeholderMessage = document.createElement('p');
      placeholderMessage.textContent = 'No projects available at the moment.';
      containerElement.appendChild(placeholderMessage);
      projectsTitleElement.textContent = '0 Projects';
  } else {
      project.forEach(proj => {
          const article = document.createElement('article');
          article.innerHTML = `
              <${headingLevel}>${proj.title}</${headingLevel}>
              <img src="${proj.image}" alt="${proj.title}">
              <p>${proj.description}</p>
          `;

          containerElement.appendChild(article);
      });
      projectsTitleElement.textContent = `${project.length} Projects`;
  }
}