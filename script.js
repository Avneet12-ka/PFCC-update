// Main Navigation and Section Display
document.addEventListener('DOMContentLoaded', function() {
    // Basic navigation functionality
    setupNavigation();
    
    // Initialize progress tracking
    initializeProgressTracking();
    updateProgressBar();
    
    // Welcome modal on first visit
    if (!localStorage.getItem('visitedBefore')) {
        showModal('welcome-modal');
        localStorage.setItem('visitedBefore', 'true');
    }
    
    // Check URL hash for direct navigation
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        showSection(sectionId);
    }
});

// Set up navigation link handling
function setupNavigation() {
    // Direct navigation setup
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1); // Remove the # from the href
            
            showSection(sectionId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active', 'border-blue-700'));
            navLinks.forEach(l => l.classList.add('border-transparent'));
            this.classList.add('active', 'border-blue-700');
            this.classList.remove('border-transparent');
        });
    });
    
    // Start Learning button
    const startLearningBtn = document.querySelector('button[onclick="showSection(\'lectures\')"]');
    if (startLearningBtn) {
        startLearningBtn.removeAttribute('onclick');
        startLearningBtn.addEventListener('click', function() {
            showSection('lectures');
        });
    }
    
    // Lecture buttons
    document.querySelectorAll('button[onclick*="showLecture"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/showLecture\((\d+)\)/);
        if (match) {
            const lectureId = parseInt(match[1]);
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                showLecture(lectureId);
            });
        }
    });
    
    // Case study buttons
    document.querySelectorAll('button[onclick*="showCaseStudy"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/showCaseStudy\((\d+)\)/);
        if (match) {
            const caseId = parseInt(match[1]);
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                showCaseStudy(caseId);
            });
        }
    });
}

// Show a specific section and hide others
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.container.mx-auto.px-4.py-8 > section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Special handling for certain sections
        if (sectionId === 'quizzes' && typeof initializeCurrentQuiz === 'function') {
            initializeCurrentQuiz();
        } else if (sectionId === 'interactive-game' && typeof loadScenario === 'function') {
            loadScenario(0);
        }
    }
    
    // Update URL hash without scrolling
    history.replaceState(null, null, '#' + sectionId);
}

// Progress tracking functions
function initializeProgressTracking() {
    // Implementation kept minimal for basic functionality
    updateProgressBar();
}

function updateProgressBar() {
    // Just set a minimal progress for now
    document.getElementById('progress-fill').style.width = '10%';
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Lecture Functions
function showLecture(lectureNum) {
    console.log('Showing lecture:', lectureNum);
    
    // Hide all lecture slides
    const lectureSlides = document.querySelectorAll('.lecture-slides');
    lectureSlides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Show selected lecture
    const lectureElement = document.getElementById('lecture' + lectureNum);
    if (lectureElement) {
        lectureElement.style.display = 'block';
        
        // Reset to first slide
        const slides = lectureElement.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }
    }
}

// Case Study Functions
function showCaseStudy(caseNum) {
    console.log('Showing case study:', caseNum);
    
    // Hide all case studies
    const caseStudies = document.querySelectorAll('.case-study');
    caseStudies.forEach(caseStudy => {
        caseStudy.style.display = 'none';
    });
    
    // Show selected case study
    const caseStudy = document.getElementById('case-study' + caseNum);
    if (caseStudy) {
        caseStudy.style.display = 'block';
    }
}

// Initialize any other modal close buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('button[onclick*="closeModal"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/closeModal\(['"]([^'"]+)['"]\)/);
        if (match) {
            const modalId = match[1];
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                closeModal(modalId);
            });
        }
    });
});
