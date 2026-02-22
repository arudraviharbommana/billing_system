// ===============================
// GLOBAL VARIABLES
// ===============================

let bills = {};
let paidBills = {};
let activeBillId = null;
let billCounter = 1;


// ===============================
// CREATE BILL
// ===============================

function createBill(type) {

  activeBillId = billCounter++;

  bills[activeBillId] = {
    type: type,
    items: [],
    total: 0,
    createdAt: new Date()
  };

  document.getElementById("activeBill").innerText =
    `Active Bill: ${activeBillId} (${type.toUpperCase()})`;

  document.getElementById("billItems").innerHTML = "";
  document.getElementById("total").innerText = "0";

  renderRunningBills();
  loadDashboard();
}


// ===============================
// ADD ITEM
// ===============================

function addItem(name, price) {

  if (!activeBillId) {
    alert("Create a bill first!");
    return;
  }

  bills[activeBillId].items.push({
    name: name,
    price: price
  });

  bills[activeBillId].total += price;

  showActiveBill();
  renderRunningBills();
  loadDashboard();
}


// ===============================
// SHOW ACTIVE BILL
// ===============================

function showActiveBill() {

  const bill = bills[activeBillId];
  const billItemsDiv = document.getElementById("billItems");
  billItemsDiv.innerHTML = "";

  bill.items.forEach(item => {
    const p = document.createElement("p");
    p.innerText = `${item.name} – ₹${item.price}`;
    billItemsDiv.appendChild(p);
  });

  document.getElementById("total").innerText = bill.total;
}


// ===============================
// RENDER RUNNING BILLS
// ===============================

function renderRunningBills() {

  const container = document.getElementById("runningBills");
  container.innerHTML = "";

  for (let id in bills) {

    const bill = bills[id];

    const card = document.createElement("div");
    card.className = "bill-card";

    const header = document.createElement("div");
    header.className = "bill-header";
    header.innerHTML = `
      <span>Bill ${id}</span>
      <span>₹${bill.total}</span>
    `;

    const content = document.createElement("div");
    content.className = "bill-content";

    header.onclick = function () {
      content.classList.toggle("active");
    };

    bill.items.forEach(item => {
      const p = document.createElement("p");
      p.innerText = `${item.name} – ₹${item.price}`;
      content.appendChild(p);
    });

    const printBtn = document.createElement("button");
    printBtn.innerText = "Print Bill";
    printBtn.onclick = function () {
      printBill(id);
    };

    content.appendChild(printBtn);

    card.appendChild(header);
    card.appendChild(content);
    container.appendChild(card);
  }
}


// ===============================
// RENDER PAID BILLS
// ===============================

function renderPaidBills() {

  const container = document.getElementById("paidBills");
  container.innerHTML = "";

  for (let id in paidBills) {

    const bill = paidBills[id];

    const card = document.createElement("div");
    card.className = "bill-card";

    const header = document.createElement("div");
    header.className = "bill-header";
    header.innerHTML = `
      <span>Bill ${id}</span>
      <span>₹${bill.total}</span>
    `;

    card.appendChild(header);
    container.appendChild(card);
  }
}


// ===============================
// PRINT BILL + MOVE TO PAID
// ===============================

function printBill(billId) {

  const bill = bills[billId];
  if (!bill) return;

  let content = `
  <html>
  <head>
  <title>Bill</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    h2 { text-align: center; }
    table { width:100%; border-collapse: collapse; margin-top:15px; }
    th, td { border-bottom:1px solid #ccc; padding:6px; }
    .total { text-align:right; font-weight:bold; margin-top:10px; }
  </style>
  </head>
  <body>

  <h2>Restaurant Bill</h2>
  <p><strong>Bill No:</strong> ${billId}</p>

  <table>
  <tr><th>Item</th><th>Price</th></tr>
  `;

  bill.items.forEach(item => {
    content += `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
      </tr>
    `;
  });

  content += `
  </table>

  <div class="total">Total: ₹${bill.total}</div>

  </body>
  </html>
  `;

  const win = window.open("", "", "width=400,height=600");
  win.document.write(content);
  win.document.close();
  win.print();

  // Move to paid bills
  paidBills[billId] = bill;
  delete bills[billId];

  if (activeBillId == billId) {
    activeBillId = null;
    document.getElementById("activeBill").innerText = "No Active Bill";
    document.getElementById("billItems").innerHTML = "";
    document.getElementById("total").innerText = "0";
  }

  renderRunningBills();
  renderPaidBills();
  loadDashboard();
}


// ===============================
// SEARCH RUNNING BILLS
// ===============================

function searchBills() {

  const input = document.getElementById("billSearch").value.toLowerCase();
  const cards = document.querySelectorAll("#runningBills .bill-card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(input) ? "block" : "none";
  });
}


// ===============================
// DASHBOARD (FRONTEND CALCULATED)
// ===============================

function loadDashboard() {

  let todayRevenue = 0;
  let todayCount = 0;
  let totalRevenue = 0;

  const today = new Date().toDateString();

  for (let id in paidBills) {

    const bill = paidBills[id];
    totalRevenue += bill.total;

    if (new Date(bill.createdAt).toDateString() === today) {
      todayRevenue += bill.total;
      todayCount++;
    }
  }

  document.getElementById("todayRevenue").innerText = "₹" + todayRevenue;
  document.getElementById("todayCount").innerText = todayCount;
  document.getElementById("totalRevenue").innerText = "₹" + totalRevenue;
  document.getElementById("runningCount").innerText =
    Object.keys(bills).length;
}


// ===============================
// INITIAL LOAD
// ===============================

window.onload = function() {
  renderRunningBills();
  renderPaidBills();
  loadDashboard();
};