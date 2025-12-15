document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const body = document.body;

    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');

        // Блокуємо скрол сторінки коли меню відкрите
        if (mobileNav.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Закриваємо меню при кліку на посилання
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Закриваємо меню при ресайзі вікна (якщо перейшли на десктоп)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            burgerMenu.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Отримуємо ID користувача з пам'яті браузера
    const userId = localStorage.getItem("user_id");

    // 2. Знаходимо контейнер кнопки входу (він є в хедері на всіх сторінках)
    const authContainer = document.getElementById("auth-container");

    // Перевіряємо, чи існує контейнер і чи залогінений користувач
    if (userId && authContainer) {
        // Знаходимо посилання <a> всередині контейнера
        const authLink = authContainer.querySelector("a");
        const authButton = authContainer.querySelector("button");

        // 3. Змінюємо посилання з login.html на orders.html
        if (authLink) {
            authLink.href = "orders.html";
        }

        // 4. Змінюємо вигляд кнопки (опціонально)
        if (authButton) {
            // Зберігаємо картинку, але міняємо текст (або додаємо стиль)
            // Якщо хочете змінити іконку, можна замінити src="img/profile.png" на іншу
            authButton.innerHTML = '<img src="img/profile.png" alt=""> Замовлення';

            // Можна додати клас, якщо захочете змінити колір через CSS
            authButton.classList.add("user-logged-in");
        }
    }
});