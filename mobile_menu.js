document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const body = document.body;

    // Toggle mobile menu
    mobileNavToggle.addEventListener('click', function() {
        mobileNav.classList.add('active');
        body.style.overflow = 'hidden';
    });

    // Close mobile menu
    mobileNavClose.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        body.style.overflow = '';
    });

    // Close menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    mobileNav.addEventListener('click', function(e) {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });
});