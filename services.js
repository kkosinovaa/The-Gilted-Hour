document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Встановлення мінімальної дати для форм
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });

    const datetimeInputs = document.querySelectorAll('input[type="datetime-local"]');
    datetimeInputs.forEach(input => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        input.setAttribute('min', now.toISOString().slice(0, 16));
    });

    // Валідація форм
    const forms = document.querySelectorAll('.service-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm(this)) {
                showSuccessMessage(this);
                this.reset();
            }
        });
    });

    // Додавання маски для телефону
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '+38' + value;
            }
            e.target.value = value;
        });
    });
});

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'Це поле обов\'язкове для заповнення');
            isValid = false;
        } else {
            removeError(field);

            // Додаткова валідація для email
            if (field.type === 'email' && field.value.trim()) {
                if (!isValidEmail(field.value)) {
                    showError(field, 'Будь ласка, введіть коректний email');
                    isValid = false;
                }
            }

            // Додаткова валідація для телефону
            if (field.type === 'tel' && field.value.trim()) {
                if (!isValidPhone(field.value)) {
                    showError(field, 'Будь ласка, введіть коректний номер телефону');
                    isValid = false;
                }
            }
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+38\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showError(field, message) {
    removeError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    `;
    errorDiv.textContent = message;

    field.style.borderColor = '#ff6b6b';
    field.parentNode.appendChild(errorDiv);
}

function removeError(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function showSuccessMessage(form) {
    const formType = form.closest('.tab-pane').id;
    let message = 'Дякуємо за ваше звернення!';

    switch(formType) {
        case 'catering':
            message = 'Дякуємо за запит на кейтеринг! Наш менеджер зв\'яжеться з вами найближчим часом.';
            break;
        case 'delivery':
            message = 'Дякуємо за замовлення доставки! Ми зв\'яжемося з вами для підтвердження.';
            break;
        case 'booking':
            message = 'Дякуємо за бронювання столика! Ми підготуємо все для вашого візиту.';
            break;
    }

    alert(message);
}