const orderBtn = document.getElementById('orderBtn');
const newOrderBtn = document.getElementById('newOrderBtn');
const payBtn = document.getElementById('payBtn');

orderBtn.addEventListener('click', function(){
    const quantities = document.querySelectorAll('.quantity');
    let receiptHTML = '';
    let total = 0;
    let orderText = '';

    receiptHTML += '<hr>';

    quantities.forEach(q=>{
        const qty = parseInt(q.value);
        const price = parseFloat(q.dataset.price);
        const name = q.parentElement.querySelector('h3').innerText;
        if(qty > 0){
            const subtotal = qty*price;
            total += subtotal;
            receiptHTML += `<p>${name}<br>₱${price} x ${qty} = ₱${subtotal.toFixed(2)}</p><hr>`;
            orderText += `${qty} x ${name}, `;
        }
    });

    if(total === 0) receiptHTML = "<p>Walang inorder.</p>";

    document.getElementById('receiptContent').innerHTML = receiptHTML;
    document.getElementById('totalAmount').innerHTML = `<strong>Total: ₱${total.toFixed(2)}</strong>`;

    document.querySelector('.menu-grid').style.display = 'none';
    orderBtn.style.display = 'none';

    // Auto-fill email order
    document.getElementById('order').value = orderText.slice(0,-2);
});

payBtn.addEventListener('click', function(){
    const total = parseFloat(document.getElementById('totalAmount').innerText.replace('Total: ₱','')) || 0;
    const bayad = parseFloat(document.getElementById('bayad').value);
    if(isNaN(bayad) || bayad < total) document.getElementById('sukli').innerText = "Kulangan ang bayad!";
    else document.getElementById('sukli').innerText = `Sukli: ₱${(bayad-total).toFixed(2)}`;
});

newOrderBtn.addEventListener('click', function(){
    document.querySelectorAll('.quantity').forEach(q=>q.value=0);
    document.getElementById('receiptContent').innerHTML = '';
    document.getElementById('totalAmount').innerText = '';
    document.getElementById('bayad').value = 0;
    document.getElementById('sukli').innerText = '';
    document.querySelector('.menu-grid').style.display = 'grid';
    orderBtn.style.display = 'block';
    document.getElementById('order').value = '';
});
