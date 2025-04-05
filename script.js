// Main Navigation and Section Display
document.addEventListener('DOMContentLoaded', function() {
    // Set up all navigation and UI interactions
    setupEventListeners();
    
    // Initialize progress tracking
    initializeProgress();
    
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

// Set up all event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1); // Remove the # from the href
            showSection(sectionId);
        });
    });
    
    // Set up "Start Learning" button
    const startLearningBtn = document.querySelector('button[onclick="showSection(\'lectures\')"]');
    if (startLearningBtn) {
        startLearningBtn.removeAttribute('onclick');
        startLearningBtn.addEventListener('click', function() {
            showSection('lectures');
        });
    }
    
    // Return to home buttons
    document.querySelectorAll('button[onclick="showSection(\'home\')"]').forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function() {
            showSection('home');
        });
    });
    
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
    
    // Quiz buttons
    document.querySelectorAll('button[onclick*="selectQuiz"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/selectQuiz\((\d+)\)/);
        if (match) {
            const quizId = parseInt(match[1]);
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                startQuiz(quizId);
            });
        }
    });
    
    // Next question button
    const nextQuestionBtn = document.getElementById('next-question-btn');
    if (nextQuestionBtn) {
        nextQuestionBtn.removeAttribute('onclick');
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }
    
    // Reset quiz button
    document.querySelectorAll('button[onclick*="resetQuiz"]').forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', resetQuiz);
    });
    
    // Slide navigation
    document.querySelectorAll('button[onclick*="prevSlide"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/prevSlide\(['"]([^'"]+)['"]\)/);
        if (match) {
            const lectureId = match[1];
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                prevSlide(lectureId);
            });
        }
    });
    
    document.querySelectorAll('button[onclick*="nextSlide"]').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/nextSlide\(['"]([^'"]+)['"]\)/);
        if (match) {
            const lectureId = match[1];
            btn.removeAttribute('onclick');
            btn.addEventListener('click', function() {
                nextSlide(lectureId);
            });
        }
    });
    
    // Slide dots
    document.querySelectorAll('span[onclick*="goToSlide"]').forEach(span => {
        const match = span.getAttribute('onclick').match(/goToSlide\((\d+),\s*['"]([^'"]+)['"]\)/);
        if (match) {
            const slideNum = parseInt(match[1]);
            const lectureId = match[2];
            span.removeAttribute('onclick');
            span.addEventListener('click', function() {
                goToSlide(slideNum, lectureId);
            });
        }
    });
    
    // Mark lecture complete buttons
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
    
    // Mark case study complete buttons
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
    
    // Modal close buttons
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
    
    // Certificate generation
    const certBtn = document.getElementById('view-certificate-button');
    if (certBtn) {
        certBtn.removeAttribute('onclick');
        certBtn.addEventListener('click', generateCertificate);
    }
    
    // Print certificate
    const printBtn = document.querySelector('button[onclick*="printCertificate"]');
    if (printBtn) {
        printBtn.removeAttribute('onclick');
        printBtn.addEventListener('click', printCertificate);
    }
    
    // Resource downloads
    document.querySelectorAll('.resource-actions a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const resourceName = this.closest('.resource-content').querySelector('.resource-title').textContent;
            downloadResource(resourceName);
        });
    });
}

// Show a section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.container.mx-auto.px-4.py-8 > section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        
        // Special section handling
        if (sectionId === 'interactive-game' && typeof loadScenario === 'function') {
            loadScenario(0);
        } else if (sectionId === 'quizzes') {
            document.getElementById('quiz-selector-container').style.display = 'block';
            document.getElementById('quiz-container').style.display = 'none';
            document.getElementById('quiz-results').style.display = 'none';
        }
    }
    
    // Update active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'border-blue-700');
        link.classList.add('border-transparent');
        
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active', 'border-blue-700');
            link.classList.remove('border-transparent');
        }
    });
    
    // Update URL without scrolling
    history.replaceState(null, null, '#' + sectionId);
}

