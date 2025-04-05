// Main Navigation and Section Display
let currentProgress = 0;
const totalRequiredItems = 16; // 5 lectures + 5 case studies + 5 quizzes + 1 game

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeProgressTracking();
    updateProgressBar();
    
    // Set active navigation link and prevent default behavior
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Explicitly prevent default behavior
            
            // Get the section ID from the href attribute
            const sectionId = this.getAttribute('href').substring(1);
            
            // Remove active class from all links
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.classList.remove('border-blue-700');
                l.classList.add('border-transparent');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            this.classList.add('border-blue-700');
            this.classList.remove('border-transparent');
            
            // Show the selected section
            showSection(sectionId);
        });
    });
    
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
    
    // Add event listeners to buttons that change sections
    document.querySelectorAll('[onclick*="showSection"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        const sectionMatch = functionCall.match(/showSection\(['"]([^'"]+)['"]\)/);
        
        if (sectionMatch && sectionMatch[1]) {
            const sectionId = sectionMatch[1];
            
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showSection(sectionId);
            });
        }
    });
});

// Show a specific section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('.container.mx-auto.px-4.py-8 > section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Handle specific sections
        if (sectionId === 'quizzes') {
            initializeCurrentQuiz();
        } else if (sectionId === 'interactive-game' && typeof loadScenario === 'function') {
            loadScenario(0);
        }
    }
    
    // Update URL hash without causing a page jump
    history.replaceState(null, null, '#' + sectionId);
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Update active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === '#' + sectionId) {
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.classList.remove('border-blue-700');
                l.classList.add('border-transparent');
            });
            link.classList.add('active');
            link.classList.add('border-blue-700');
            link.classList.remove('border-transparent');
        }
    });
}

// Progress Tracking
function initializeProgressTracking() {
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    // Update UI to show progress
    for (const lectureId in lectureProgress) {
        if (lectureProgress[lectureId].completed) {
            const lectureElement = document.querySelector(`#lectures [onclick="showLecture(${lectureId})"]`);
            if (lectureElement && !lectureElement.innerHTML.includes('fa-check-circle')) {
                lectureElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
            }
        }
    }
    
    for (const caseId in caseProgress) {
        if (caseProgress[caseId].completed) {
            const caseElement = document.querySelector(`#case-studies [onclick="showCaseStudy(${caseId})"]`);
            if (caseElement && !caseElement.innerHTML.includes('fa-check-circle')) {
                caseElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
            }
        }
    }
    
    for (const quizId in quizProgress) {
        if (quizProgress[quizId].completed) {
            const quizElement = document.querySelector(`#quizzes .quiz-selector[data-quiz="${quizId}"]`);
            if (quizElement && !quizElement.innerHTML.includes('fa-check-circle')) {
                quizElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
            }
        }
    }
    
    // Add check to game menu item if completed
    if (gameProgress.completed) {
        const gameElement = document.querySelector('a[href="#interactive-game"]');
        if (gameElement && !gameElement.innerHTML.includes('fa-check-circle')) {
            gameElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
        }
    }
    
    updateProgressBar();
    checkCertificateEligibility();
}

function updateProgressBar() {
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    const gameProgress = JSON.parse(localStorage.getItem('gameProgress') || '{}');
    
    let completedLectures = 0;
    let completedCases = 0;
    let completedQuizzes = 0;
    let completedGame = gameProgress.completed ? 1 : 0;
    
    for (const lectureId in lectureProgress) {
        if (lectureProgress[lectureId].completed) completedLectures++;
    }
    
    for (const caseId in caseProgress) {
        if (caseProgress[caseId].completed) completedCases++;
    }
    
    for (const quizId in quizProgress) {
        if (quizProgress[quizId].completed) completedQuizzes++;
    }
    
    currentProgress = completedLectures + completedCases + completedQuizzes + completedGame;
    
    const progressPercent = (currentProgress / totalRequiredItems) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;
    
    checkCertificateEligibility();
}

