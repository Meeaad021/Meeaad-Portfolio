// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            nav.classList.remove('active');
        }
    });
});

// Logo click - scroll to top
document.querySelector('.logo').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form submission with Supabase
const form = document.querySelector('.contact-form');
const formStatus = document.getElementById('formStatus');
const btnText = document.getElementById('btnText');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value || 'Not provided',
        message: document.getElementById('message').value,
        submitted_at: new Date().toISOString()
    };
    
    // Show loading state
    btnText.textContent = 'Sending...';
    formStatus.style.display = 'none';
    
    try {
        // IMPORTANT: Replace these with your actual Supabase credentials
        // Get them from: https://supabase.com/dashboard/project/_/settings/api
        const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';  // Example: https://xxxxx.supabase.co
        const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';  // Long string starting with eyJ...
        
        // Make sure you've replaced the values above before testing!
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
            throw new Error('Please update Supabase credentials in index.js');
        }
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok || response.status === 201) {
            formStatus.style.display = 'block';
            formStatus.style.color = '#10b981';
            formStatus.textContent = '✓ Message sent successfully! Thank you for reaching out.';
            form.reset();
        } else {
            const errorData = await response.json();
            console.error('Supabase error:', errorData);
            throw new Error('Submission failed');
        }
    } catch (error) {
        formStatus.style.display = 'block';
        formStatus.style.color = '#ef4444';
        
        if (error.message.includes('Supabase credentials')) {
            formStatus.textContent = '⚠️ Contact form not configured yet. Please update Supabase credentials.';
        } else {
            formStatus.textContent = '✗ Failed to send message. Please try again or email directly.';
        }
        
        console.error('Error:', error);
    } finally {
        btnText.textContent = 'Send Message';
    }
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// Scroll animations - Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing after animation (uncomment if you want animation only once)
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Observe experience cards with stagger effect
document.querySelectorAll('.experience-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Observe project cards with stagger effect
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(card);
});

// Observe about section elements
observer.observe(document.querySelector('.about-content'));
observer.observe(document.querySelector('.skills-container'));
observer.observe(document.querySelector('.contact-container'));