// main.ts
export function initPortfolio() {
    console.log("Portfolio Initialized");
}
// Immediately initialize the portfolio on load
initPortfolio();
async function loadProjects() {
    const response = await fetch("/api/projects");
    const projects = await response.json();
    const container = document.getElementById("projects");
    if (!container)
        return;
    const list = document.createElement("ul");
    for (const project of projects) {
        const item = document.createElement("li");
        item.innerText = `${project.title}: ${project.description}`;
        list.appendChild(item);
    }
    container.appendChild(list);
}
loadProjects();
