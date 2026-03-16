// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Close mobile menu if open (implementation dependent)
        });
    });

    // Trigger reveal for elements in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // 4. Work Experience Toggle
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const toggleBg = document.querySelector('.toggle-bg');
    const timelineContainers = document.querySelectorAll('.timeline-container');

    if (toggleBtns.length > 0) {
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons
                toggleBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                btn.classList.add('active');

                // Move the indicator
                const target = btn.getAttribute('data-target');
                if (target === 'edu-content') {
                    toggleBg.setAttribute('data-active', 'edu');
                } else {
                    toggleBg.removeAttribute('data-active');
                }

                // Hide all content, then show target with animation
                timelineContainers.forEach(container => {
                    container.classList.remove('active-content');
                    container.style.display = 'none'; // Ensure it's hidden immediately for clean switch
                });

                const activeContainer = document.getElementById(target);
                if (activeContainer) {
                    activeContainer.style.display = 'block';
                    // setTimeout to allow display block to apply before adding animation class
                    setTimeout(() => {
                        activeContainer.classList.add('active-content');
                    }, 10);
                }
            });
        });
    }
});