function checkCertificateEligibility() {
    const certificateButton = document.getElementById('view-certificate-button');
    
    if (currentProgress >= totalRequiredItems) {
        certificateButton.disabled = false;
        certificateButton.classList.remove('text-gray-400', 'cursor-not-allowed');
        certificateButton.classList.add('text-white', 'hover:bg-blue-800');
    } else {
        certificateButton.disabled = true;
        certificateButton.classList.add('text-gray-400', 'cursor-not-allowed');
        certificateButton.classList.remove('text-white', 'hover:bg-blue-800');
    }
}

function markLectureComplete(lectureId) {
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    
    lectureProgress[lectureId] = {
        completed: true,
        completedDate: new Date().toISOString()
    };
    
    localStorage.setItem('lectureProgress', JSON.stringify(lectureProgress));
    
    // Update UI
    const lectureElement = document.querySelector(`#lectures [onclick="showLecture(${lectureId})"]`);
    if (lectureElement && !lectureElement.innerHTML.includes('fa-check-circle')) {
        lectureElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
    }
    
    updateProgressBar();
    showModal('lecture-completed-modal');
}

function markCaseStudyComplete(caseId) {
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    
    caseProgress[caseId] = {
        completed: true,
        completedDate: new Date().toISOString()
    };
    
    localStorage.setItem('caseProgress', JSON.stringify(caseProgress));
    
    // Update UI
    const caseElement = document.querySelector(`#case-studies [onclick="showCaseStudy(${caseId})"]`);
    if (caseElement && !caseElement.innerHTML.includes('fa-check-circle')) {
        caseElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
    }
    
    updateProgressBar();
    showModal('case-completed-modal');
}

