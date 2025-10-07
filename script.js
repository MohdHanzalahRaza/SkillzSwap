// ===================================
// Initialize AOS (Animate On Scroll)
// ===================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// ===================================
// Theme Toggle
// ===================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===================================
// Navigation Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===================================
// Mobile Navigation Toggle
// ===================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Counter Animation for Hero Stats
// ===================================
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
};

// Trigger counter animation when stats are in view
const observerOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                animateCounter(stat, target);
            });
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===================================
// Sample Skills Data
// ===================================
const skillsData = [
    {
        id: 1,
        title: 'Web Development (React, Node.js)',
        description: 'I can teach you full-stack web development with modern technologies. Looking to learn graphic design in return.',
        username: 'Priya Sharma',
        avatar: 'https://i.pravatar.cc/150?img=5',
        rating: 4.8,
        category: 'tech',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        verified: true
    },
    {
        id: 2,
        title: 'Graphic Design (Adobe Suite)',
        description: 'Expert in Photoshop, Illustrator, and InDesign. Want to learn digital marketing strategies.',
        username: 'Rahul Verma',
        avatar: 'https://i.pravatar.cc/150?img=12',
        rating: 4.9,
        category: 'creative',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
        verified: true
    },
    {
        id: 3,
        title: 'Spanish Language (Fluent Speaker)',
        description: 'Native Spanish speaker offering conversational lessons. Interested in learning Python programming.',
        username: 'Ananya Patel',
        avatar: 'https://i.pravatar.cc/150?img=9',
        rating: 4.7,
        category: 'language',
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
        verified: true
    },
    {
        id: 4,
        title: 'Digital Marketing & SEO',
        description: '5 years of experience in SEO and social media marketing. Want to learn video editing.',
        username: 'Vikram Singh',
        avatar: 'https://i.pravatar.cc/150?img=15',
        rating: 4.6,
        category: 'business',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        verified: false
    },
    {
        id: 5,
        title: 'Photography (DSLR & Mobile)',
        description: 'Professional photographer teaching composition and editing. Looking to learn music production.',
        username: 'Sneha Gupta',
        avatar: 'https://i.pravatar.cc/150?img=20',
        rating: 4.9,
        category: 'creative',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
        verified: true
    },
    {
        id: 6,
        title: 'Data Science & Machine Learning',
        description: 'Expert in Python, TensorFlow, and data analysis. Interested in learning UI/UX design.',
        username: 'Arjun Mehta',
        avatar: 'https://i.pravatar.cc/150?img=33',
        rating: 4.8,
        category: 'tech',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        verified: true
    },
    {
        id: 7,
        title: 'Yoga & Meditation',
        description: 'Certified yoga instructor with 8 years experience. Want to learn content writing.',
        username: 'Kavya Reddy',
        avatar: 'https://i.pravatar.cc/150?img=25',
        rating: 4.7,
        category: 'creative',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        verified: false
    },
    {
        id: 8,
        title: 'French Language (Native)',
        description: 'Native French speaker offering lessons at all levels. Looking to learn guitar.',
        username: 'Aditya Kumar',
        avatar: 'https://i.pravatar.cc/150?img=8',
        rating: 4.5,
        category: 'language',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
        verified: true
    },
    {
        id: 9,
        title: 'Financial Planning & Investment',
        description: 'Certified financial advisor. Want to learn web development basics.',
        username: 'Neha Desai',
        avatar: 'https://i.pravatar.cc/150?img=47',
        rating: 4.8,
        category: 'business',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        verified: true
    }
];

// ===================================
// Render Skills Grid
// ===================================
const skillsGrid = document.getElementById('skillsGrid');
let currentFilter = 'all';
let displayedSkills = 6;

function createSkillCard(skill) {
    return `
        <div class="skill-card" data-category="${skill.category}" data-aos="fade-up">
            <img src="${skill.image}" alt="${skill.title}" class="skill-image">
            <div class="skill-content">
                <div class="skill-header">
                    <img src="${skill.avatar}" alt="${skill.username}" class="skill-avatar">
                    <div class="skill-user">
                        <div class="skill-username">${skill.username}</div>
                        ${skill.verified ? '<span class="skill-badge"><i class="fas fa-check"></i> Verified</span>' : ''}
                    </div>
                </div>
                <h3 class="skill-title">${skill.title}</h3>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-footer">
                    <div class="skill-rating">
                        <i class="fas fa-star"></i>
                        <span>${skill.rating}</span>
                    </div>
                    <span class="skill-category">${skill.category}</span>
                </div>
            </div>
        </div>
    `;
}

function renderSkills() {
    const filteredSkills = currentFilter === 'all' 
        ? skillsData 
        : skillsData.filter(skill => skill.category === currentFilter);
    
    const skillsToShow = filteredSkills.slice(0, displayedSkills);
    skillsGrid.innerHTML = skillsToShow.map(createSkillCard).join('');
    
    // Re-initialize AOS for new elements
    AOS.refresh();
}

// Initial render
renderSkills();

// Filter functionality
const filterTabs = document.querySelectorAll('.filter-tab');
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        displayedSkills = 6;
        renderSkills();
    });
});

