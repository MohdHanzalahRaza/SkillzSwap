// ===================================
// API Configuration
// ===================================
const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
const setToken = (token) => localStorage.setItem('token', token);

// Remove token
const removeToken = () => localStorage.removeItem('token');

// Get user from localStorage
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// API call helper
const apiCall = async (endpoint, method = 'GET', data = null) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

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

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
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
// Fetch and Render Skills from Backend
// ===================================
const skillsGrid = document.getElementById('skillsGrid');
let currentFilter = 'all';
let displayedSkills = 6;
let allSkills = [];

// Fetch skills from API
async function fetchSkills() {
    try {
        const response = await apiCall('/skills');
        allSkills = response.skills || [];
        renderSkills();
    } catch (error) {
        console.error('Error fetching skills:', error);
        showToast('Failed to load skills', 'error');
        // Fallback to sample data if API fails
        allSkills = getSampleSkills();
        renderSkills();
    }
}

// Sample skills data (fallback)
function getSampleSkills() {
    return [
        {
            _id: '1',
            title: 'Web Development (React, Node.js)',
            description: 'I can teach you full-stack web development with modern technologies. Looking to learn graphic design in return.',
            userId: {
                name: 'Priya Sharma',
                avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=6366f1&color=fff&size=150'
            },
            rating: 4.8,
            category: 'tech',
            images: ['https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400'],
            verified: true
        },
        {
            _id: '2',
            title: 'Graphic Design (Adobe Suite)',
            description: 'Expert in Photoshop, Illustrator, and InDesign. Want to learn digital marketing strategies.',
            userId: {
                name: 'Rahul Verma',
                avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=f59e0b&color=fff&size=150'
            },
            rating: 4.9,
            category: 'creative',
            images: ['https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400'],
            verified: true
        },
        {
            _id: '3',
            title: 'Spanish Language (Fluent Speaker)',
            description: 'Native Spanish speaker offering conversational lessons. Interested in learning Python programming.',
            userId: {
                name: 'Ananya Patel',
                avatar: 'https://ui-avatars.com/api/?name=Ananya+Patel&background=10b981&color=fff&size=150'
            },
            rating: 4.7,
            category: 'language',
            images: ['https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400'],
            verified: true
        }
    ];
}

function createSkillCard(skill) {
    const username = skill.userId?.name || 'Anonymous';
    const avatar = skill.userId?.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff';
    const image = skill.images?.[0] || 'https://via.placeholder.com/400x250/6366f1/ffffff?text=Skill';
    const rating = skill.rating || 0;
    const verified = skill.verified || false;

    return `
        <div class="skill-card" data-category="${skill.category}" data-aos="fade-up">
            <img src="${image}" alt="${skill.title}" class="skill-image" loading="lazy">
            <div class="skill-content">
                <div class="skill-header">
                    <img src="${avatar}" alt="${username}" class="skill-avatar">
                    <div class="skill-user">
                        <div class="skill-username">${username}</div>
                        ${verified ? '<span class="skill-badge"><i class="fas fa-check"></i> Verified</span>' : ''}
                    </div>
                </div>
                <h3 class="skill-title">${skill.title}</h3>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-footer">
                    <div class="skill-rating">
                        <i class="fas fa-star"></i>
                        <span>${rating.toFixed(1)}</span>
                    </div>
                    <span class="skill-category">${skill.category}</span>
                </div>
            </div>
        </div>
    `;
}

function renderSkills() {
    if (!skillsGrid) return;

    const filteredSkills = currentFilter === 'all' 
        ? allSkills 
        : allSkills.filter(skill => skill.category === currentFilter);
    
    const skillsToShow = filteredSkills.slice(0, displayedSkills);
    skillsGrid.innerHTML = skillsToShow.map(createSkillCard).join('');
    
    AOS.refresh();
}

// Load skills on page load
if (skillsGrid) {
    fetchSkills();
}

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
        
        if (displayedSkills >= allSkills.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// ===================================
// Testimonials Data & Render
// ===================================
const testimonialsData = [
    {
        name: 'Rajesh Kumar',
        role: 'Software Developer',
        avatar: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=6366f1&color=fff&size=150',
        rating: 5,
        text: 'SwapSkillz changed my life! I learned graphic design from an amazing teacher and taught programming in return.'
    },
    {
        name: 'Meera Iyer',
        role: 'Marketing Manager',
        avatar: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=10b981&color=fff&size=150',
        rating: 5,
        text: 'I mastered Spanish conversation skills while sharing my digital marketing expertise. Highly recommended!'
    },
    {
        name: 'Sanjay Patel',
        role: 'Freelance Designer',
        avatar: 'https://ui-avatars.com/api/?name=Sanjay+Patel&background=f59e0b&color=fff&size=150',
        rating: 4,
        text: 'Great concept! I have connected with multiple learners and teachers. The verification system is trustworthy.'
    }
];

const testimonialsSlider = document.getElementById('testimonialsSlider');

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
    if (!testimonialsSlider) return;
    testimonialsSlider.innerHTML = testimonialsData.map(createTestimonialCard).join('');
}

renderTestimonials();

// Testimonial slider controls
const prevTestimonialBtn = document.getElementById('prevTestimonial');
const nextTestimonialBtn = document.getElementById('nextTestimonial');

if (prevTestimonialBtn && nextTestimonialBtn && testimonialsSlider) {
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
// Authentication - Login & Signup
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
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Switch between modals
if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });
}

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

// Close on ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        loginModal.classList.remove('active');
        signupModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ===================================
// Login Form Submission
// ===================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const result = await apiCall('/auth/login', 'POST', { email, password });
            
            if (result.success) {
                setToken(result.token);
                setUser(result.user);
                showToast('Login successful! Welcome back!', 'success');
                loginModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                loginForm.reset();
                
                // Redirect to dashboard or update UI
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } catch (error) {
            showToast(error.message || 'Login failed', 'error');
        }
    });
}

// ===================================
// Signup Form Submission
// ===================================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }
        
        try {
            const result = await apiCall('/auth/register', 'POST', { name, email, password });
            
            if (result.success) {
                setToken(result.token);
                setUser(result.user);
                showToast('Account created successfully!', 'success');
                signupModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                signupForm.reset();
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        } catch (error) {
            showToast(error.message || 'Registration failed', 'error');
        }
    });
}

// ===================================
// Toast Notification
// ===================================
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast show';
    
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
            // Redirect to browse page with search query
            window.location.href = `browse.html?search=${encodeURIComponent(searchTerm)}`;
        }
    });
    
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
        
        console.log('Newsletter signup:', email);
        showToast('Successfully subscribed to newsletter!', 'success');
        newsletterForm.reset();
    });
}

// ===================================
// Check if User is Logged In
// ===================================
function updateUIForLoggedInUser() {
    const user = getUser();
    const token = getToken();
    
    if (user && token) {
        // Update login button to show user name
        if (loginBtn) {
            loginBtn.textContent = user.name;
            loginBtn.onclick = () => window.location.href = 'dashboard.html';
        }
        
        // Hide signup button
        if (signupBtn) {
            signupBtn.textContent = 'Dashboard';
            signupBtn.onclick = () => window.location.href = 'dashboard.html';
        }
    }
}

// Call on page load
updateUIForLoggedInUser();

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
// Console Welcome Message
// ===================================
console.log('%c👋 Welcome to SwapSkillz!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%c🚀 Backend API: ' + API_URL, 'font-size: 14px; color: #10b981;');
console.log('%c📧 Support: support@swapskillz.com', 'font-size: 12px; color: #6b7280;');