function markQuizComplete(quizId, score) {
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    
    quizProgress[quizId] = {
        completed: true,
        score: score,
        completedDate: new Date().toISOString()
    };
    
    localStorage.setItem('quizProgress', JSON.stringify(quizProgress));
    
    // Update UI
    const quizElement = document.querySelector(`#quizzes .quiz-selector[data-quiz="${quizId}"]`);
    if (quizElement && !quizElement.innerHTML.includes('fa-check-circle')) {
        quizElement.innerHTML += ' <i class="fas fa-check-circle text-green-500"></i>';
    }
    
    updateProgressBar();
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
        
        // Scroll to lecture
        lectureElement.scrollIntoView({ behavior: 'smooth' });
        
        // Mark lecture as viewed after 30 seconds - but only if not already completed
        const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
        if (!lectureProgress[lectureNum] || !lectureProgress[lectureNum].completed) {
            setTimeout(() => {
                markLectureComplete(lectureNum);
            }, 30000);
        }
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

// Case Study Functions
function showCaseStudy(caseNum) {
    // Hide all case studies
    const caseStudies = document.querySelectorAll('.case-study');
    caseStudies.forEach(caseStudy => {
        caseStudy.style.display = 'none';
    });
    
    // Show selected case study
    const caseStudy = document.getElementById('case-study' + caseNum);
    if (caseStudy) {
        caseStudy.style.display = 'block';
        
        // Scroll to case study
        caseStudy.scrollIntoView({ behavior: 'smooth' });
        
        // Mark case study as viewed after 30 seconds - but only if not already completed
        const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
        if (!caseProgress[caseNum] || !caseProgress[caseNum].completed) {
            setTimeout(() => {
                markCaseStudyComplete(caseNum);
            }, 30000);
        }
    }
}

// Quiz Functions
let currentQuiz = 1;
let currentQuestion = 0;
let quizScore = 0;

function initializeCurrentQuiz() {
    // Reset quiz state
    currentQuestion = 0;
    quizScore = 0;
    
    // Hide quiz content and show selector
    document.getElementById('quiz-selector-container').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
}

function selectQuiz(quizId) {
    currentQuiz = quizId;
    
    // Hide selector and show quiz
    document.getElementById('quiz-selector-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    // Reset quiz state
    currentQuestion = 0;
    quizScore = 0;
    
    // Load the first question
    showQuestion();
}

const quizData = {
    1: {
        title: "Quiz 1: Foundations of PFCC",
        questions: [
            {
                question: "Which of the following best defines Patient and Family-Centered Care?",
                options: [
                    "A healthcare approach that places the physician at the center of all decisions",
                    "An approach that partners with patients and families in planning, delivery, and evaluation of healthcare",
                    "A model that prioritizes hospital efficiency over patient preferences",
                    "A system where family members make all healthcare decisions for patients"
                ],
                correctAnswer: 1,
                explanation: "Patient and Family-Centered Care is an approach to healthcare that forms partnerships with patients and families in the planning, delivery, and evaluation of care. This definition acknowledges the essential role of collaboration while maintaining that patients and families are at the center of the care process."
            },
            {
                question: "Which is NOT one of the core principles of PFCC?",
                options: [
                    "Dignity and Respect",
                    "Information Sharing",
                    "Participation",
                    "Provider Authority"
                ],
                correctAnswer: 3,
                explanation: "The core principles of PFCC are Dignity and Respect, Information Sharing, Participation, and Collaboration. Provider Authority is not a principle of PFCC, as it contradicts the collaborative nature of patient-centered care."
            },
            {
                question: "How does PFCC primarily view family members?",
                options: [
                    "As visitors who should have limited involvement in care",
                    "As essential members of the care team and partners in care",
                    "As potential disruptions to efficient healthcare delivery",
                    "As secondary to the patient-provider relationship"
                ],
                correctAnswer: 1,
                explanation: "PFCC views family members as essential members of the care team and partners in care, not as visitors. This perspective recognizes the vital support role that families play and their knowledge of the patient's preferences, values, and needs."
            },
            {
                question: "Which historical development most directly influenced the emergence of PFCC?",
                options: [
                    "The rise of medical specialization",
                    "The consumer rights movement and patient advocacy",
                    "The development of electronic health records",
                    "The expansion of insurance coverage"
                ],
                correctAnswer: 1,
                explanation: "The consumer rights movement and patient advocacy of the 1960s and 1970s most directly influenced the emergence of PFCC by emphasizing the rights of patients to be informed and involved in their care decisions. This social context created demand for more patient-centered approaches to healthcare."
            },
            {
                question: "What is the primary goal of PFCC?",
                options: [
                    "To reduce healthcare costs",
                    "To improve patient and family experience of care",
                    "To decrease provider workload",
                    "To increase hospital efficiency"
                ],
                correctAnswer: 1,
                explanation: "The primary goal of PFCC is to improve patient and family experience of care by creating partnerships that enhance quality and safety while respecting individual values, preferences, and needs. While PFCC may also impact costs and efficiency, these are secondary to the focus on experience of care."
            }
        ]
    },
    2: {
        title: "Quiz 2: PFCC Core Principles",
        questions: [
            {
                question: "Which of the following best demonstrates the principle of 'dignity and respect' in PFCC?",
                options: [
                    "Making decisions for patients to save them from difficult choices",
                    "Asking patients about their values and preferences before developing a care plan",
                    "Allowing only certified medical interpreters to communicate with non-English speaking patients",
                    "Following standardized protocols regardless of individual patient circumstances"
                ],
                correctAnswer: 1,
                explanation: "Asking patients about their values and preferences before developing a care plan demonstrates the principle of dignity and respect by acknowledging that patient perspectives are central to care planning. This approach honors patient autonomy and recognizes that patients are experts in their own lives."
            },
            {
                question: "What does 'information sharing' in PFCC require of healthcare providers?",
                options: [
                    "Limiting information to prevent overwhelming patients",
                    "Providing complete, accurate information that patients and families can understand",
                    "Sharing information only with the legally designated decision-maker",
                    "Withholding concerning information that might cause distress"
                ],
                correctAnswer: 1,
                explanation: "Information sharing in PFCC requires providing complete and accurate information in ways that patients and families can understand. This principle is based on the understanding that access to information is necessary for patients to participate meaningfully in their care decisions."
            },
            {
                question: "The 'participation' principle of PFCC is best supported by which of the following practices?",
                options: [
                    "Having family members sign consent forms on behalf of patients",
                    "Encouraging patients and families to participate in care discussions and decisions at their desired level",
                    "Requiring family members to assist with basic care to reduce staffing needs",
                    "Allowing patients to make decisions only if they align with provider recommendations"
                ],
                correctAnswer: 1,
                explanation: "Encouraging patients and families to participate in care discussions and decisions at their desired level best supports the participation principle. This practice respects that different patients may want different levels of involvement, while still creating opportunities for meaningful engagement."
            },
            {
                question: "In a PFCC approach, how should healthcare providers respond to family members who want to be present during procedures?",
                options: [
                    "Always allow family presence regardless of the situation",
                    "Never allow family presence to avoid interference with care",
                    "Develop policies that support family presence with appropriate preparation and support",
                    "Allow family presence only for minor, non-invasive procedures"
                ],
                correctAnswer: 2,
                explanation: "A PFCC approach involves developing policies that support family presence during procedures with appropriate preparation and support. This balances the benefits of family presence with safety considerations and respects both family desires and clinical needs."
            },
            {
                question: "Which of the following is an example of the 'collaboration' principle in action?",
                options: [
                    "A nurse explaining medication side effects to a patient",
                    "A doctor allowing a family member to stay overnight in the patient's room",
                    "A hospital including patient and family advisors on quality improvement committees",
                    "A clinic providing translated written materials in multiple languages"
                ],
                correctAnswer: 2,
                explanation: "The collaboration principle involves patients, families, healthcare practitioners, and leaders working together in policy and program development, implementation, and evaluation. Including patient and family advisors on quality improvement committees exemplifies this collaborative approach."
            }
        ]
    },
    3: {
        title: "Quiz 3: Communication Skills for PFCC",
        questions: [
            {
                question: "Which communication technique is most effective for ensuring patient understanding of medical information?",
                options: [
                    "Using medical terminology to be precise",
                    "Providing written materials only",
                    "Using teach-back methods to confirm understanding",
                    "Limiting information to avoid overwhelming patients"
                ],
                correctAnswer: 2,
                explanation: "Teach-back methods, where providers ask patients to explain information in their own words, are most effective for ensuring understanding. This technique helps identify and address misunderstandings immediately."
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
                explanation: "The primary purpose of active listening in PFCC is to understand the patient's perspective and concerns. This demonstrates respect, builds trust, and ensures that care decisions incorporate the patient's values and preferences."
            },
            {
                question: "Which approach best addresses health literacy concerns in patient communication?",
                options: [
                    "Using simple language and visual aids",
                    "Providing more detailed written materials",
                    "Having family members explain information to patients",
                    "Limiting information to essential facts only"
                ],
                correctAnswer: 0,
                explanation: "Using simple, jargon-free language and visual aids best addresses health literacy concerns. This approach makes information accessible to patients with varying literacy levels without compromising the completeness of information."
            },
            {
                question: "In difficult conversations about serious diagnoses, which communication strategy is most aligned with PFCC principles?",
                options: [
                    "Delivering information quickly to minimize distress",
                    "Having the most senior physician present the information alone",
                    "Asking the patient who they want present and how much information they want",
                    "Focusing exclusively on treatment options rather than prognosis"
                ],
                correctAnswer: 2,
                explanation: "Asking patients who they want present and how much information they want respects their preferences and supports their autonomy, which aligns with PFCC principles of dignity, respect, and participation."
            },
            {
                question: "Which of the following best demonstrates cultural sensitivity in communication?",
                options: [
                    "Using the same communication approach with all patients for consistency",
                    "Making assumptions about preferences based on cultural background",
                    "Asking patients about their cultural practices and communication preferences",
                    "Avoiding discussions of cultural differences to prevent discomfort"
                ],
                correctAnswer: 2,
                explanation: "Asking patients about their cultural practices and communication preferences demonstrates cultural sensitivity by acknowledging diversity while avoiding stereotypes. This approach respects individuality within cultural contexts."
            }
        ]
    },
    4: {
        title: "Quiz 4: System Design for PFCC",
        questions: [
            {
                question: "Which organizational policy best supports family presence in healthcare settings?",
                options: [
                    "Strict visiting hours limited to two hours per day",
                    "Family presence allowed only during non-treatment times",
                    "Flexible family presence policies based on patient preferences",
                    "Family access restricted to designated family members only"
                ],
                correctAnswer: 2,
                explanation: "Flexible family presence policies based on patient preferences best support PFCC by respecting patient choice, accommodating diverse family structures, and recognizing the supportive role families play in patient care and recovery."
            },
            {
                question: "What is the most effective approach for healthcare leaders to demonstrate commitment to PFCC?",
                options: [
                    "Creating a written mission statement about patient-centered care",
                    "Modeling PFCC behaviors and holding staff accountable for PFCC practices",
                    "Designating a single department responsible for PFCC implementation",
                    "Implementing patient satisfaction surveys"
                ],
                correctAnswer: 1,
                explanation: "Leaders modeling PFCC behaviors and holding staff accountable demonstrates authentic commitment beyond words. This approach creates a culture where PFCC is valued and expected at all levels of the organization."
            },
            {
                question: "Which physical environment feature best supports family participation in care?",
                options: [
                    "Centralized nursing stations that allow staff to monitor multiple patients",
                    "Shared patient rooms to promote socialization",
                    "Patient rooms with adequate space for family members to stay overnight",
                    "Separate family waiting areas away from patient care areas"
                ],
                correctAnswer: 2,
                explanation: "Patient rooms with adequate space for family members to stay overnight best supports family participation by enabling family presence and involvement in care. This design acknowledges families as partners rather than visitors."
            },
            {
                question: "What is the most effective way to incorporate patient and family input into organizational decision-making?",
                options: [
                    "Annual patient satisfaction surveys",
                    "Suggestion boxes in waiting areas",
                    "Patient and family advisory councils that meet regularly with leadership",
                    "Focus groups conducted during accreditation reviews"
                ],
                correctAnswer: 2,
                explanation: "Patient and family advisory councils that meet regularly with leadership provide ongoing, structured input into organizational decisions. This approach creates meaningful partnerships rather than token consultation."
            },
            {
                question: "Which staffing approach best supports PFCC implementation?",
                options: [
                    "Rotating staff assignments to expose patients to diverse perspectives",
                    "Consistent staff assignments to build relationships with patients and families",
                    "Specialized PFCC staff separate from direct care providers",
                    "Minimizing staff-patient interaction to increase efficiency"
                ],
                correctAnswer: 1,
                explanation: "Consistent staff assignments enable providers to build relationships with patients and families over time. This continuity supports trust development, personalized care, and effective communication."
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
                question: "What is the most comprehensive approach to measuring PFCC implementation?",
                options: [
                    "Focusing exclusively on patient satisfaction scores",
                    "Measuring only clinical outcomes like readmission rates",
                    "Using a balanced set of process, outcome, and experience measures",
                    "Comparing financial performance before and after PFCC implementation"
                ],
                correctAnswer: 2,
                explanation: "A balanced set of process, outcome, and experience measures provides comprehensive evaluation of PFCC implementation. This approach captures both the 'how' (processes), the 'what' (outcomes), and the 'experience' of care."
            },
            {
                question: "Which data collection method provides the richest information about the patient experience of care?",
                options: [
                    "Standardized patient satisfaction surveys",
                    "Medical record audits",
                    "Patient and family narratives about their care experiences",
                    "Staff reports of patient interactions"
                ],
                correctAnswer: 2,
                explanation: "Patient and family narratives provide rich, contextual information about care experiences that standardized measures often miss. These stories capture nuance, emotion, and meaning that help providers understand the lived experience of care."
            },
            {
                question: "What is the most effective way to use PFCC measurement data for improvement?",
                options: [
                    "Publishing results in annual reports",
                    "Using data to identify and address specific improvement opportunities",
                    "Comparing performance to national benchmarks only",
                    "Focusing on measures where performance is already strong"
                ],
                correctAnswer: 1,
                explanation: "Using data to identify and address specific improvement opportunities creates a continuous improvement cycle that advances PFCC implementation. This approach ensures that measurement leads to meaningful action."
            },
            {
                question: "Which approach to measuring outcomes best aligns with PFCC principles?",
                options: [
                    "Prioritizing measures that matter to administrators and payers",
                    "Focusing exclusively on clinical outcomes",
                    "Including measures that patients and families identify as important",
                    "Using only measures that can be collected without patient input"
                ],
                correctAnswer: 2,
                explanation: "Including measures that patients and families identify as important aligns with PFCC principles by respecting their perspectives on what constitutes valuable outcomes. This approach ensures evaluation focuses on what matters most to those receiving care."
            }
        ]
    }
};

function showQuestion() {
    const quizData = window.quizData[currentQuiz];
    const questionData = quizData.questions[currentQuestion];
    
    // Update quiz title and question
    document.getElementById('quiz-title').textContent = quizData.title;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = quizData.questions.length;
    document.getElementById('question-text').textContent = questionData.question;
    
    // Clear previous options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    // Add new options
    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.setAttribute('data-index', index);
        optionDiv.onclick = function() {
            selectAnswer(index);
        };
        optionsContainer.appendChild(optionDiv);
    });
    
    // Reset feedback
    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-feedback').className = 'quiz-feedback';
    
    // Reset buttons
    document.getElementById('next-question-btn').style.display = 'none';
}

