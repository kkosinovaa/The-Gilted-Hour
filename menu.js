class MenuCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('menuCart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartDisplay();
        this.setupCategoryFilter();
    }

    bindEvents() {
        // Додавання до кошика
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                this.addToCart(e.target.closest('.menu-item'));
            }

            if (e.target.classList.contains('quantity-btn')) {
                this.updateQuantity(e.target);
            }

            if (e.target.classList.contains('remove-item-btn')) {
                this.removeFromCart(e.target.closest('.cart-item'));
            }

            if (e.target.classList.contains('clear-cart-btn')) {
                this.clearCart();
            }

            if (e.target.classList.contains('checkout-btn')) {
                this.checkout();
            }
        });
    }

    setupCategoryFilter() {
        const categoryBtns = document.querySelectorAll('.category-btn');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Видаляємо активний клас з усіх кнопок
                categoryBtns.forEach(b => b.classList.remove('active'));
                // Додаємо активний клас до поточної кнопки
                btn.classList.add('active');

                const category = btn.dataset.category;
                this.filterMenu(category);
            });
        });
    }

    filterMenu(category) {
        const sections = document.querySelectorAll('.menu-category-section');

        sections.forEach(section => {
            if (category === 'all' || section.dataset.category === category) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    addToCart(menuItem) {
        const itemId = menuItem.dataset.id;
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = this.parsePrice(menuItem.querySelector('.item-price').textContent);
        const itemDescription = menuItem.querySelector('.item-description').textContent;

        const existingItem = this.cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                description: itemDescription,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${itemName} додано до кошика`);
    }

    removeFromCart(cartItem) {
        const itemId = cartItem.dataset.id;
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(button) {
        const cartItem = button.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        const quantityElement = cartItem.querySelector('.cart-item-quantity');
        const item = this.cart.find(item => item.id === itemId);

        if (button.textContent === '+') {
            item.quantity += 1;
        } else if (button.textContent === '-' && item.quantity > 1) {
            item.quantity -= 1;
        }

        this.saveCart();
        this.updateCartDisplay();
    }

    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Ви впевнені, що хочете очистити кошик?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Кошик очищено');
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Кошик порожній! Додайте товари перед оформленням замовлення.');
            return;
        }

        const total = this.calculateTotal();
        alert(`Дякуємо за замовлення!\n\nСума: ${total} грн\n\nВаше замовлення передано на обробку. Очікуйте дзвінка від нашого менеджера.`);

        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalPrice = document.querySelector('.total-price');

        // Оновлюємо кількість товарів
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Оновлюємо список товарів
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Кошик порожній</div>';
        } else {
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price} грн</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn">+</button>
                        <button class="remove-item-btn">×</button>
                    </div>
                </div>
            `).join('');
        }

        // Оновлюємо загальну суму
        totalPrice.textContent = `${this.calculateTotal()} грн`;
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    parsePrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, ''));
    }

    saveCart() {
        localStorage.setItem('menuCart', JSON.stringify(this.cart));
    }

    showNotification(message) {
        // Створюємо сповіщення
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f8f0e3;
            color: #1a1a1a;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Показуємо сповіщення
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Ховаємо сповіщення через 3 секунди
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MenuCart();
});