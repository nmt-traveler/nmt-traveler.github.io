/* ============================================================
   ✏️ YOUR INFO — this is the only part you need to edit
   ============================================================ */
const CONFIG = {
  // Your GitHub username. Leave it "" if you don't have one yet —
  // the page will then use the sample projects below.
  githubUsername: "Tuan Nguyen Manh",

  name: "Tuan Nguyen",
  username: "tuan-dev",
  // Path or URL to your photo, e.g. "avatar.jpg".
  // Leave it "" to show a generated avatar with your initials.
  avatar: "",
  bio: "Learning web development 🚀 Curious about how things work.",
  followLink: "https://github.com/",

  info: [
    "📍 Vietnam",
    "🏢 Student / Developer",
    "✉️ email@example.com",
  ],

  skills: ["HTML", "CSS", "JavaScript", "Git"],

  // README content (written in HTML)
  readme: `
    <h3>Hi there 👋</h3>
    <p>I'm Tuan, on my way to becoming a web developer.</p>
    <ul>
      <li>🔭 Working on: this personal website</li>
      <li>🌱 Learning: JavaScript, Git</li>
      <li>⚡ Hobbies: coding, reading, gaming</li>
    </ul>
  `,

  // Sample projects (used when githubUsername is empty or the request fails)
  projects: [
    { name: "my-website",  description: "Personal website with a Git-inspired look", language: "HTML",       stars: 5, url: "#", updated: "2026-11-14" },
    { name: "todo-app",    description: "A simple to-do list app",        language: "JavaScript", stars: 3, url: "#", updated: "2026-10-02" },
    { name: "weather-app", description: "Weather forecast using a public API",           language: "JavaScript", stars: 2, url: "#", updated: "2026-08-20" },
    { name: "learn-css",   description: "My notes on CSS Flexbox & Grid",   language: "CSS",        stars: 1, url: "#", updated: "2026-06-11" },
  ],

  // Your journey, written as commit messages
  timeline: [
    { type: "feat",  msg: "launch personal website",      date: "11/2026" },
    { type: "feat",  msg: "finish todo-app project",     date: "10/2026" },
    { type: "learn", msg: "start learning JavaScript",        date: "07/2026" },
    { type: "init",  msg: "write my first line of HTML",  date: "05/2026" },
  ],
};

/* ============================================================
   LOGIC BELOW — no need to edit unless you want to
   ============================================================ */

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#563d7c",
  Python: "#3572A5", Java: "#b07219", "C++": "#f34b7d", C: "#555555",
  PHP: "#4F5D95", Go: "#00ADD8", Vue: "#41b883", Dart: "#00B4AB",
};

const $ = (id) => document.getElementById(id);