// Show a lecture
function showLecture(lectureNum) {
    // Hide all lectures
    document.querySelectorAll('.lecture-slides').forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Show selected lecture
    const lecture = document.getElementById('lecture' + lectureNum);
    if (lecture) {
        lecture.style.display = 'block';
        
        // Reset to first slide
        const slides = lecture.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        if (slides.length > 0) {
            slides[0].classList.add('active');
        }
        
        // Reset slide counter
        const currentSlideSpan = document.getElementById('current-slide-lecture' + lectureNum);
        if (currentSlideSpan) {
            currentSlideSpan.textContent = '1';
        }
        
        // Reset dot navigation
        const slideDots = lecture.querySelectorAll('.slide-dot');
        slideDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
        
        // Scroll to the lecture
        lecture.scrollIntoView({ behavior: 'smooth' });
    }
}

// Slide navigation functions
function goToSlide(slideNum, lectureId) {
    const lecture = document.getElementById(lectureId);
    if (!lecture) return;
    
    // Get slides and dots
    const slides = lecture.querySelectorAll('.slide');
    const slideDots = lecture.querySelectorAll('.slide-dot');
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Deactivate all dots
    slideDots.forEach(dot => dot.classList.remove('active'));
    
    // Show the selected slide (1-based index)
    if (slides.length >= slideNum) {
        slides[slideNum - 1].classList.add('active');
    }
    
    // Activate the corresponding dot
    if (slideDots.length >= slideNum) {
        slideDots[slideNum - 1].classList.add('active');
    }
    
    // Update slide counter
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
    
    if (!currentSlideSpan) return;
    
    const currentSlide = parseInt(currentSlideSpan.textContent);
    
    if (currentSlide < slides.length) {
        goToSlide(currentSlide + 1, lectureId);
    }
}

function prevSlide(lectureId) {
    const lecture = document.getElementById(lectureId);
    if (!lecture) return;
    
    const currentSlideSpan = document.getElementById('current-slide-' + lectureId);
    
    if (!currentSlideSpan) return;
    
    const currentSlide = parseInt(currentSlideSpan.textContent);
    
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1, lectureId);
    }
}

