function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
    
    // Ustunlarni tozalash
    document.getElementById('new-orders').innerHTML = '';
    document.getElementById('preparing-orders').innerHTML = '';
    document.getElementById('ready-orders').innerHTML = '';

    orders.forEach((order, index) => {
        // Agar status bo'lmasa, 'new' deb belgilaymiz
        const status = order.status || 'new';
        const columnId = status + '-orders';
        
        let buttonText = status === 'new' ? 'Start Cooking' : (status === 'preparing' ? 'Mark as Ready' : 'Complete');
        let nextStatus = status === 'new' ? 'preparing' : (status === 'preparing' ? 'ready' : 'finish');

        const cardHtml = `
            <div class="order-card">
                <div class="card-top">
                    <span class="order-no">#${String(index + 1).padStart(3, '0')}</span>
                    <span class="table-no">TABLE ${order.table}</span>
                </div>
                <div class="items-list">
                    ${order.items.map(item => `
                        <div class="item">
                            <span>${item.qty}x ${item.name}</span>
                        </div>
                    `).join('')}
                </div>
                <p style="font-size: 12px; color: #888;">${order.time}</p>
                <button class="btn-action" onclick="moveOrder(${index}, '${nextStatus}')">${buttonText}</button>
            </div>
        `;

        document.getElementById(columnId).insertAdjacentHTML('beforeend', cardHtml);
    });
}

function moveOrder(index, nextStatus) {
    let orders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
    
    if (nextStatus === 'finish') {
        orders.splice(index, 1); // Tayyor bo'lganini o'chirish
    } else {
        orders[index].status = nextStatus; // Statusni yangilash
    }

    localStorage.setItem('restaurant_orders', JSON.stringify(orders));
    displayOrders();
}

setInterval(displayOrders, 3000);
window.onload = displayOrders;