// Escape text from the API so it can't inject HTML
function escapeHTML(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ---------- 1. Profile ---------- */
// Build a simple SVG avatar from the first letters of your name
function initialsAvatar(name) {
  const initials = name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#2da44e"/>
    <text x="50" y="50" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif"
          font-size="40" font-weight="bold" fill="#fff">${escapeHTML(initials)}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function renderProfile() {
  $("topbar-user").textContent = CONFIG.username;
  $("avatar").src = CONFIG.avatar || initialsAvatar(CONFIG.name);
  $("name").textContent = CONFIG.name;
  $("username").textContent = CONFIG.username;
  $("bio").textContent = CONFIG.bio;
  $("btn-follow").href = CONFIG.followLink;
  $("readme").innerHTML = CONFIG.readme;
  $("info").innerHTML = CONFIG.info.map((i) => `<li>${escapeHTML(i)}</li>`).join("");
  $("skills").innerHTML = CONFIG.skills.map((s) => `<span class="skill">${escapeHTML(s)}</span>`).join("");
  document.title = `${CONFIG.name} (${CONFIG.username})`;
}

/* ---------- 2. Repositories ---------- */
function langHTML(lang) {
  if (!lang) return "";
  const color = LANG_COLORS[lang] || "#8b949e";
  return `<span><span class="lang-dot" style="background:${color}"></span>${escapeHTML(lang)}</span>`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

let allProjects = [];

function renderPinned(projects) {
  const top = [...projects].sort((a, b) => b.stars - a.stars).slice(0, 4);
  $("pinned").innerHTML = top.map((p) => `
    <div class="card">
      <a class="card-title" href="${escapeHTML(p.url)}" target="_blank">📦 ${escapeHTML(p.name)}</a>
      <p class="card-desc">${escapeHTML(p.description || "No description")}</p>
      <div class="meta">${langHTML(p.language)}<span>⭐ ${p.stars}</span></div>
    </div>
  `).join("");
}

function renderRepoList(projects) {
  $("repo-list").innerHTML = projects.length
    ? projects.map((p) => `
      <li>
        <a class="card-title" href="${escapeHTML(p.url)}" target="_blank">${escapeHTML(p.name)}</a>
        <span class="badge">Public</span>
        <p class="card-desc">${escapeHTML(p.description || "No description")}</p>
        <div class="meta">
          ${langHTML(p.language)}
          <span>⭐ ${p.stars}</span>
          <span>Updated ${formatDate(p.updated)}</span>
        </div>
      </li>`).join("")
    : `<li>No repositories found.</li>`;
}

async function loadProjects() {
  let projects = CONFIG.projects;

  if (CONFIG.githubUsername) {
    try {
      const res = await fetch(`https://api.github.com/users/${CONFIG.githubUsername}/repos?sort=updated&per_page=100`);
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      projects = data
        .filter((r) => !r.fork)
        .map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          url: r.html_url,
          updated: r.updated_at,
        }));
    } catch (err) {
      console.warn("Could not load GitHub data, using sample projects.", err);
    }
  }

  allProjects = projects;
  $("repo-count").textContent = projects.length;
  renderPinned(projects);
  renderRepoList(projects);
}

$("search").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  renderRepoList(allProjects.filter((p) =>
    p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
  ));
});

/* ---------- 3. Activity graph (green squares) ----------
   Currently random demo data. You can later replace
   it with real data (GitHub GraphQL API).          */
function renderContributions() {
  const grid = $("contrib-grid");
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364 - start.getDay()); // start on a Sunday

  let total = 0;
  const cells = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const r = Math.random();
    const count = r < 0.45 ? 0 : r < 0.7 ? 1 + Math.floor(Math.random() * 2)
                : r < 0.88 ? 3 + Math.floor(Math.random() * 3) : 6 + Math.floor(Math.random() * 6);
    total += count;
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4;
    const label = `${count} contributions on ${d.toLocaleDateString("en-US")}`;
    cells.push(`<span class="cell l${level}" title="${label}"></span>`);
  }
  grid.innerHTML = cells.join("");
  $("contrib-title").textContent = `${total} contributions in the last year`;
}

/* ---------- 4. Commit-style journey ---------- */
function randomHash() {
  return Math.random().toString(16).slice(2, 9);
}

function renderTimeline() {
  $("commits").innerHTML = CONFIG.timeline.map((c) => `
    <li>
      <div class="commit-msg">
        <span class="commit-type">${escapeHTML(c.type)}:</span> ${escapeHTML(c.msg)}
        <span class="commit-hash">${randomHash()}</span>
      </div>
      <div class="commit-date">${escapeHTML(c.date)}</div>
    </li>
  `).join("");
}

/* ---------- 5. Tab switching ---------- */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    $(`tab-${tab.dataset.tab}`).classList.add("active");
  });
});

/* ---------- 6. Dark mode (remembers your choice) ---------- */
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  $("theme-btn").textContent = dark ? "☀️" : "🌙";
  try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
}

$("theme-btn").addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"));
});

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
setTheme(savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);

/* ---------- Run ---------- */
renderProfile();
loadProjects();
renderContributions();
renderTimeline();
