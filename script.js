// Order button
document.getElementById('orderBtn').addEventListener('click', function() {
    const quantities = document.querySelectorAll('.quantity');
    let receiptHTML = '';
    let total = 0;

    receiptHTML += "<hr>";

    // Loop through items para sa resibo at total
    quantities.forEach(q => {
        const qty = parseInt(q.value);
        const price = parseFloat(q.dataset.price);
        const name = q.parentElement.querySelector("h3").innerText;

        if (qty > 0) {
            const subtotal = qty * price;
            total += subtotal;
            receiptHTML += `<p>${name}<br>₱${price} x ${qty} = ₱${subtotal.toFixed(2)}</p><hr>`;
        }
    });

    if (total === 0) receiptHTML = "<p>Walang inorder.</p>";

    // Display resibo at total
    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('totalAmount').innerHTML = `<strong>Total: ₱${total.toFixed(2)}</strong>`;

    // Hide menu and order button
    document.querySelector('.menu-grid').style.display = 'none';
    document.getElementById('orderBtn').style.display = 'none';

    // --- Auto-fill email form ---
    let orderText = '';
    quantities.forEach(q => {
        const qty = parseInt(q.value);
        const name = q.parentElement.querySelector("h3").innerText;
        if (qty > 0) orderText += `${qty} x ${name}, `;
    });
    orderText = orderText.slice(0, -2); // remove last comma
    document.getElementById('order').value = orderText;
});

// Pay button - calculate change/sukli
document.getElementById('payBtn').addEventListener('click', function() {
    const totalText = document.getElementById('totalAmount').innerText;
    const total = parseFloat(totalText.replace('Total: ₱','')) || 0;
    const bayad = parseFloat(document.getElementById('bayad').value);

    if (isNaN(bayad) || bayad < total) {
        document.getElementById('sukli').innerText = "Kulangan ang bayad!";
    } else {
        document.getElementById('sukli').innerText = `Sukli: ₱${(bayad - total).toFixed(2)}`;
    }
});

// New Order button - reset everything
document.getElementById('newOrderBtn').addEventListener('click', function() {
    const quantities = document.querySelectorAll('.quantity');
    quantities.forEach(q => q.value = 0);

    document.getElementById('receiptContent').innerHTML = '';
    document.getElementById('totalAmount').innerText = '';
    document.getElementById('bayad').value = 0;
    document.getElementById('sukli').innerText = '';

    document.querySelector('.menu-grid').style.display = 'grid';
    document.getElementById('orderBtn').style.display = 'block';

    // Clear email form order field
    document.getElementById('order').value = '';
});
