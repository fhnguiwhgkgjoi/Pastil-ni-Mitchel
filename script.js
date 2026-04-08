// Order / receipt system
document.getElementById('orderBtn').addEventListener('click', function() {
    const quantities = document.querySelectorAll('.quantity');
    let receiptHTML = '';
    let total = 0;

    receiptHTML += "<hr>";

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

    if (total === 0) {
        receiptHTML = "<p>Walang inorder.</p>";
    }

    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('totalAmount').innerHTML = `<strong>Total: ₱${total.toFixed(2)}</strong>`;

    document.querySelector('.menu-grid').style.display = 'none';
    document.getElementById('orderBtn').style.display = 'none';
});

// Pay button
document.getElementById('payBtn').addEventListener('click', function() {
    const totalText = document.getElementById('totalAmount').innerText;
    const total = parseFloat(totalText.replace('Total: ₱',''));
    const bayad = parseFloat(document.getElementById('bayad').value);

    if (isNaN(bayad) || bayad < total) {
        document.getElementById('sukli').innerText = "Kulangan ang bayad!";
    } else {
        const sukli = bayad - total;
        document.getElementById('sukli').innerText = `Sukli: ₱${sukli.toFixed(2)}`;
    }
});

// New Order button
document.getElementById('newOrderBtn').addEventListener('click', function() {
    document.querySelectorAll('.quantity').forEach(q => q.value = 0);
    document.getElementById('receiptContent').innerHTML = '';
    document.getElementById('totalAmount').innerText = '';
    document.getElementById('bayad').value = 0;
    document.getElementById('sukli').innerText = '';

    document.querySelector('.menu-grid').style.display = 'grid';
    document.getElementById('orderBtn').style.display = 'block';
});

// Formspree email submission
const formEmail = document.getElementById("orderFormEmail");
formEmail.addEventListener("submit", function(e){
    e.preventDefault();
    fetch(formEmail.action, {
        method: formEmail.method,
        body: new FormData(formEmail),
        headers: {'Accept': 'application/json'}
    }).then(response => {
        if(response.ok){
            alert("Salamat! Natanggap na ang iyong order via email.");
            formEmail.reset();
        } else {
            alert("May error, subukan ulit.");
        }
    }).catch(error => {
        alert("May error, subukan ulit.");
        console.error(error);
    });
});
