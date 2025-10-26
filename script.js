// ---- SPA Routing & Initialization ----
window.addEventListener("DOMContentLoaded", () => {
  const spaRoot = document.getElementById("spa-root");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const links = document.querySelectorAll(".sidebar-link");

  // Sidebar Toggle
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Keyboard shortcuts for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "[" || e.key === "]") sidebar.classList.toggle("collapsed");
  });

  // Routing system
  function navigate(route) {
    links.forEach(l => l.classList.remove("active"));
    const activeLink = document.querySelector(`[data-route="${route}"]`);
    if (activeLink) activeLink.classList.add("active");

    if (route === "landing") renderLanding();
    else if (route === "explorer") renderDatasetExplorer();
    else if (route === "training") renderTrainingDashboard();
    else if (route === "inference") renderInferenceDemo();
    else if (route === "job") renderFalconJobCreator();
    else if (route === "checklist") renderChecklist();
  }

  // Hash routing
  window.addEventListener("hashchange", () => {
    const route = location.hash.replace("#/", "") || "landing";
    navigate(route);
  });

  navigate(location.hash.replace("#/", "") || "landing");

  // ---- Modal Logic ----
  const modal = document.getElementById("modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const modalContent = document.getElementById("modal-content");

  function openModal(html, title) {
    modalContent.innerHTML = `<h2 id="modal-title">${title}</h2>` + html;
    modal.classList.remove("hidden");
    modalBackdrop.classList.remove("hidden");
  }
  function closeModal() {
    modal.classList.add("hidden");
    modalBackdrop.classList.add("hidden");
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ---- Routes ----
  function renderLanding() {
    spaRoot.innerHTML = `
      <h1>🚀 Duality AI — Space Station Challenge</h1>
      <p>Welcome to the <b>Safety Object Detection #2</b> interface. Explore datasets, simulate training, and submit your Falcon jobs.</p>
      <div class="card-grid">
        <div class="dataset-card" tabindex="0" onclick="location.hash='#/explorer'">
          <img src="sample1.jpg" class="dataset-thumb" alt="Dataset Explorer"/>
          <div class="dataset-meta">Explore the dataset samples.</div>
        </div>
        <div class="dataset-card" tabindex="0" onclick="location.hash='#/training'">
          <img src="sample2.jpg" class="dataset-thumb" alt="Training Dashboard"/>
          <div class="dataset-meta">Monitor and simulate your model training.</div>
        </div>
      </div>
      <p>Use the sidebar or <kbd>[</kbd> / <kbd>]</kbd> to toggle navigation.</p>
    `;
  }

  function renderDatasetExplorer() {
    spaRoot.innerHTML = `
      <h1>🗂 Dataset Explorer</h1>
      <p>View and inspect annotated samples.</p>
      <div class="card-grid">
        <div class="dataset-card" tabindex="0">
          <img src="sample1.jpg" class="dataset-thumb" alt="Sample Image">
          <div class="dataset-meta">sample1.jpg — 2 labels</div>
        </div>
      </div>
    `;
  }

  function renderTrainingDashboard() {
    spaRoot.innerHTML = `
      <h1>📈 Training Dashboard</h1>
      <p>Visualize fake training metrics.</p>
      <div class="progress-bar"><div class="progress-bar-inner" id="prog"></div></div>
      <p>Simulating training...</p>
    `;
    const bar = document.getElementById("prog");
    let w = 0;
    const timer = setInterval(() => {
      w += 5;
      bar.style.width = w + "%";
      if (w >= 100) clearInterval(timer);
    }, 200);
  }

  function renderInferenceDemo() {
  spaRoot.innerHTML = `
    <h1>🤖 Inference Demo</h1>
    <p>Upload an image to run YOLO detection.</p>
    <input type="file" id="inf-file" accept="image/*" />
    <div id="result"></div>
  `;

  const input = document.getElementById("inf-file");
  const resultDiv = document.getElementById("result");

  input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    resultDiv.innerHTML = "⏳ Processing...";

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: formData
    });

    const blob = await response.blob();
    const imgURL = URL.createObjectURL(blob);
    resultDiv.innerHTML = `<img src="${imgURL}" class="dataset-thumb" alt="Result">`;
  });
}


  function renderFalconJobCreator() {
    spaRoot.innerHTML = `
      <h1>🛰 Falcon Job Creator</h1>
      <p>Create and download a Falcon job config JSON.</p>
      <form id="jobForm">
        <label>Target Class</label>
        <input type="text" name="target" placeholder="helmet" required />
        <label>Lighting</label>
        <select name="lighting">
          <option>random</option>
          <option>bright</option>
          <option>dim</option>
        </select>
        <label>Frame Count</label>
        <input type="number" name="frames" min="10" max="200" value="40" />
        <input type="submit" value="Generate JSON" />
      </form>
    `;
    document.getElementById("jobForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "falcon_job.json";
      a.click();
    });
  }

  function renderChecklist() {
    spaRoot.innerHTML = `
      <h1>✅ Submission Checklist</h1>
      <ul>
        <li>✔ Dataset explored and verified</li>
        <li>✔ Model trained and metrics recorded</li>
        <li>✔ Inference tested successfully</li>
        <li>✔ Falcon Job JSON ready for submission</li>
      </ul>
      <p><b>All systems go!</b> 🛰</p>
    `;
  }
});
