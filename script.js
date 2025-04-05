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
    
    // Mark as complete buttons
    document.querySelectorAll('button[onclick*="markLectureComplete"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/markLectureComplete\((\d+)\)/);
        if (match) {
            const lectureId = parseInt(match[1]);
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                markLectureComplete(lectureId);
            });
        }
    });
    
    document.querySelectorAll('button[onclick*="markCaseStudyComplete"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/markCaseStudyComplete\((\d+)\)/);
        if (match) {
            const caseId = parseInt(match[1]);
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                markCaseStudyComplete(caseId);
            });
        }
    });
    
    // Handle slide navigation
    document.querySelectorAll('[onclick*="prevSlide"], [onclick*="nextSlide"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/(prev|next)Slide\(['"]([^'"]+)['"]\)/);
        if (match) {
            const action = match[1]; // "prev" or "next"
            const lectureId = match[2];
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                if (action === 'prev') {
                    prevSlide(lectureId);
                } else {
                    nextSlide(lectureId);
                }
            });
        }
    });
    
    // Handle goToSlide functions
    document.querySelectorAll('[onclick*="goToSlide"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/goToSlide\((\d+),\s*['"]([^'"]+)['"]\)/);
        if (match) {
            const slideNum = parseInt(match[1]);
            const lectureId = match[2];
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                goToSlide(slideNum, lectureId);
            });
        }
    });
    
    // Quiz buttons
    document.querySelectorAll('button[onclick*="selectQuiz"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/selectQuiz\((\d+)\)/);
        if (match) {
            const quizId = parseInt(match[1]);
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                selectQuiz(quizId);
            });
        }
    });
    
    // Certificate generation
    const certBtn = document.querySelector('button[onclick*="generateCertificate"]');
    if (certBtn) {
        certBtn.removeAttribute('onclick');
        certBtn.addEventListener('click', function() {
            generateCertificate();
        });
    }
    
    // Print certificate
    const printBtn = document.querySelector('button[onclick*="printCertificate"]');
    if (printBtn) {
        printBtn.removeAttribute('onclick');
        printBtn.addEventListener('click', function() {
            printCertificate();
        });
    }
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
        if (sectionId === 'quizzes') {
            // Initialize quiz display
            document.getElementById('quiz-selector-container').style.display = 'block';
            document.getElementById('quiz-container').style.display = 'none';
            document.getElementById('quiz-results').style.display = 'none';
        } else if (sectionId === 'interactive-game' && typeof loadScenario === 'function') {
            loadScenario(0);
        }
    }
    
    // Update URL hash without scrolling
    history.replaceState(null, null, '#' + sectionId);
}

// Progress tracking functions
function initializeProgressTracking() {
    // Retrieve progress from localStorage if available
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    // Update lecture completion indicators
    for (const lectureId in lectureProgress) {
        if (lectureProgress[lectureId].completed) {
            const lectureBtn = document.querySelector(`button[onclick*="showLecture(${lectureId})"]`);
            if (lectureBtn && !lectureBtn.innerHTML.includes('fa-check-circle')) {
                lectureBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
            }
        }
    }
    
    // Update case study completion indicators
    for (const caseId in caseProgress) {
        if (caseProgress[caseId].completed) {
            const caseBtn = document.querySelector(`button[onclick*="showCaseStudy(${caseId})"]`);
            if (caseBtn && !caseBtn.innerHTML.includes('fa-check-circle')) {
                caseBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
            }
        }
    }
    
    // Update quiz completion indicators
    for (const quizId in quizProgress) {
        if (quizProgress[quizId].completed) {
            const quizBtn = document.querySelector(`.quiz-selector[data-quiz="${quizId}"]`);
            if (quizBtn && !quizBtn.innerHTML.includes('fa-check-circle')) {
                quizBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
            }
        }
    }
    
    // Check if certificate can be enabled
    checkCertificateEligibility();
}

function updateProgressBar() {
    // Calculate progress based on completed items
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    // Count completed items
    const lecturesCompleted = Object.values(lectureProgress).filter(item => item.completed).length;
    const casesCompleted = Object.values(caseProgress).filter(item => item.completed).length;
    const quizzesCompleted = Object.values(quizProgress).filter(item => item.completed).length;
    const gameCompleted = gameProgress.completed ? 1 : 0;
    
    // Calculate percentage (16 total items - 5 lectures, 5 case studies, 5 quizzes, 1 game)
    const totalItems = 16;
    const completedItems = lecturesCompleted + casesCompleted + quizzesCompleted + gameCompleted;
    const progressPercentage = (completedItems / totalItems) * 100;
    
    // Update progress bar
    document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    
    // Check if certificate can be enabled
    checkCertificateEligibility();
}

