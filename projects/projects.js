
import { fetchJSON, renderProjects } from '/portfolio/global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('/portfolio/lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);
let angle = 0;
let arcData = [];
let total = 0;
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let sliceGenerator = d3.pie().value((d) => d.value);
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

// New pie chart creation
let g = d3.select('svg')
    .append('g')

arcData = sliceGenerator(data);

g.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => colors(i));

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .attr('class', "legend-li")
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
})

renderPieChart(projects);

function renderPieChart(projectsGiven) {
    d3.select('svg').selectAll('*').remove();
    d3.select('.legend').selectAll('*').remove();
    
    // Step 1: Recalculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year
    );
  
    // Step 2: Recalculate data
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
  
    // Step 3: Recalculate slice generator and arc data
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
  
    // Step 4: Clear up previous paths and legends
    d3.select('svg g').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();
  
    // Step 5: Update paths
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
    let g = d3.select('svg')
      .append('g')
  
    g.selectAll('path')
      .data(newArcData)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d, i) => colors(i));
  
    // Step 6: Update legends
    let legend = d3.select('.legend');
  
    newData.forEach((d, idx) => {
      legend.append('li')
        .attr('style', `--color:${colors(idx)}`) // Set the style attribute with color
        .attr('class', 'legend-li')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // Set inner HTML of <li>
    });
  }
  
  // Call this function on page load
  renderPieChart(projects);
  
  
  // Render initial pie chart
  renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  // Update query value
  query = event.target.value;
  
  // Filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  
  // Re-render both visualizations
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

let selectedIndex = -1;
let svg = d3.select('svg');
svg.selectAll('path').remove();

// arcs needs to be defined before using it
const arcs = sliceGenerator(data); // Make sure data and sliceGenerator are defined above

arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arcGenerator(arc)) // Need to use arcGenerator to create the path
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg
        .selectAll('path')
        .attr('class', (_, idx) => 
          idx === selectedIndex ? 'selected' : '' // Fixed the class assignment
        );

      // Moved the filtering logic outside of the class assignment
      if (selectedIndex === -1) {
        renderProjects(projects, projectsContainer, 'h2');
      } else {
        let selectedYear = data[selectedIndex].label;
        let filteredProjects = projects.filter(
          (project) => project.year === selectedYear
        );
        renderProjects(filteredProjects, projectsContainer, 'h2');
      }
    });
});