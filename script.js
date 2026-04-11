// Navigation smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CV Dropdown functionality
// Subtle 3D tilt for premium feel (no neon, no heavy effects)
document.addEventListener('DOMContentLoaded', function () {
    const tiltSelectors = [
        '.project-card',
        '.skill-category',
        '.stat',
        '.timeline-content',
    '.bottom-contact__item',
        '.profile-img'
    ];

    const targets = document.querySelectorAll(tiltSelectors.join(','));
    const supportsHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    if (!supportsHover || targets.length === 0) return;

    targets.forEach((el) => {
        el.style.transformStyle = 'preserve-3d';

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotY = (x - 0.5) * 10; // left/right
            const rotX = (0.5 - y) * 8;  // top/bottom

            el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
        };

        const onLeave = () => {
            el.style.transform = '';
        };

        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
    });
});

// Navigation active state
window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Note: Contact section removed. If you re-add a contact form later,
// you can reintroduce the JS submission logic here.