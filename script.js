const MENU = [
  { name: 'Pater', price: 25},
  { name: 'Pater at 3 Siomai', price: 40},
  { name: 'Pater at Hotdog', price: 40,},
  { name: 'Pater with Chicken Skin', price: 35},
  { name: 'Chicken Skin with Rice', price: 30},
  { name: 'Pater at Egg', price: 40},
  { name: 'Siomai', price: 5},
  { name: 'Lutong Hotdog', price: 15},
  { name: 'Lutong Itlog', price: 15},
  { name: 'Kanin', price: 10},
];

let quantities = new Array(MENU.length).fill(0);

function buildMenu() {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = MENU.map((item, i) => `
    <div class="menu-card">
      <div class="card-img"><span style="font-size:42px;">${item.emoji}</span></div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-price">₱${item.price}</div>
        <div class="qty-row">
          <button class="qty-btn minus" onclick="changeQty(${i}, -1)">−</button>
          <div class="qty-val" id="qty-${i}">0</div>
          <button class="qty-btn plus" onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function changeQty(i, delta) {
  quantities[i] = Math.max(0, quantities[i] + delta);
  document.getElementById('qty-' + i).textContent = quantities[i];
  updateCartBtn();
  updateReceipt();
}

function updateCartBtn() {
  const total = quantities.reduce((a, b) => a + b, 0);
  const btn = document.getElementById('cartBtn');
  document.getElementById('cartBadge').textContent = total;
  btn.style.display = total > 0 ? 'flex' : 'none';
}

function updateReceipt() {
  const lines = [];
  let total = 0;
  quantities.forEach((qty, i) => {
    if (qty > 0) {
      const sub = qty * MENU[i].price;
      total += sub;
      lines.push({ name: MENU[i].name, price: MENU[i].price, qty, sub });
    }
  });

  const empty = document.getElementById('emptyOrder');
  const wrap = document.getElementById('receiptWrap');

  if (lines.length === 0) {
    empty.style.display = 'block';
    wrap.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  wrap.style.display = 'block';

  const now = new Date();
  document.getElementById('receiptTime').textContent =
    now.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
    now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });

  document.getElementById('receiptLines').innerHTML = lines.map(l => `
    <div class="receipt-line">
      <div>
        <div class="receipt-item-name">${l.name}</div>
        <div class="receipt-item-sub">₱${l.price} × ${l.qty}</div>
      </div>
      <div class="receipt-item-price">₱${l.sub.toFixed(2)}</div>
    </div>
  `).join('');

  document.getElementById('receiptTotal').textContent = '₱' + total.toFixed(2);
  document.getElementById('bayadInput').value = '';
  document.getElementById('changeDisplay').className = 'change-display';
}

function computeChange() {
  const totalText = document.getElementById('receiptTotal').textContent;
  const total = parseFloat(totalText.replace('₱', ''));
  const bayad = parseFloat(document.getElementById('bayadInput').value);
  const disp = document.getElementById('changeDisplay');
  const lbl = document.getElementById('changeLabel');
  const amt = document.getElementById('changeAmount');

  if (isNaN(bayad) || bayad <= 0) {
    disp.className = 'change-display change-error show';
    lbl.textContent = 'Error';
    amt.textContent = 'Maglagay ng bayad';
    return;
  }
  if (bayad < total) {
    disp.className = 'change-display change-error show';
    lbl.textContent = 'Kulang ng';
    amt.textContent = '₱' + (total - bayad).toFixed(2);
    return;
  }
  disp.className = 'change-display show';
  lbl.textContent = 'Sukli';
  amt.textContent = '₱' + (bayad - total).toFixed(2);
}

function resetOrder() {
  quantities = new Array(MENU.length).fill(0);
  MENU.forEach((_, i) => {
    const el = document.getElementById('qty-' + i);
    if (el) el.textContent = '0';
  });
  updateCartBtn();
  updateReceipt();
  switchTab('menu');
}

function switchTab(tab) {
  ['menu', 'order', 'email'].forEach((t, idx) => {
    document.getElementById('tab-' + t).classList.toggle('visible', t === tab);
    document.querySelectorAll('.tab')[idx].classList.toggle('active', t === tab);
  });
}

function showToast(msg, success = true) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = success ? '#27ae60' : '#c0392b';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

async function submitOrder() {
  const name = document.getElementById('eName').value.trim();
  const order = document.getElementById('eOrder').value.trim();
  const address = document.getElementById('eAddress').value.trim();
  if (!name || !order || !address) { showToast('Punan ang lahat ng fields!', false); return; }

  try {
    const res = await fetch('https://formspree.io/f/xdapjjlv', {
      method: 'POST',
      body: JSON.stringify({ name, order, address }),
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      showToast('Salamat! Natanggap na ang inyong order!');
      document.getElementById('eName').value = '';
      document.getElementById('eOrder').value = '';
      document.getElementById('eAddress').value = '';
    } else {
      showToast('May error. Subukan ulit.', false);
    }
  } catch (e) {
    showToast('May error. Subukan ulit.', false);
  }
}

buildMenu();