// Load more functionality
const loadMoreBtn = document.getElementById('loadMoreSkills');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        displayedSkills += 3;
        renderSkills();
        
        if (displayedSkills >= skillsData.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// ===================================
// Testimonials Data
// ===================================
const testimonialsData = [
    {
        name: 'Rajesh Kumar',
        role: 'Software Developer',
        avatar: 'https://i.pravatar.cc/150?img=11',
        rating: 5,
        text: 'SwapSkillz changed my life! I learned graphic design from an amazing teacher and taught programming in return. The community is incredibly supportive and professional.'
    },
    {
        name: 'Meera Iyer',
        role: 'Marketing Manager',
        avatar: 'https://i.pravatar.cc/150?img=26',
        rating: 5,
        text: 'I was skeptical at first, but this platform exceeded all expectations. I mastered Spanish conversation skills while sharing my digital marketing expertise. Highly recommended!'
    },
    {
        name: 'Sanjay Patel',
        role: 'Freelance Designer',
        avatar: 'https://i.pravatar.cc/150?img=13',
        rating: 4,
        text: 'Great concept and execution! I have connected with multiple learners and teachers. The verification system makes it feel safe and trustworthy.'
    },
    {
        name: 'Divya Nair',
        role: 'Content Writer',
        avatar: 'https://i.pravatar.cc/150?img=44',
        rating: 5,
        text: 'As a content writer, I wanted to learn photography. Found an excellent mentor here and we have been exchanging skills for 3 months now. Amazing experience!'
    },
    {
        name: 'Karan Malhotra',
        role: 'Business Analyst',
        avatar: 'https://i.pravatar.cc/150?img=52',
        rating: 5,
        text: 'The platform is user-friendly and the matching system is brilliant. I learned data visualization while teaching financial planning. Win-win for both!'
    }
];

// ===================================
// Render Testimonials
// ===================================
const testimonialsSlider = document.getElementById('testimonialsSlider');
let currentTestimonialIndex = 0;

function createTestimonialCard(testimonial) {
    const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
    return `
        <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar">
                <div class="testimonial-author">
                    <h4>${testimonial.name}</h4>
                    <p class="testimonial-role">${testimonial.role}</p>
                </div>
            </div>
            <div class="testimonial-rating">${stars}</div>
            <p class="testimonial-text">"${testimonial.text}"</p>
        </div>
    `;
}

function renderTestimonials() {
    testimonialsSlider.innerHTML = testimonialsData.map(createTestimonialCard).join('');
}

renderTestimonials();

// Testimonial slider controls
const prevTestimonialBtn = document.getElementById('prevTestimonial');
const nextTestimonialBtn = document.getElementById('nextTestimonial');

if (prevTestimonialBtn && nextTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
        testimonialsSlider.scrollBy({
            left: -350,
            behavior: 'smooth'
        });
    });

    nextTestimonialBtn.addEventListener('click', () => {
        testimonialsSlider.scrollBy({
            left: 350,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Modal Functionality
// ===================================
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const modalCloses = document.querySelectorAll('.modal-close');
const modalOverlays = document.querySelectorAll('.modal-overlay');

// Open modals
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

signupBtn.addEventListener('click', () => {
    signupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Switch between modals
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('active');
    signupModal.classList.add('active');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.remove('active');
    loginModal.classList.add('active');
});

// Close modals
modalCloses.forEach(close => {
    close.addEventListener('click', () => {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===================================
// Form Submissions
// ===================================
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login (in real app, send to backend)
    console.log('Login attempt:', { email, password });
    
    showToast('Login successful! Welcome back!', 'success');
    loginModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    loginForm.reset();
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    // Simulate signup (in real app, send to backend)
    console.log('Signup attempt:', { name, email, password });
    
    showToast('Account created successfully! Please check your email.', 'success');
    signupModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    signupForm.reset();
});

// ===================================
// Toast Notification
// ===================================
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast show';
    
    // Change icon based on type
    const icon = toast.querySelector('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--accent)';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = 'var(--danger)';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Hero Search
// ===================================
const heroSearch = document.getElementById('heroSearch');
const searchBox = document.querySelector('.search-box button');

if (heroSearch && searchBox) {
    searchBox.addEventListener('click', () => {
        const searchTerm = heroSearch.value.trim();
        if (searchTerm) {
            // Scroll to browse skills section
            const browseSection = document.getElementById('browse-skills');
            browseSection.scrollIntoView({ behavior: 'smooth' });
            
            // Filter skills based on search
            const filtered = skillsData.filter(skill => 
                skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                skill.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filtered.length > 0) {
                skillsGrid.innerHTML = filtered.map(createSkillCard).join('');
                showToast(`Found ${filtered.length} skills matching "${searchTerm}"`, 'success');
            } else {
                skillsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No skills found. Try a different search term.</p>';
                showToast('No skills found. Try a different search term.', 'error');
            }
            
            AOS.refresh();
        }
    });
    
    // Allow Enter key for search
    heroSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBox.click();
        }
    });
}

// ===================================
// Newsletter Form
// ===================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate newsletter signup
        console.log('Newsletter signup:', email);
        showToast('Successfully subscribed to newsletter!', 'success');
        newsletterForm.reset();
    });
}

// ===================================
// Add Click Events to Skill Cards
// ===================================
function addSkillCardListeners() {
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            showToast('Feature coming soon! You\'ll be able to view full profiles and send swap requests.', 'success');
        });
    });
}

// Call after initial render and any re-render
addSkillCardListeners();

// Update the renderSkills function to add listeners
const originalRenderSkills = renderSkills;
renderSkills = function() {
    originalRenderSkills();
    addSkillCardListeners();
};

// ===================================
// Page Load Animation
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Back to Top Button (Optional Enhancement)
// ===================================
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 998;
    box-shadow: var(--shadow-lg);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'all';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.pointerEvents = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Loading Skeleton for Images (Optional)
// ===================================
document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.addEventListener('load', () => {
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '1';
    });
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c👋 Welcome to SwapSkillz!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%c🚀 Trade skills, not money. Join our community!', 'font-size: 14px; color: #10b981;');
console.log('%c📧 Contact: support@swapskillz.com', 'font-size: 12px; color: #6b7280;');