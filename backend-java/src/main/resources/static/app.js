async function getJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function renderRows(list){
  const tbody = document.getElementById("rows");
  tbody.innerHTML = "";
  for (const x of list) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${x.id}</td><td>${x.name}</td><td>${x.quantity}</td>`;
    tbody.appendChild(tr);
  }
}

async function loadAll(){
  try {
    const [ver, health, resources] = await Promise.all([
      getJSON("/version"),
      getJSON("/health"),
      getJSON("/resources")
    ]);
    document.getElementById("version").textContent = `v${ver.version}`;
    document.getElementById("health").textContent = health.status === "ok" ? "? healthy" : "? not ok";
    renderRows(resources);
  } catch (e) {
    console.error(e);
    alert("Failed to load initial data");
  }
}

document.getElementById("createForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const qty  = parseInt(document.getElementById("qty").value, 10);
  if (!name || Number.isNaN(qty) || qty < 0) return;

  const r = await fetch("/resources", {
    method:"POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ name, quantity: qty })
  });

  if (!r.ok) {
    const msg = await r.text();
    alert("Create failed: " + msg);
    return;
  }
  document.getElementById("name").value = "";
  document.getElementById("qty").value = "";
  await loadAll();
});

loadAll();
