// ================================
// 📋 REVIEW ORDER / GENERATE RECEIPT
// ================================
document.getElementById('orderBtn').addEventListener('click', function () {
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

            receiptHTML += `
                <p>
                    <span>${name}</span>
                    <span>₱${price} x ${qty} = ₱${subtotal.toFixed(2)}</span>
                </p>
            `;

            // build order string
            if (orderDetails !== '') {
                orderDetails += ', ';
            }
            orderDetails += `${qty} ${name}`;
        }
    });

    // kapag walang order
    if (total === 0) {
        receiptHTML = "<p>No items ordered yet.</p>";
        orderDetails = '';
    }

    // display receipt
    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('totalAmount').innerText = `Total: ₱${total.toFixed(2)}`;
    document.getElementById('bayad').value = 0;
    document.getElementById('sukli').innerText = '';

    // auto-fill email form
    if (orderDetails !== '') {
        document.getElementById('order').value =
            orderDetails + " | Total: ₱" + total.toFixed(2);
    } else {
        document.getElementById('order').value = '';
    }

    // show receipt, hide menu
    document.querySelector('.menu-section').style.display = 'none';
    document.getElementById('orderBtn').style.display = 'none';
    document.getElementById('receipt').classList.add('show');
    document.getElementById('emailFormSection').classList.add('show');
    document.getElementById('thankYouSection').classList.remove('show');
});


// ================================
// 💳 CALCULATE CHANGE
// ================================
let currentSukli = 0;

document.getElementById('payBtn').addEventListener('click', function () {
    const totalText = document.getElementById('totalAmount').innerText;
    const total = parseFloat(totalText.replace('Total: ₱', ''));
    const bayad = parseFloat(document.getElementById('bayad').value);

    if (isNaN(bayad) || bayad < total) {
        document.getElementById('sukli').innerText = "❌ Kulang ang bayad!";
        currentSukli = 0;
        document.getElementById('sukliForm').value = '';
    } else {
        const sukli = bayad - total;
        document.getElementById('sukli').innerText =
            `✅ Sukli: ₱${sukli.toFixed(2)}`;
        currentSukli = sukli;
        document.getElementById('sukliForm').value = `₱${sukli.toFixed(2)}`;
    }
});


// ================================
// 🔄 NEW ORDER (RESET)
// ================================
document.getElementById('newOrderBtn').addEventListener('click', function () {

    // reset quantities
    document.querySelectorAll('.quantity').forEach(q => q.value = 0);

    // reset receipt
    document.getElementById('receiptContent').innerHTML = '';
    document.getElementById('totalAmount').innerText = '';
    document.getElementById('bayad').value = 0;
    document.getElementById('sukli').innerText = '';
    document.getElementById('sukliForm').value = '';
    currentSukli = 0;

    // reset email field
    document.getElementById('order').value = '';
    
    // reset form and thank you section
    formEmail.reset();
    document.getElementById('emailFormSection').classList.remove('show');
    document.getElementById('thankYouSection').classList.remove('show');

    // show menu again
    document.querySelector('.menu-section').style.display = 'block';
    document.getElementById('orderBtn').style.display = 'block';
    document.getElementById('receipt').classList.remove('show');
});


// ================================
// 🔄 NEW ORDER FROM THANK YOU PAGE
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const newOrderBtn2 = document.getElementById('newOrderBtn2');
    if (newOrderBtn2) {
        newOrderBtn2.addEventListener('click', function() {
            // reset quantities
            document.querySelectorAll('.quantity').forEach(q => q.value = 0);

            // reset receipt
            document.getElementById('receiptContent').innerHTML = '';
            document.getElementById('totalAmount').innerText = '';
            document.getElementById('bayad').value = 0;
            document.getElementById('sukli').innerText = '';

            // reset email field
            document.getElementById('order').value = '';
            document.getElementById('sukliForm').value = '';
            currentSukli = 0;
            
            // reset form and thank you section
            formEmail.reset();
            document.getElementById('emailFormSection').classList.remove('show');
            document.getElementById('thankYouSection').classList.remove('show');

            // show menu again
            document.querySelector('.menu-section').style.display = 'block';
            document.getElementById('orderBtn').style.display = 'block';
            document.getElementById('receipt').classList.remove('show');
        });
    }
});


// ================================
// 📧 FORM SUBMIT (FORMSPREE)
// ================================
const formEmail = document.getElementById("orderFormEmail");

formEmail.addEventListener("submit", function (e) {
    e.preventDefault();

    // check if may laman order
    const orderValue = document.getElementById('order').value;

    if (orderValue === '') {
        alert("⚠️ Wala kang order!");
        return;
    }

    fetch(formEmail.action, {
        method: "POST",
        body: new FormData(formEmail),
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            // hide form, show thank you message
            const orderValue = document.getElementById('order').value;
            document.getElementById('thankYouOrderDetails').innerText = orderValue;
            document.getElementById('thankYouSukli').innerText = currentSukli > 0 ? `₱${currentSukli.toFixed(2)}` : '₱0.00';
            
            document.getElementById('emailFormSection').classList.remove('show');
            document.getElementById('thankYouSection').classList.add('show');

            // reset form
            formEmail.reset();
            document.getElementById('order').value = '';
            document.getElementById('sukliForm').value = '';

        } else {
            alert("❌ Error sending order.");
        }
    })
    .catch(() => {
        alert("⚠️ Network error.");
    });
});