// Show a case study
function showCaseStudy(caseNum) {
    // Hide all case studies
    document.querySelectorAll('.case-study').forEach(cs => {
        cs.style.display = 'none';
    });
    
    // Show selected case study
    const caseStudy = document.getElementById('case-study' + caseNum);
    if (caseStudy) {
        caseStudy.style.display = 'block';
        caseStudy.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// Progress tracking
function initializeProgress() {
    // Load saved progress
    updateProgressBar();
    
    // Update completion indicators
    updateCompletionIndicators();
    
    // Check certificate eligibility
    checkCertificateEligibility();
}

function updateProgressBar() {
    // Get progress data
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    // Count completed items
    const completedLectures = Object.values(lectureProgress).filter(item => item.completed).length;
    const completedCases = Object.values(caseProgress).filter(item => item.completed).length;
    const completedQuizzes = Object.values(quizProgress).filter(item => item.completed).length;
    const gameCompleted = gameProgress.completed ? 1 : 0;
    
    // Calculate percentage
    const totalItems = 16; // 5 lectures + 5 case studies + 5 quizzes + 1 game
    const completedItems = completedLectures + completedCases + completedQuizzes + gameCompleted;
    const progress = Math.min(100, Math.round((completedItems / totalItems) * 100));
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
}

function updateCompletionIndicators() {
    // Get progress data
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    
    // Update lecture indicators
    for (const lectureId in lectureProgress) {
        if (lectureProgress[lectureId].completed) {
            const lectureBtn = document.querySelector(`button[onclick*="showLecture(${lectureId})"]`);
            if (lectureBtn && !lectureBtn.innerHTML.includes('fa-check-circle')) {
                lectureBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
            }
        }
    }
    
    // Update case study indicators
    for (const caseId in caseProgress) {
        if (caseProgress[caseId].completed) {
            const caseBtn = document.querySelector(`button[onclick*="showCaseStudy(${caseId})"]`);
            if (caseBtn && !caseBtn.innerHTML.includes('fa-check-circle')) {
                caseBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
            }
        }
    }
    
    // Update quiz indicators
    for (const quizId in quizProgress) {
        if (quizProgress[quizId].completed) {
            const quizBtn = document.querySelector(`.quiz-selector[data-quiz="${quizId}"]`);
            if (quizBtn && !quizBtn.innerHTML.includes('fa-check-circle')) {
                quizBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
            }
        }
    }
}

function checkCertificateEligibility() {
    const certificateBtn = document.getElementById('view-certificate-button');
    if (!certificateBtn) return;
    
    // Get progress data
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    // Count completed items
    const completedLectures = Object.values(lectureProgress).filter(item => item.completed).length;
    const completedCases = Object.values(caseProgress).filter(item => item.completed).length;
    const completedQuizzes = Object.values(quizProgress).filter(item => item.completed).length;
    const gameCompleted = gameProgress.completed ? true : false;
    
    // Check if all required items are completed
    const allCompleted = (completedLectures >= 5 && completedCases >= 5 && completedQuizzes >= 5 && gameCompleted);
    
    // Enable/disable certificate button
    if (allCompleted) {
        certificateBtn.disabled = false;
        certificateBtn.classList.remove('cursor-not-allowed', 'text-gray-400');
        certificateBtn.classList.add('text-white');
    } else {
        certificateBtn.disabled = true;
        certificateBtn.classList.add('cursor-not-allowed', 'text-gray-400');
        certificateBtn.classList.remove('text-white');
    }
}

// Completion tracking
function markLectureComplete(lectureId) {
    // Save to localStorage
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    lectureProgress[lectureId] = {
        completed: true,
        completionDate: new Date().toISOString()
    };
    localStorage.setItem('lectureProgress', JSON.stringify(lectureProgress));
    
    // Add visual indicator
    const lectureBtn = document.querySelector(`button[onclick*="showLecture(${lectureId})"]`);
    if (lectureBtn && !lectureBtn.innerHTML.includes('fa-check-circle')) {
        lectureBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
    }
    
    // Update progress
    updateProgressBar();
    checkCertificateEligibility();
    
    // Show completion modal
    showModal('lecture-completed-modal');
}

function markCaseStudyComplete(caseId) {
    // Save to localStorage
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    caseProgress[caseId] = {
        completed: true,
        completionDate: new Date().toISOString()
    };
    localStorage.setItem('caseProgress', JSON.stringify(caseProgress));
    
    // Add visual indicator
    const caseBtn = document.querySelector(`button[onclick*="showCaseStudy(${caseId})"]`);
    if (caseBtn && !caseBtn.innerHTML.includes('fa-check-circle')) {
        caseBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
    }
    
    // Update progress
    updateProgressBar();
    checkCertificateEligibility();
    
    // Show completion modal
    showModal('case-completed-modal');
}

// Quiz functionality
const quizData = {
    1: {
        title: "Quiz 1: Foundations of PFCC",
        questions: [
            {
                question: "Which of the following best defines Patient and Family-Centered Care?",
                options: [
                    "A model where healthcare providers make all decisions for patients",
                    "An approach to healthcare that forms partnerships among practitioners, patients, and families",
                    "A system where family members take primary responsibility for patient care",
                    "A method focused exclusively on patient autonomy and independence"
                ],
                correctAnswer: 1,
                explanation: "PFCC is defined as an approach to the planning, delivery, and evaluation of healthcare that forms mutually beneficial partnerships among patients, families, and healthcare practitioners."
            },
            {
                question: "Which is NOT one of the four core principles of PFCC?",
                options: [
                    "Dignity and Respect",
                    "Information Sharing",
                    "Cost Efficiency",
                    "Participation"
                ],
                correctAnswer: 2,
                explanation: "The four core principles of PFCC are Dignity and Respect, Information Sharing, Participation, and Collaboration. While cost efficiency may be a positive outcome of PFCC, it is not one of the core principles."
            },
            {
                question: "How does PFCC define 'family'?",
                options: [
                    "Biological relatives only",
                    "Legally recognized next-of-kin",
                    "Anyone the patient considers part of their support system",
                    "Parents, siblings, and children"
                ],
                correctAnswer: 2,
                explanation: "In PFCC, family is defined by the patient. Family members are individuals who are related in any way—biologically, legally, or emotionally. Patients define their 'family' and determine how they will participate in care and decision-making."
            },
            {
                question: "What organization was established in 1992 to advance the understanding and practice of PFCC?",
                options: [
                    "The World Health Organization (WHO)",
                    "The Institute for Patient- and Family-Centered Care (IPFCC)",
                    "The Centers for Disease Control and Prevention (CDC)",
                    "The Joint Commission on Accreditation of Healthcare Organizations"
                ],
                correctAnswer: 1,
                explanation: "The Institute for Patient- and Family-Centered Care (IPFCC) was established in 1992 (initially as the Institute for Family-Centered Care) to advance the understanding and practice of patient and family-centered care."
            },
            {
                question: "Which benefit has NOT been documented as an outcome of implementing PFCC approaches?",
                options: [
                    "Improved clinical outcomes",
                    "Decreased readmission rates",
                    "Increased healthcare costs",
                    "Enhanced patient satisfaction"
                ],
                correctAnswer: 2,
                explanation: "Research has actually shown that PFCC approaches can lead to decreased healthcare costs through reduced readmissions, more efficient resource utilization, and improved outcomes."
            }
        ]
    },
    2: {
        title: "Quiz 2: PFCC Core Principles",
        questions: [
            {
                question: "Which PFCC principle involves honoring patient and family perspectives and choices?",
                options: [
                    "Information Sharing",
                    "Dignity and Respect",
                    "Participation",
                    "Collaboration"
                ],
                correctAnswer: 1,
                explanation: "Dignity and Respect involves listening to and honoring patient and family perspectives and choices, and incorporating their knowledge, values, beliefs, and cultural backgrounds into care planning and delivery."
            },
            {
                question: "What does the 'Information Sharing' principle of PFCC emphasize?",
                options: [
                    "Restricting information to prevent overwhelming patients",
                    "Communicating only positive information to reduce anxiety",
                    "Sharing complete and unbiased information in ways that are affirming and useful",
                    "Providing technical information primarily to family members"
                ],
                correctAnswer: 2,
                explanation: "Information Sharing emphasizes communicating complete and unbiased information with patients and families in ways that are affirming and useful, enabling them to effectively participate in care and decision-making."
            },
            {
                question: "How is the 'Participation' principle best implemented in PFCC?",
                options: [
                    "Having patients sign consent forms for all procedures",
                    "Encouraging and supporting patients and families to participate in care and decision-making at the level they choose",
                    "Requiring family members to participate in direct care activities",
                    "Having patients make all decisions independently"
                ],
                correctAnswer: 1,
                explanation: "The Participation principle is best implemented by encouraging and supporting patients and families to participate in care and decision-making at the level they choose, respecting their preferences for involvement."
            },
            {
                question: "Which of the following is an example of the 'Collaboration' principle in PFCC?",
                options: [
                    "A nurse explaining medication instructions to a patient",
                    "A physician making rounds with residents",
                    "A hospital including patient and family advisors on quality improvement committees",
                    "A clinic sending satisfaction surveys to patients"
                ],
                correctAnswer: 2,
                explanation: "Including patient and family advisors on quality improvement committees exemplifies the Collaboration principle, which involves patients, families, healthcare practitioners, and leaders working together in policy and program development, implementation, and evaluation."
            },
            {
                question: "Which statement best reflects the application of PFCC principles in pediatric care?",
                options: [
                    "Parents should be present only during visiting hours",
                    "Medical decisions should be made exclusively by healthcare professionals",
                    "Parents should be viewed as valuable members of the care team",
                    "Children should be excluded from discussions about their care"
                ],
                correctAnswer: 2,
                explanation: "Viewing parents as valuable members of the care team reflects PFCC principles in pediatric care, recognizing that parents know their children best and have insights that can improve care quality and outcomes."
            }
        ]
    },
    3: {
        title: "Quiz 3: Communication Skills for PFCC",
        questions: [
            {
                question: "Which communication technique is most effective for ensuring patient understanding?",
                options: [
                    "Using medical terminology for precision",
                    "Providing detailed written materials",
                    "Using teach-back methods to confirm understanding",
                    "Speaking slowly and loudly"
                ],
                correctAnswer: 2,
                explanation: "Teach-back methods, where providers ask patients to explain information in their own words, are most effective for ensuring understanding as they identify and address misunderstandings immediately."
            },
            {
                question: "What is the primary purpose of active listening in PFCC?",
                options: [
                    "To document patient complaints accurately",
                    "To understand the patient's perspective and concerns",
                    "To identify non-compliance with treatment plans",
                    "To save time during patient encounters"
                ],
                correctAnswer: 1,
                explanation: "The primary purpose of active listening in PFCC is to understand the patient's perspective and concerns, demonstrating respect and building trust while ensuring that care decisions incorporate the patient's values and preferences."
            },
            {
                question: "How should healthcare providers best address language barriers in PFCC?",
                options: [
                    "Speak louder and use simple language",
                    "Have family members interpret medical information",
                    "Use professional interpreter services",
                    "Provide written materials in English only"
                ],
                correctAnswer: 2,
                explanation: "Professional interpreter services should be used to address language barriers, as they ensure accurate translation of medical information while avoiding the potential complications of using family members as interpreters."
            },
            {
                question: "Which approach best supports shared decision-making in PFCC?",
                options: [
                    "The provider presenting a single recommended option",
                    "Presenting all options with their benefits, risks, and uncertainties",
                    "The family making decisions without provider input",
                    "Deferring decisions to other specialists"
                ],
                correctAnswer: 1,
                explanation: "Presenting all options with their benefits, risks, and uncertainties best supports shared decision-making, as it provides patients and families with the information they need to make informed choices aligned with their values and preferences."
            },
            {
                question: "Which communication approach is most aligned with PFCC principles when delivering difficult news?",
                options: [
                    "Delivering information quickly to minimize distress",
                    "Using euphemisms to soften the impact",
                    "Creating a private setting and allowing time for questions and emotional responses",
                    "Having the most junior team member deliver the news"
                ],
                correctAnswer: 2,
                explanation: "Creating a private setting and allowing time for questions and emotional responses when delivering difficult news aligns with PFCC principles of dignity, respect, and information sharing."
            }
        ]
    },
    4: {
        title: "Quiz 4: System Design for PFCC",
        questions: [
            {
                question: "Which of the following organizational policies best supports PFCC?",
                options: [
                    "Restricted visiting hours to ensure patient rest",
                    "Flexible family presence policies based on patient preferences",
                    "No visitors during provider rounds",
                    "Family access limited to designated hours"
                ],
                correctAnswer: 1,
                explanation: "Flexible family presence policies based on patient preferences best support PFCC by respecting patient choice and recognizing the important role of families in patient care and recovery."
            },
            {
                question: "What physical environment feature best facilitates PFCC?",
                options: [
                    "Centralized nursing stations for efficient monitoring",
                    "Shared patient rooms to promote socialization",
                    "Private meeting spaces for family conversations with healthcare team",
                    "Minimal seating in patient rooms to reduce clutter"
                ],
                correctAnswer: 2,
                explanation: "Private meeting spaces for family conversations with the healthcare team facilitate PFCC by supporting confidential information sharing and collaborative decision-making in a comfortable environment."
            },
            {
                question: "How do Patient and Family Advisory Councils (PFACs) support PFCC implementation?",
                options: [
                    "By handling patient complaints",
                    "By providing input on policies, programs, and facility design",
                    "By fundraising for hospital improvements",
                    "By representing hospital administration to patients"
                ],
                correctAnswer: 1,
                explanation: "PFACs support PFCC implementation by providing meaningful input on policies, programs, and facility design, bringing the patient and family perspective to organizational decision-making."
            },
            {
                question: "Which approach to documentation best supports PFCC principles?",
                options: [
                    "Restricting patient access to their medical records",
                    "Using technical language to ensure precision",
                    "Open notes that patients can access and understand",
                    "Separate documentation systems for different providers"
                ],
                correctAnswer: 2,
                explanation: "Open notes that patients can access and understand support PFCC principles of information sharing and transparency, enabling patients to be more informed and engaged in their care."
            },
            {
                question: "What organizational approach best supports staff in implementing PFCC?",
                options: [
                    "Strict productivity metrics focusing on number of patients seen",
                    "Disciplinary action for staff who don't comply with PFCC guidelines",
                    "Dedicated time, training, and recognition for PFCC practices",
                    "Assigning PFCC responsibilities to a designated department"
                ],
                correctAnswer: 2,
                explanation: "Dedicated time, training, and recognition for PFCC practices best supports staff implementation by acknowledging the resources needed to practice PFCC and reinforcing its importance as an organizational priority."
            }
        ]
    },
    5: {
        title: "Quiz 5: Measuring PFCC Outcomes",
        questions: [
            {
                question: "Which measure best evaluates the 'dignity and respect' principle of PFCC?",
                options: [
                    "Number of patient complaints filed",
                    "Patient reports of feeling their values and preferences were honored",
                    "Staff adherence to dress code policies",
                    "Patient length of stay"
                ],
                correctAnswer: 1,
                explanation: "Patient reports of feeling their values and preferences were honored directly measures the experience of dignity and respect from the patient perspective, which is the essence of this PFCC principle."
            },
            {
                question: "What is the most effective approach to measuring PFCC implementation?",
                options: [
                    "Focusing exclusively on patient satisfaction scores",
                    "Measuring only clinical outcomes like readmission rates",
                    "Using a balanced set of process, outcome, and experience measures",
                    "Comparing financial performance before and after PFCC implementation"
                ],
                correctAnswer: 2,
                explanation: "A balanced set of process, outcome, and experience measures provides comprehensive evaluation of PFCC implementation, capturing both the 'how' (processes), the 'what' (outcomes), and the lived experience of care."
            },
            {
                question: "Which data collection method provides the most comprehensive information about patient experiences?",
                options: [
                    "Standardized patient satisfaction surveys",
                    "Medical record audits",
                    "Combination of quantitative surveys and qualitative patient narratives",
                    "Staff reports of patient interactions"
                ],
                correctAnswer: 2,
                explanation: "A combination of quantitative surveys and qualitative patient narratives provides the most comprehensive information, capturing both measurable data points and the rich context and nuance of patient experiences."
            },
            {
                question: "What is the most effective way to use PFCC measurement data?",
                options: [
                    "Publishing results in annual reports",
                    "Using data to identify and address specific improvement opportunities",
                    "Comparing performance to national benchmarks",
                    "Focusing on measures where performance is already strong"
                ],
                correctAnswer: 1,
                explanation: "Using data to identify and address specific improvement opportunities creates a continuous improvement cycle, transforming measurement from a passive activity into an active driver of better care."
            },
            {
                question: "Which stakeholders should be involved in designing PFCC measurement approaches?",
                options: [
                    "Quality improvement staff only",
                    "Executive leadership only",
                    "Clinical staff only",
                    "Patients, families, staff, and leadership together"
                ],
                correctAnswer: 3,
                explanation: "Including patients, families, staff, and leadership in measurement design ensures that metrics reflect what matters to all stakeholders and embodies the PFCC principle of collaboration."
            }
        ]
    }
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;

function startQuiz(quizId) {
    // Initialize quiz state
    currentQuiz = quizId;
    currentQuestionIndex = 0;
    quizScore = 0;
    
    // Show quiz container, hide selector and results
    document.getElementById('quiz-selector-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    
    // Load first question
    loadCurrentQuestion();
}

function loadCurrentQuestion() {
    const quiz = quizData[currentQuiz];
    if (!quiz) return;
    
    const question = quiz.questions[currentQuestionIndex];
    if (!question) {
        showQuizResults();
        return;
    }
    
    // Set quiz title
    document.getElementById('quiz-title').textContent = quiz.title;
    
    // Update question counter
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = quiz.questions.length;
    
    // Set question text
    document.getElementById('question-text').textContent = question.question;
    
    // Reset feedback
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';
    feedbackEl.style.display = 'none';
    
    // Hide next button
    document.getElementById('next-question-btn').style.display = 'none';
    
    // Create options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.setAttribute('data-index', index);
        optionDiv.addEventListener('click', function() {
            selectQuizOption(this);
        });
        optionsContainer.appendChild(optionDiv);
    });
}

function selectQuizOption(optionEl) {
    // Get all options and remove selected class
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class
    optionEl.classList.add('selected');
    
    // Get selected index
    const selectedIndex = parseInt(optionEl.getAttribute('data-index'));
    
    // Get correct answer index
    const question = quizData[currentQuiz].questions[currentQuestionIndex];
    const correctIndex = question.correctAnswer;
    
    // Check answer
    const isCorrect = selectedIndex === correctIndex;
    
    // Update score
    if (isCorrect) {
        quizScore++;
    }
    
    // Show feedback
    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.textContent = question.explanation;
    feedbackEl.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
    feedbackEl.style.display = 'block';
    
    // If answer is incorrect, highlight the correct option
    if (!isCorrect) {
        const correctOption = document.querySelector(`.quiz-option[data-index="${correctIndex}"]`);
        if (correctOption) {
            correctOption.classList.add('correct-answer-highlight');
        }
    }
    
    // Disable all options
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.removeEventListener('click', selectQuizOption);
        opt.style.cursor = 'default';
    });
    
    // Show next button
    document.getElementById('next-question-btn').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    loadCurrentQuestion();
}