function checkCertificateEligibility() {
    const certificateBtn = document.getElementById('view-certificate-button');
    if (!certificateBtn) return;
    
    // Count completed items
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    const lecturesCompleted = Object.values(lectureProgress).filter(item => item.completed).length;
    const casesCompleted = Object.values(caseProgress).filter(item => item.completed).length;
    const quizzesCompleted = Object.values(quizProgress).filter(item => item.completed).length;
    const gameCompleted = gameProgress.completed ? 1 : 0;
    
    // Enable certificate if all required items are completed
    const allCompleted = (lecturesCompleted >= 5) && (casesCompleted >= 5) && (quizzesCompleted >= 5) && gameCompleted;
    
    if (allCompleted) {
        certificateBtn.disabled = false;
        certificateBtn.classList.remove('cursor-not-allowed', 'text-gray-400');
        certificateBtn.classList.add('hover:bg-blue-800');
    } else {
        certificateBtn.disabled = true;
        certificateBtn.classList.add('cursor-not-allowed', 'text-gray-400');
        certificateBtn.classList.remove('hover:bg-blue-800');
    }
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
        
        // Update current slide counter
        const currentSlideSpan = document.getElementById('current-slide-lecture' + lectureNum);
        if (currentSlideSpan) {
            currentSlideSpan.textContent = '1';
        }
        
        // Scroll to the lecture
        lectureElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function goToSlide(slideNum, lectureId) {
    const lecture = document.getElementById(lectureId);
    if (!lecture) return;
    
    const slides = lecture.querySelectorAll('.slide');
    const slideDots = lecture.querySelectorAll('.slide-dot');
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    slideDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show the selected slide
    if (slides.length >= slideNum) {
        slides[slideNum - 1].classList.add('active');
    }
    
    // Update the active dot
    if (slideDots.length >= slideNum) {
        slideDots[slideNum - 1].classList.add('active');
    }
    
    // Update current slide counter
    const currentSlideSpan = document.getElementById('current-slide-' + lectureId);
    if (currentSlideSpan) {
        currentSlideSpan.textContent = slideNum;
    }
}

function nextSlide(lectureId) {
    const lecture = document.getElementById(lectureId);
    if (!lecture) return;
    
    const slides = lecture.querySelectorAll('.slide');
    const currentSlideSpan = document.getElementById('current-slide-' + lectureId);
    
    let currentSlide = 1;
    if (currentSlideSpan) {
        currentSlide = parseInt(currentSlideSpan.textContent);
    }
    
    if (currentSlide < slides.length) {
        goToSlide(currentSlide + 1, lectureId);
    }
}

function prevSlide(lectureId) {
    const lecture = document.getElementById(lectureId);
    if (!lecture) return;
    
    const currentSlideSpan = document.getElementById('current-slide-' + lectureId);
    
    let currentSlide = 1;
    if (currentSlideSpan) {
        currentSlide = parseInt(currentSlideSpan.textContent);
    }
    
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1, lectureId);
    }
}

function markLectureComplete(lectureId) {
    console.log('Marking lecture complete:', lectureId);
    
    // Save completion status to localStorage
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    lectureProgress[lectureId] = {
        completed: true,
        completionDate: new Date().toISOString()
    };
    localStorage.setItem('lectureProgress', JSON.stringify(lectureProgress));
    
    // Add visual indicator to the lecture button
    const lectureBtn = document.querySelector(`button[onclick*="showLecture(${lectureId})"]`);
    if (lectureBtn && !lectureBtn.innerHTML.includes('fa-check-circle')) {
        lectureBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
    }
    
    // Update progress
    updateProgressBar();
    
    // Show completion modal
    showModal('lecture-completed-modal');
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
        
        // Scroll to the case study
        caseStudy.scrollIntoView({ behavior: 'smooth' });
    }
}

function markCaseStudyComplete(caseId) {
    console.log('Marking case study complete:', caseId);
    
    // Save completion status to localStorage
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    caseProgress[caseId] = {
        completed: true,
        completionDate: new Date().toISOString()
    };
    localStorage.setItem('caseProgress', JSON.stringify(caseProgress));
    
    // Add visual indicator to the case study button
    const caseBtn = document.querySelector(`button[onclick*="showCaseStudy(${caseId})"]`);
    if (caseBtn && !caseBtn.innerHTML.includes('fa-check-circle')) {
        caseBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
    }
    
    // Update progress
    updateProgressBar();
    
    // Show completion modal
    showModal('case-completed-modal');
}

