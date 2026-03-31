const input = document.getElementById("jsonInput");
const output = document.getElementById("output");
const errorDiv = document.getElementById("error");
const button = document.getElementById("visualizeBtn");

button.addEventListener("click", visualizeJSON);

function visualizeJSON() {
  output.innerHTML = "";
  errorDiv.textContent = "";

  try {
    const data = JSON.parse(input.value);
    const tree = document.createElement("div");
    tree.className = "tree";

    // Start rendering top-level nodes
    if (typeof data === "object" && data !== null) {
      Object.keys(data).forEach(key => {
        tree.appendChild(renderNode(key, data[key]));
      });
    }

    output.appendChild(tree);
  } catch (err) {
    errorDiv.textContent = "Invalid JSON";
  }
}

// Render a single key-value node
function renderNode(key, value) {
  const node = document.createElement("div");
  node.className = "node";

  const toggle = document.createElement("span");
  toggle.className = "toggle";
  toggle.textContent = "▶";

  const keySpan = document.createElement("span");
  keySpan.className = "key";
  keySpan.textContent = key;

  node.appendChild(toggle);
  node.appendChild(keySpan);

  const container = document.createElement("div");
  container.style.display = "none";
  container.style.marginTop = "5px";

  if (typeof value === "object" && value !== null) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    // Determine table headers
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        Object.keys(value[0]).forEach(h => {
          const th = document.createElement("th");
          th.textContent = h;
          trHead.appendChild(th);
        });
      } else {
        ["Index", "Value"].forEach(h => {
          const th = document.createElement("th");
          th.textContent = h;
          trHead.appendChild(th);
        });
      }
    } else {
      Object.keys(value).forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        trHead.appendChild(th);
      });
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Fill table rows
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        const tr = document.createElement("tr");
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach(k => {
            const td = document.createElement("td");
            if (typeof item[k] === "object" && item[k] !== null) {
              td.textContent = JSON.stringify(item[k]);
            } else {
              td.textContent = item[k];
            }
            tr.appendChild(td);
          });
        } else {
          const tdIndex = document.createElement("td");
          tdIndex.textContent = idx;
          const tdVal = document.createElement("td");
          tdVal.textContent = item;
          tr.appendChild(tdIndex);
          tr.appendChild(tdVal);
        }
        tbody.appendChild(tr);
      });
    } else {
      const tr = document.createElement("tr");
      Object.keys(value).forEach(k => {
        const td = document.createElement("td");
        if (typeof value[k] === "object" && value[k] !== null) {
          td.textContent = JSON.stringify(value[k]);
        } else {
          td.textContent = value[k];
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
  } else {
    // Primitive value → show directly
    const valSpan = document.createElement("span");
    valSpan.className = typeof value;
    valSpan.textContent = value;
    container.appendChild(valSpan);
  }

  toggle.onclick = () => {
    const hidden = container.style.display === "none";
    container.style.display = hidden ? "block" : "none";
    toggle.textContent = hidden ? "▼" : "▶";
  };

  node.appendChild(container);
  return node;
}