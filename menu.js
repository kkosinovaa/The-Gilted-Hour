class MenuCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('menuCart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateAllCarts();
        this.setupCategoryFilter();
        this.setupMobileCart();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                this.addToCart(e.target.closest('.menu-item'));
            }

            if (e.target.classList.contains('quantity-btn')) {
                this.handleQuantityChange(e.target);
            }

            if (e.target.classList.contains('remove-item-btn')) {
                this.removeFromCart(e.target);
            }

            if (e.target.classList.contains('clear-cart-btn')) {
                this.clearCart();
            }

            if (e.target.classList.contains('checkout-btn')) {
                this.checkout();
            }

            if (e.target.classList.contains('mobile-checkout-btn')) {
                this.checkout();
            }

            if (e.target.classList.contains('mobile-clear-cart-btn')) {
                this.clearCart();
            }
        });

        const mobileCartBtn = document.getElementById('mobileCartBtn');
        const closeCartBtn = document.getElementById('closeCartBtn');
        const mobileCartModal = document.getElementById('mobileCartModal');

        if (mobileCartBtn) {
            mobileCartBtn.addEventListener('click', () => {
                this.openMobileCart();
            });
        }

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                this.closeMobileCart();
            });
        }

        if (mobileCartModal) {
            mobileCartModal.addEventListener('click', (e) => {
                if (e.target === mobileCartModal) {
                    this.closeMobileCart();
                }
            });
        }
    }

    setupCategoryFilter() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                this.filterMenu(category);
            });
        });
    }

    setupMobileCart() {
        this.updateMobileCartBadge();
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
        this.updateAllCarts();
        this.showNotification(`${itemName} додано до кошика`);
    }

    removeFromCart(removeBtn) {
        const cartItem = removeBtn.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateAllCarts();
    }

    handleQuantityChange(button) {
        const cartItem = button.closest('.cart-item');
        const itemId = cartItem.dataset.id;
        const item = this.cart.find(item => item.id === itemId);

        if (!item) return;

        if (button.classList.contains('plus')) {
            item.quantity += 1;
        } else if (button.classList.contains('minus') && item.quantity > 1) {
            item.quantity -= 1;
        }

        this.saveCart();
        this.updateAllCarts();
    }

    clearCart() {
        if (this.cart.length === 0) return;

        this.cart = [];
        this.saveCart();
        this.updateAllCarts();
        this.showNotification('Кошик очищено');
    }

    checkout() {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
            this.showNotification("Спочатку увійдіть у свій акаунт!");
            return;
        }

        fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id,
                cart: this.cart,
                total_price: this.calculateTotal()
            })
        })
            .then(res => res.json())
            .then(() => {
                this.showNotification("Замовлення успішно збережено! 🛵");
                this.cart = [];
                this.saveCart();
                this.updateAllCarts();
                this.closeMobileCart();
            })
            .catch(() => {
                this.showNotification("⚠ Помилка при оформленні замовлення. Спробуйте пізніше.");
            });
    }

    updateAllCarts() {
        this.updateDesktopCart();
        this.updateMobileCart();
        this.updateMobileCartBadge();
    }

    updateDesktopCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartCount = document.querySelector('.cart-count');
        const totalPrice = document.querySelector('.total-price');

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Кошик порожній</div>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">${item.price} грн</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                            <button class="remove-item-btn">×</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartCount) {
            cartCount.textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        if (totalPrice) {
            totalPrice.textContent = `${this.calculateTotal()} грн`;
        }
    }

    updateMobileCart() {
        const mobileCartItems = document.getElementById('mobileCartItems');
        const mobileTotalPrice = document.querySelector('.mobile-total-price');

        if (mobileCartItems) {
            if (this.cart.length === 0) {
                mobileCartItems.innerHTML = '<div class="empty-cart">Кошик порожній</div>';
            } else {
                mobileCartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">${item.price} грн</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                            <button class="remove-item-btn">×</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (mobileTotalPrice) {
            mobileTotalPrice.textContent = `${this.calculateTotal()} грн`;
        }
    }

    updateMobileCartBadge() {
        const mobileCartBadge = document.getElementById('mobileCartBadge');
        if (mobileCartBadge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            mobileCartBadge.textContent = totalItems;
            mobileCartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    openMobileCart() {
        const mobileCartModal = document.getElementById('mobileCartModal');
        if (mobileCartModal) {
            mobileCartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileCart() {
        const mobileCartModal = document.getElementById('mobileCartModal');
        if (mobileCartModal) {
            mobileCartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
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
        let notificationBox = document.querySelector(".notification-box");

        if (!notificationBox) {
            notificationBox = document.createElement("div");
            notificationBox.className = "notification-box";
            document.body.appendChild(notificationBox);
        }

        notificationBox.textContent = message;
        notificationBox.classList.add("show");

        setTimeout(() => {
            notificationBox.classList.remove("show");
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MenuCart();
});