function showQuizResults() {
    // Hide quiz container
    document.getElementById('quiz-container').style.display = 'none';
    
    // Show results
    document.getElementById('quiz-results').style.display = 'block';
    
    // Calculate percentage
    const totalQuestions = quizData[currentQuiz].questions.length;
    const percentage = Math.round((quizScore / totalQuestions) * 100);
    
    // Update results display
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-total').textContent = totalQuestions;
    document.getElementById('quiz-percentage').textContent = percentage + '%';
    
    // Set appropriate message
    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You have a strong understanding of PFCC concepts.';
    } else if (percentage >= 60) {
        message = 'Good job! You have a solid grasp of PFCC concepts with some areas for improvement.';
    } else {
        message = 'You might need to review the PFCC material again to strengthen your understanding.';
    }
    document.getElementById('quiz-message').textContent = message;
    
    // Mark quiz as completed if score is at least 60%
    if (percentage >= 60) {
        const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
        quizProgress[currentQuiz] = {
            completed: true,
            score: percentage,
            completionDate: new Date().toISOString()
        };
        localStorage.setItem('quizProgress', JSON.stringify(quizProgress));
        
        // Add visual indicator
        const quizBtn = document.querySelector(`.quiz-selector[data-quiz="${currentQuiz}"]`);
        if (quizBtn && !quizBtn.innerHTML.includes('fa-check-circle')) {
            quizBtn.innerHTML += ' <i class="fas fa-check-circle text-green-500 completion-check"></i>';
        }
        
        // Update progress
        updateProgressBar();
        checkCertificateEligibility();
    }
}

