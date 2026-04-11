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
        '.contact-item',
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

// Contact form -> send to your Gmail via EmailJS
(() => {
    const form = document.querySelector('#contactForm') || document.querySelector('.contact-form');
    if (!form) return;

    const FALLBACK_TO_EMAIL = 'taoufik.rahioui@usmba.ac.ma';

    const submitBtn = form.querySelector('button[type="submit"]');

    const getCfg = () => {
        // Prefer config from emailjs.config.js but allow hardcoding (not recommended).
        return (window.EMAILJS_CONFIG && typeof window.EMAILJS_CONFIG === 'object')
            ? window.EMAILJS_CONFIG
            : null;
    };

    // Debug (safe): helps confirm config is loaded.
    try {
        const cfg = getCfg();
        console.info('[EmailJS]', cfg ? {
            hasPublicKey: !!cfg.publicKey,
            serviceId: cfg.serviceId,
            templateId: cfg.templateId
        } : 'EMAILJS_CONFIG not found');
    } catch {
        // ignore
    }

    const setBtnState = (state) => {
        if (!submitBtn) return;
        if (state === 'sending') {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.dataset.originalText || submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Send';
        }
    };

    const getField = (name) => {
        const el = form.querySelector(`[name="${name}"]`);
        return el ? (el.value || '').trim() : '';
    };

    const openMailtoDraft = ({ reason } = {}) => {
        const fromName = getField('from_name');
        const replyTo = getField('reply_to');
        const message = getField('message');

        const subject = `Portfolio message${fromName ? ` - ${fromName}` : ''}`;
        const bodyLines = [
            fromName ? `Name: ${fromName}` : null,
            replyTo ? `Email: ${replyTo}` : null,
            reason ? `\n---\nEmailJS issue: ${reason}` : null,
            '\nMessage:',
            message || '(empty)'
        ].filter(Boolean);

        const mailto = `mailto:${encodeURIComponent(FALLBACK_TO_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        window.location.href = mailto;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cfg = getCfg();
        if (!cfg || !cfg.publicKey || !cfg.serviceId || !cfg.templateId || !window.emailjs) {
            const msg =
                'EmailJS is not configured on this site yet.\n\n' +
                'I will open your email client instead (mailto) so you can send the message manually.';
            alert(msg);
            openMailtoDraft({ reason: 'Missing EmailJS config or library' });
            return;
        }

        try {
            setBtnState('sending');

            // Init can be repeated safely; EmailJS ignores subsequent inits.
            emailjs.init({ publicKey: cfg.publicKey });

            // Send form fields directly.
            await emailjs.sendForm(cfg.serviceId, cfg.templateId, form);

            alert('Message sent! I’ll get back to you soon.');
            form.reset();
        } catch (err) {
            console.error('EmailJS send failed:', err);
            const details = (err && (err.text || err.message)) ? (err.text || err.message) : 'Unknown error';
            alert(
                'EmailJS failed to send.\n\n' +
                `Details: ${details}\n\n` +
                'I will open your email client instead (mailto) so you can send the message manually.'
            );
            openMailtoDraft({ reason: details });
        } finally {
            setBtnState('idle');
        }
    });
})();

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les éléments à animer
document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});