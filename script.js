// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect — hide on scroll down, show on scroll up
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Scrolling DOWN — hide navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling UP — show navbar
            navbar.classList.remove('navbar-hidden');
        }

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
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

    // 5. Stars Background Animation
    const canvas = document.getElementById('stars-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let mouse = { x: null, y: null };
        const hero = document.getElementById('home');

        const resizeCanvas = () => {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() - 0.5) * 1.5;
                this.originalSpeedX = this.speedX;
                this.originalSpeedY = this.speedY;
                this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`; // Pure white with random opacity
            }

            update() {
                // If mouse is near, attract stars
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = (200 - distance) / 200; // Radius of 200

                    if (distance < 200) {
                        this.speedX += dx * force * 0.01;
                        this.speedY += dy * force * 0.01;
                    } else {
                        // Slowly return to original speed
                        this.speedX += (this.originalSpeedX - this.speedX) * 0.02;
                        this.speedY += (this.originalSpeedY - this.speedY) * 0.02;
                    }
                } else {
                    // Slowly return to original speed
                    this.speedX += (this.originalSpeedX - this.speedX) * 0.02;
                    this.speedY += (this.originalSpeedY - this.speedY) * 0.02;
                }

                this.x += this.speedX;
                this.y += this.speedY;

                // Loop back around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            stars = [];
            const count = Math.floor((canvas.width * canvas.height) / 8000); // Responsive density
            for (let i = 0; i < count; i++) {
                stars.push(new Star());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            requestAnimationFrame(animate);
        };

        init();
        animate();
    }

    // 6. Copy Email Functionality
    const copyBtn = document.getElementById('copy-email-btn');
    const copyFeedback = document.getElementById('copy-feedback');
    const emailToCopy = 'huuduc01042006@gmail.com';

    if (copyBtn && copyFeedback) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailToCopy).then(() => {
                // Show feedback
                copyFeedback.classList.add('show');

                // Change button state temporarily
                const originalContent = copyBtn.innerHTML;
                copyBtn.innerHTML = `<span>Email Copied!</span> <i class="ph ph-check-circle"></i>`;
                copyBtn.style.borderColor = '#10b981';
                copyBtn.style.background = 'rgba(16, 185, 129, 0.1)';

                // Reset after 2 seconds
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                    copyBtn.innerHTML = originalContent;
                    copyBtn.style.borderColor = '';
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // 7. Initialize Swiper for Projects
    if (typeof Swiper !== 'undefined') {
        new Swiper('.projects-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            mousewheel: {
                forceToAxis: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            grabCursor: true,
        });
    }

    // 8. Dynamic Random Shooting Stars for Projects
    function initShootingStars() {
        const container = document.querySelector('.projects-bg-orbits');
        if (!container) return;

        function createStar() {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            
            // Determine spawn edge (Top, Left, Right)
            const edge = Math.floor(Math.random() * 3); 
            let top, left, rotation;

            if (edge === 0) { // Top edge (falls down)
                top = Math.random() * 20; // Near header
                left = Math.random() * 100;
                rotation = 200 + Math.random() * 140; // Pointing downwards-ish
            } else if (edge === 1) { // Left edge
                top = Math.random() * 80;
                left = -5;
                rotation = 160 + Math.random() * 40; // Pointing right-ish-down
            } else { // Right edge
                top = Math.random() * 80;
                left = 105;
                rotation = 340 + Math.random() * 40; // Pointing left-ish-down
            }
            
            // Random animation duration
            const duration = 1.5 + Math.random() * 2.5; // 1.5-4s (slightly faster)

            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.transform = `rotate(${rotation}deg)`;
            star.style.animation = `dynamicShoot ${duration}s ease-in forwards`;

            container.appendChild(star);

            // Cleanup
            setTimeout(() => {
                star.remove();
            }, duration * 1000);

            // Schedule next star
            const nextDelay = 3000 + Math.random() * 7000; // 3-10s
            setTimeout(createStar, nextDelay);
        }

        // Initial delay before first star
        setTimeout(createStar, 2000);
    }

    initShootingStars();
});
