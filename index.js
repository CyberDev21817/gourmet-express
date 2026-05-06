const foods = [
    { id: 1, category: "Pizzas", name: "Margarita Pizza", price: 79000, img: "images/pitsa1.jpg" },
    { id: 2, category: "Pizzas", name: "Pepperoni Pizza", price: 85000, img: "images/pepperoni.jpg" },
    { id: 3, category: "Burgers", name: "Cheeseburger", price: 35000, img: "images/cheese-burger.jpg" },
    { id: 4, category: "Burgers", name: "Double Burger", price: 55000, img: "images/double-burger.jpg" },
    { id: 5, category: "Drinks", name: "Coca-Cola 0.5L", price: 12000, img: "images/cola.jpg" },
    { id: 6, category: "Drinks", name: "Fanta 0.5L", price: 12000, img: "images/fanta.jpg" },
    { id: 7, category: "Drinks", name: "Coffee Americano", price: 18000, img: "images/kofe.jpg" },
    { id: 8, category: "Pizzas", name: "Assorted Pizza", price: 95000, img: "images/assorti.jpg" },
    { id: 9, category: "Burgers", name: "Chicken Burger", price: 32000, img: "images/chicken-burger.jpg" }
];

let cart = {};
let currentCategory = "All";

function loadMenu(filter = "All", search = "") {
    const container = document.getElementById('menu-container');
    const filtered = foods.filter(f => {
        const catMatch = filter === "All" || f.category === filter;
        const searchMatch = f.name.toLowerCase().includes(search.toLowerCase());
        return catMatch && searchMatch;
    });

    container.innerHTML = filtered.map(f => {
        const qty = cart[f.id] || 0;
        return `
            <div class="food-card">
                <img src="${f.img}" alt="${f.name}">
                <small>${f.category}</small>
                <h3>${f.name}</h3>
                <div class="price">${f.price.toLocaleString()} UZS</div>
                <div id="item-${f.id}">
                    ${qty > 0 ? renderStepper(f.id, qty) : `<button class="add-btn" onclick="changeQty(${f.id}, 1)">Add +</button>`}
                </div>
            </div>
        `;
    }).join('');
}

function renderStepper(id, qty) {
    return `
    <div class="stepper">
        <button onclick="changeQty(${id}, -1)">−</button>
        <span>${qty}</span>
        <button onclick="changeQty(${id}, 1)">+</button>
    </div>`;
}

window.changeQty = (id, delta) => {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    
    updateCartBar();
    loadMenu(currentCategory, document.getElementById('search-input').value);
};

function updateCartBar() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    document.getElementById('cart-count').innerText = `${total} items`;
}

window.filterMenu = (cat) => {
    currentCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.innerText === cat));
    loadMenu(cat);
};

document.getElementById('search-input').oninput = (e) => loadMenu(currentCategory, e.target.value);

// Modal Functions
window.openModal = () => {
    if (Object.keys(cart).length === 0) return alert("Cart is empty!");
    document.getElementById('checkout-modal').style.display = 'flex';
};
window.closeModal = () => document.getElementById('checkout-modal').style.display = 'none';

window.onload = () => loadMenu();



window.openModal = () => {
    const summaryContainer = document.getElementById('order-summary-list');
    let totalSum = 0;
    let itemsHtml = '';

    // Savatdagi har bir mahsulotni aylanib chiqamiz
    Object.keys(cart).forEach(id => {
        const food = foods.find(f => f.id == id);
        const qty = cart[id];
        const itemTotal = food.price * qty;
        totalSum += itemTotal;

        itemsHtml += `
            <div class="summary-item">
                <span>${food.name} x ${qty}</span>
                <span>${itemTotal.toLocaleString()} UZS</span>
            </div>
        `;
    });

    if (totalSum === 0) return alert("Your cart is empty!");

    // Modal ichini yangilash
    summaryContainer.innerHTML = `
        ${itemsHtml}
        <div class="summary-total">
            <span>Total:</span>
            <span>${totalSum.toLocaleString()} UZS</span>
        </div>
    `;

    document.getElementById('checkout-modal').style.display = 'flex';
};

window.submitOrder = () => {
    const tableInput = document.getElementById('table-number');
    const paymentInput = document.getElementById('payment-method');
    const table = tableInput.value;
    const payment = paymentInput.value;

    if (!table) {
        alert("Please enter your table number!");
        return;
    }

    // 1. Buyurtma ma'lumotlarini yig'ish
    const orderData = {
        table: table,
        payment: payment,
        time: new Date().toLocaleTimeString(),
        items: Object.keys(cart).map(id => {
            const food = foods.find(f => f.id == parseInt(id));
            return { name: food.name, qty: cart[id] };
        })
    };

    // 2. LocalStorage ga saqlash
    let existingOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('restaurant_orders', JSON.stringify(existingOrders));

    alert("Order sent to kitchen!");

    // 3. SAVATNI TOZALASH VA INTERFEYSNI YANGILASH
    cart = {}; // Savat ob'ektini bo'shatish
    
    // Savat panelidagi matnni yangilash
    updateCartBar(); 
    
    // Menyudagi tugmalarni Add+ holatiga qaytarish
    loadMenu(currentCategory); 
    
    // Modal oynani yopish
    closeModal();
    
    // Inputlarni tozalash (keyingi zakas uchun)
    tableInput.value = '';
};

// Modalni yopish funksiyasi (aniq ishlashi uchun)
window.closeModal = () => {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
};