// Quiz Functions
function selectQuiz(quizId) {
    console.log('Starting quiz:', quizId);
    
    // Show the quiz container and hide the selector
    document.getElementById('quiz-selector-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    
    // Set quiz title based on quizId
    const titles = {
        1: "Quiz 1: Foundations of PFCC",
        2: "Quiz 2: PFCC Core Principles",
        3: "Quiz 3: Communication Skills for PFCC",
        4: "Quiz 4: System Design for PFCC",
        5: "Quiz 5: Measuring PFCC Outcomes"
    };
    
    document.getElementById('quiz-title').textContent = titles[quizId] || `Quiz ${quizId}`;
    
    // Set question text
    document.getElementById('question-text').textContent = `This is a sample question for Quiz ${quizId}. In a real quiz, this would be a substantive question about PFCC principles.`;
    
    // For demonstration purposes - you'd need to replace with actual quiz data
    const options = [
        "Sample answer option 1 - This would be a possible answer to the PFCC question.",
        "Sample answer option 2 - Another potential response to consider.",
        "Sample answer option 3 - Yet another choice for the question.",
        "Sample answer option 4 - The final option to choose from."
    ];
    
    // Set current question indicator
    document.getElementById('current-question').textContent = '1';
    document.getElementById('total-questions').textContent = '5';
    
    // Generate options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.setAttribute('data-index', index);
        optionDiv.onclick = function() {
            // Handle option selection
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Show feedback for demo purposes
            const feedback = document.getElementById('quiz-feedback');
            feedback.textContent = "Good choice! This demonstrates how feedback would appear after selecting an answer.";
            feedback.className = 'quiz-feedback correct';
            feedback.style.display = 'block';
            
            // Show next question button
            document.getElementById('next-question-btn').style.display = 'inline-block';
        };
        optionsContainer.appendChild(optionDiv);
    });
}

function nextQuestion() {
    // For demonstration - would show quiz results after answering questions
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    // Set sample results
    document.getElementById('quiz-score').textContent = '4';
    document.getElementById('quiz-total').textContent = '5';
    document.getElementById('quiz-percentage').textContent = '80%';
    document.getElementById('quiz-message').textContent = 'Great job! You have a good understanding of PFCC principles.';
    
    // Mark quiz as completed
    const quizId = 1; // This would be dynamic in a real implementation
    markQuizComplete(quizId, 80);
}

function markQuizComplete(quizId, score) {
    // Save completion status to localStorage
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    quizProgress[quizId] = {
        completed: true,
        score: score,
        completionDate: new Date().toISOString()
    };
    localStorage.setItem('quizProgress', JSON.stringify(quizProgress));
    
    // Add visual indicator to the quiz button
    const quizBtn = document.querySelector(`.quiz-selector[data-quiz="${quizId}"]`);
    if (quizBtn && !quizBtn.innerHTML.includes('fa-check-circle')) {
        quizBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
    }
    
    // Update progress
    updateProgressBar();
}

function resetQuiz() {
    // Show quiz selector again
    document.getElementById('quiz-selector-container').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
}

// Resource Functions
function downloadResource(resourceName) {
    // For demonstration purposes only
    alert(`In a production environment, this would download the file: ${resourceName}`);
    // In a real implementation, this would trigger a file download
}

// Certificate Functions
function generateCertificate() {
    // Get participant name
    const participantName = document.getElementById('participant-name').value;
    if (!participantName) {
        alert('Please enter your name for the certificate');
        return;
    }
    
    // Set certificate details
    document.getElementById('certificate-name').textContent = participantName;
    document.getElementById('certificate-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Show certificate modal
    showModal('certificate-modal');
}

function printCertificate() {
    // Create a printable version in a new window
    const certificateContent = document.getElementById('certificate-modal').querySelector('.bg-white').outerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>PFCC Course Certificate</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .certificate { border: 20px solid #1a56db; padding: 40px; text-align: center; }
                .signature-name { margin-bottom: 0.5rem; border-bottom: 1px solid #2d3748; padding-bottom: 0.5rem; }
            </style>
        </head>
        <body>
            ${certificateContent}
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
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