function selectAnswer(answerIndex) {
    const questionData = quizData[currentQuiz].questions[currentQuestion];
    const correctIndex = questionData.correctAnswer;
    const options = document.querySelectorAll('.quiz-option');
    const feedbackElement = document.getElementById('quiz-feedback');
    
    // Disable all options
    options.forEach(option => {
        option.onclick = null;
        option.classList.add('pointer-events-none');
    });
    
    // Mark selected option
    options[answerIndex].classList.add('selected');
    
    // Highlight correct answer if wrong choice was made
    if (answerIndex !== correctIndex) {
        options[correctIndex].classList.add('correct-answer-highlight');
    }
    
    // Show feedback
    feedbackElement.textContent = questionData.explanation;
    if (answerIndex === correctIndex) {
        feedbackElement.classList.add('correct');
        quizScore++;
    } else {
        feedbackElement.classList.add('incorrect');
    }
    feedbackElement.style.display = 'block';
    
    // Show next button
    document.getElementById('next-question-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizData[currentQuiz].questions.length) {
        showQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const totalQuestions = quizData[currentQuiz].questions.length;
    const percentageScore = Math.round((quizScore / totalQuestions) * 100);
    
    // Hide quiz container
    document.getElementById('quiz-container').style.display = 'none';
    
    // Show results
    document.getElementById('quiz-results').style.display = 'block';
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-total').textContent = totalQuestions;
    document.getElementById('quiz-percentage').textContent = percentageScore + '%';
    
    // Set message based on score
    const messageElement = document.getElementById('quiz-message');
    if (percentageScore >= 80) {
        messageElement.textContent = 'Excellent! You have a strong understanding of this topic.';
        messageElement.className = 'text-green-700';
    } else if (percentageScore >= 60) {
        messageElement.textContent = 'Good job! You've grasped most of the key concepts.';
        messageElement.className = 'text-blue-700';
    } else {
        messageElement.textContent = 'You might benefit from reviewing this material again.';
        messageElement.className = 'text-red-700';
    }
    
    // Mark quiz as completed if passed
    if (percentageScore >= 60) {
        markQuizComplete(currentQuiz, percentageScore);
    }
}

function resetQuiz() {
    // Go back to quiz selector
    initializeCurrentQuiz();
}

// Certificate Functions
function generateCertificate() {
    const certModal = document.getElementById('certificate-modal');
    const certDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Update certificate date
    document.getElementById('certificate-date').textContent = certDate;
    
    // Show certificate modal
    showModal('certificate-modal');
    
    // Get participant name
    const participantName = document.getElementById('participant-name').value;
    if (participantName) {
        document.getElementById('certificate-name').textContent = participantName;
    } else {
        document.getElementById('certificate-name').textContent = "Participant";
    }
}

// Additional Functions
function printCertificate() {
    window.print();
}

// Make quiz data available globally
window.quizData = quizData;

// Set up event listeners after page load
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to lecture buttons
    document.querySelectorAll('[onclick*="showLecture"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        const lectureMatch = functionCall.match(/showLecture\(([0-9]+)\)/);
        
        if (lectureMatch && lectureMatch[1]) {
            const lectureId = parseInt(lectureMatch[1]);
            
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showLecture(lectureId);
            });
        }
    });
    
    // Add event listeners to case study buttons
    document.querySelectorAll('[onclick*="showCaseStudy"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        const caseMatch = functionCall.match(/showCaseStudy\(([0-9]+)\)/);
        
        if (caseMatch && caseMatch[1]) {
            const caseId = parseInt(caseMatch[1]);
            
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showCaseStudy(caseId);
            });
        }
    });
    
    // Add event listeners to quiz buttons
    document.querySelectorAll('[onclick*="selectQuiz"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        const quizMatch = functionCall.match(/selectQuiz\(([0-9]+)\)/);
        
        if (quizMatch && quizMatch[1]) {
            const quizId = parseInt(quizMatch[1]);
            
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                selectQuiz(quizId);
            });
        }
    });
    
    // Add event listeners to modal close buttons
    document.querySelectorAll('[onclick*="closeModal"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        const modalMatch = functionCall.match(/closeModal\(['"]([^'"]+)['"]\)/);
        
        if (modalMatch && modalMatch[1]) {
            const modalId = modalMatch[1];
            
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                closeModal(modalId);
            });
        }
    });
    
    // Add event listeners to other function calls
    document.querySelectorAll('[onclick*="markLectureComplete"], [onclick*="markCaseStudyComplete"], [onclick*="nextQuestion"], [onclick*="resetQuiz"], [onclick*="generateCertificate"], [onclick*="printCertificate"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        
        if (functionCall.includes('markLectureComplete')) {
            const match = functionCall.match(/markLectureComplete\(([0-9]+)\)/);
            if (match && match[1]) {
                const id = parseInt(match[1]);
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    markLectureComplete(id);
                });
            }
        } else if (functionCall.includes('markCaseStudyComplete')) {
            const match = functionCall.match(/markCaseStudyComplete\(([0-9]+)\)/);
            if (match && match[1]) {
                const id = parseInt(match[1]);
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    markCaseStudyComplete(id);
                });
            }
        } else if (functionCall.includes('nextQuestion')) {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                nextQuestion();
            });
        } else if (functionCall.includes('resetQuiz')) {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                resetQuiz();
            });
        } else if (functionCall.includes('generateCertificate')) {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                generateCertificate();
            });
        } else if (functionCall.includes('printCertificate')) {
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                printCertificate();
            });
        }
    });
    
    // Add event listeners to slide navigation
    document.querySelectorAll('[onclick*="goToSlide"], [onclick*="nextSlide"], [onclick*="prevSlide"]').forEach(button => {
        const functionCall = button.getAttribute('onclick');
        
        if (functionCall.includes('goToSlide')) {
            const match = functionCall.match(/goToSlide\(([0-9]+),\s*['"]([^'"]+)['"]\)/);
            if (match && match[1] && match[2]) {
                const slideNum = parseInt(match[1]);
                const lectureId = match[2];
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    goToSlide(slideNum, lectureId);
                });
            }
        } else if (functionCall.includes('nextSlide')) {
            const match = functionCall.match(/nextSlide\(['"]([^'"]+)['"]\)/);
            if (match && match[1]) {
                const lectureId = match[1];
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    nextSlide(lectureId);
                });
            }
        } else if (functionCall.includes('prevSlide')) {
            const match = functionCall.match(/prevSlide\(['"]([^'"]+)['"]\)/);
            if (match && match[1]) {
                const lectureId = match[1];
                button.removeAttribute('onclick');
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    prevSlide(lectureId);
                });
            }
        }
    });
});