function resetQuiz() {
    // Go back to quiz selector
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-selector-container').style.display = 'block';
}

// Resource functions
function downloadResource(resourceName) {
    alert(`In a real implementation, this would download "${resourceName}"`);
}

// Certificate functions
function generateCertificate() {
    // Get participant name
    const nameInput = document.getElementById('participant-name');
    if (!nameInput.value.trim()) {
        alert('Please enter your name for the certificate');
        nameInput.focus();
        return;
    }
    
    // Update certificate with participant name
    document.getElementById('certificate-name').textContent = nameInput.value;
    
    // Update certificate date
    document.getElementById('certificate-date').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Show certificate modal
    showModal('certificate-modal');
}

function printCertificate() {
    // Get certificate content
    const certificateContent = document.querySelector('#certificate-modal .bg-white').outerHTML;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    
    // Write HTML content
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>PFCC Course Certificate</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .border-8 { border-width: 8px; }
                .border-4 { border-width: 4px; }
                .border-blue-100 { border-color: #ebf8ff; }
                .border-blue-700 { border-color: #2b6cb0; }
                .p-8 { padding: 2rem; }
                .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
                .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .text-center { text-align: center; }
                .text-3xl { font-size: 1.875rem; }
                .text-2xl { font-size: 1.5rem; }
                .text-xl { font-size: 1.25rem; }
                .text-lg { font-size: 1.125rem; }
                .font-bold { font-weight: bold; }
                .font-semibold { font-weight: 600; }
                .signature-name { margin-bottom: 0.5rem; border-bottom: 1px solid #2d3748; padding-bottom: 0.5rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
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
