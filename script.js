// Product Data
const products = [
    {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        category: 'mens',
        price: 29.99,
        description: 'Comfortable and versatile everyday tee',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
    },
    {
        id: 2,
        name: 'Classic Denim Jacket',
        category: 'mens',
        price: 79.99,
        description: 'Timeless denim jacket for any season',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500'
    },
    {
        id: 3,
        name: 'Elegant Black Blazer',
        category: 'womens',
        price: 99.99,
        description: 'Perfect for office and formal occasions',
        image: 'https://images.unsplash.com/photo-1539533057440-7d1f3b0896d2?w=500'
    },
    {
        id: 4,
        name: 'Flowing Linen Dress',
        category: 'womens',
        price: 69.99,
        description: 'Light and breathable summer essential',
        image: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=500'
    },
    {
        id: 5,
        name: 'Leather Handbag',
        category: 'accessories',
        price: 89.99,
        description: 'Durable and stylish leather accessory',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
    },
    {
        id: 6,
        name: 'Wool Winter Scarf',
        category: 'accessories',
        price: 39.99,
        description: 'Warm and cozy for cold seasons',
        image: 'https://images.unsplash.com/photo-1537825566911-4b02cf348330?w=500'
    },
    {
        id: 7,
        name: 'Chino Pants',
        category: 'mens',
        price: 59.99,
        description: 'Versatile and comfortable casual wear',
        image: 'https://images.unsplash.com/photo-1473966143519-8bf033fdb497?w=500'
    },
    {
        id: 8,
        name: 'Knit Sweater',
        category: 'womens',
        price: 64.99,
        description: 'Cozy knit perfect for layering',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500'
    },
    {
        id: 9,
        name: 'Canvas Sneakers',
        category: 'accessories',
        price: 59.99,
        description: 'Casual and comfortable everyday shoes',
        image: 'https://images.unsplash.com/photo-1572830165842-60583f15e38e?w=500'
    }
];

// State Management
let cart = [];
let currentFilter = 'all';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeBtn = document.querySelector('.close');
const cartItemsDiv = document.getElementById('cart-items');
const cartCountSpan = document.getElementById('cart-count');
const cartTotalSpan = document.getElementById('cart-total');
const contactForm = document.getElementById('contact-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    setupEventListeners();
    loadCartFromLocalStorage();
});

// Display Products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filter Products
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentFilter = btn.dataset.filter;
        
        if (currentFilter === 'all') {
            displayProducts(products);
        } else {
            const filtered = products.filter(p => p.category === currentFilter);
            displayProducts(filtered);
        }
    });
});

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToLocalStorage();
    updateCartUI();
    showNotification('Added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    cartCountSpan.textContent = cart.length;
    renderCartItems();
    updateCartTotal();
}

// Render Cart Items
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
}

// Update Cart Total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalSpan.textContent = total.toFixed(2);
    localStorage.setItem('cart_total', total.toFixed(2));
}

// Setup Event Listeners
function setupEventListeners() {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Local Storage Functions
function saveCartToLocalStorage() {
    localStorage.setItem('soulkind_cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('soulkind_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 300;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);