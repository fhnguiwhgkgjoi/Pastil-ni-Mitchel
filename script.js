// Order / receipt system
document.getElementById('orderBtn').addEventListener('click', function() {
    const quantities = document.querySelectorAll('.quantity');
    let receiptHTML = '';
    let total = 0;
    let orderDetails = '';

    quantities.forEach(q => {
        const qty = parseInt(q.value);
        const price = parseFloat(q.dataset.price);
        const name = q.parentElement.querySelector("h3").innerText;

        if (qty > 0) {
            const subtotal = qty * price;
            total += subtotal;

            receiptHTML += `<p><span>${name}</span><span>₱${price} x ${qty} = ₱${subtotal.toFixed(2)}</span></p>`;
            
            // Add to order details string
            if (orderDetails) {
                orderDetails += ', ';
            }
            orderDetails += `${qty} ${name}`;
        }
    });

    if (total === 0) {
        receiptHTML = "<p>No items ordered yet.</p>";
        orderDetails = '';
    }

    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('totalAmount').innerHTML = `Total: ₱${total.toFixed(2)}`;
    document.getElementById('bayad').value = 0;
    document.getElementById('sukli').innerText = '';
    
    // Auto-populate order details in the form
    document.getElementById('order').value = orderDetails;

    document.querySelector('.menu-section').style.display = 'none';
    document.getElementById('orderBtn').style.display = 'none';
    document.getElementById('receipt').classList.add('show');
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

    document.querySelector('.menu-section').style.display = 'block';
    document.getElementById('orderBtn').style.display = 'block';
    document.getElementById('receipt').classList.remove('show');
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
