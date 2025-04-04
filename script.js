// Main Navigation and Section Display
let currentProgress = 0;
const totalRequiredItems = 15; // 5 lectures + 5 case studies + 5 quizzes

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeProgressTracking();
    updateProgressBar();
    
    // Set active navigation link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.classList.remove('border-blue-700');
                l.classList.add('border-transparent');
            });
            this.classList.add('active');
            this.classList.add('border-blue-700');
            this.classList.remove('border-transparent');
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
        }
    }
    
    // Update URL hash
    window.location.hash = sectionId;
    
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
    
    updateProgressBar();
    checkCertificateEligibility();
}

function updateProgressBar() {
    const lectureProgress = JSON.parse(localStorage.getItem('lectureProgress') || '{}');
    const caseProgress = JSON.parse(localStorage.getItem('caseProgress') || '{}');
    const quizProgress = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    
    let completedLectures = 0;
    let completedCases = 0;
    let completedQuizzes = 0;
    
    for (const lectureId in lectureProgress) {
        if (lectureProgress[lectureId].completed) completedLectures++;
    }
    
    for (const caseId in caseProgress) {
        if (caseProgress[caseId].completed) completedCases++;
    }
    
    for (const quizId in quizProgress) {
        if (quizProgress[quizId].completed) completedQuizzes++;
    }
    
    currentProgress = completedLectures + completedCases + completedQuizzes;
    
    const progressPercent = (currentProgress / totalRequiredItems) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;
    
    checkCertificateEligibility();
}

function checkCertificateEligibility() {
    const certificateButton = document.getElementById('view-certificate-button');
    
    if (currentProgress >= totalRequiredItems) {
        certificateButton.disabled = false;
        certificateButton.classList.remove('text-gray-400', 'cursor-not-allowed');
        certificateButton.classList.add('text-blue-700', 'hover:text-blue-800');
    } else {
        certificateButton.disabled = true;
        certificateButton.classList.add('text-gray-400', 'cursor-not-allowed');
        certificateButton.classList.remove('text-blue-700', 'hover:text-blue-800');
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

function startQuiz(quizId) {
    currentQuiz = quizId;
    currentQuestion = 0;
    quizScore = 0;
    
    // Hide selector and show quiz
    document.getElementById('quiz-selector-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
    
    // Load first question
    loadQuestion();
}

function loadQuestion() {
    const quizData = quizzes[currentQuiz];
    if (!quizData) return;
    
    const question = quizData.questions[currentQuestion];
    if (!question) {
        // End of quiz
        showQuizResults();
        return;
    }
    
    const quizTitle = document.getElementById('quiz-title');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionProgress = document.getElementById('question-progress');
    const feedbackContainer = document.getElementById('feedback-container');
    
    // Set title and question
    if (quizTitle) quizTitle.textContent = quizData.title;
    if (questionText) questionText.textContent = question.question;
    
    // Update progress
    if (questionProgress) {
        questionProgress.textContent = `Question ${currentQuestion + 1} of ${quizData.questions.length}`;
    }
    
    // Hide feedback
    if (feedbackContainer) {
        feedbackContainer.style.display = 'none';
        feedbackContainer.className = 'quiz-feedback';
    }
    
    // Clear previous options
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        // Add options
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.textContent = option;
            optionDiv.setAttribute('data-index', index);
            optionDiv.onclick = function() {
                selectOption(this);
            };
            optionsContainer.appendChild(optionDiv);
        });
    }
    
    // Show/hide navigation buttons
    document.getElementById('prev-question').style.display = currentQuestion > 0 ? 'block' : 'none';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('submit-answer').style.display = 'block';
}

function selectOption(selectedOption) {
    // Remove selected class from all options
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    selectedOption.classList.add('selected');
}

function submitAnswer() {
    const selectedOption = document.querySelector('.quiz-option.selected');
    if (!selectedOption) {
        alert('Please select an answer');
        return;
    }
    
    const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
    const quizData = quizzes[currentQuiz];
    const question = quizData.questions[currentQuestion];
    const feedbackContainer = document.getElementById('feedback-container');
    
    // Check if answer is correct
    const isCorrect = selectedIndex === question.correctAnswer;
    
    // Update score if correct
    if (isCorrect) {
        quizScore++;
    }
    
    // Show feedback
    if (feedbackContainer) {
        feedbackContainer.textContent = question.explanation || (isCorrect ? 'Correct!' : 'Incorrect.');
        feedbackContainer.classList.add(isCorrect ? 'correct' : 'incorrect');
        feedbackContainer.style.display = 'block';
    }
    
    // If incorrect, highlight correct answer
    if (!isCorrect) {
        const options = document.querySelectorAll('.quiz-option');
        options[question.correctAnswer].classList.add('correct-answer-highlight');
    }
    
    // Show next button, hide submit button
    document.getElementById('next-question').style.display = 'block';
    document.getElementById('submit-answer').style.display = 'none';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= quizzes[currentQuiz].questions.length) {
        showQuizResults();
    } else {
        loadQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function showQuizResults() {
    // Hide quiz container
    document.getElementById('quiz-container').style.display = 'none';
    
    // Show results
    const resultsContainer = document.getElementById('quiz-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        
        const quizData = quizzes[currentQuiz];
        const totalQuestions = quizData.questions.length;
        const scorePercent = Math.round((quizScore / totalQuestions) * 100);
        
        // Update result text and percentage
        document.getElementById('quiz-score').textContent = quizScore;
        document.getElementById('quiz-total').textContent = totalQuestions;
        
        // Determine feedback based on score
        let feedbackText = '';
        if (scorePercent >= 90) {
            feedbackText = 'Excellent! You have a strong understanding of PFCC concepts.';
        } else if (scorePercent >= 70) {
            feedbackText = 'Good job! You understand most PFCC concepts, but might benefit from reviewing some areas.';
        } else {
            feedbackText = 'You might want to review the course materials again to strengthen your understanding of PFCC concepts.';
        }
        
        document.getElementById('quiz-feedback').textContent = feedbackText;
        
        // Mark quiz as completed if score is 60% or higher
        if (scorePercent >= 60) {
            markQuizComplete(currentQuiz, scorePercent);
        }
    }
}

function restartQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    loadQuestion();
    
    // Show quiz container, hide results
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-results').style.display = 'none';
}

function backToQuizList() {
    // Hide quiz and results, show selector
    document.getElementById('quiz-selector-container').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'none';
}

// Certificate Generation
function generateCertificate() {
    // Set certificate details
    document.getElementById('certificate-name').textContent = "Dr. Avneet Kaur";
    document.getElementById('certificate-id').textContent = "PFCC-" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('certificate-date').textContent = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Show certificate modal
    showModal('certificate-modal');
}

function printCertificate() {
    // Create a printable version
    const certificateContent = document.getElementById('certificate').innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>PFCC Course Certificate</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .certificate { border: 20px solid #1a56db; padding: 40px; text-align: center; position: relative; }
                .certificate-title { font-size: 2.5rem; color: #1a56db; margin-bottom: 2rem; }
                .certificate-name { font-size: 2rem; font-weight: bold; color: #2d3748; margin: 2rem 0; }
                .signature-line { margin-top: 4rem; border-top: 1px solid #000; display: inline-block; padding-top: 5px; }
            </style>
        </head>
        <body>
            <div class="certificate">
                ${certificateContent}
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Define quiz data
const quizzes = {
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
                question: "According to historical development, when did the Institute of Medicine identify patient-centered care as one of six aims for healthcare improvement?",
                options: [
                    "1970s",
                    "1980s",
                    "1990s",
                    "2000s"
                ],
                correctAnswer: 3,
                explanation: "The Institute of Medicine (now the National Academy of Medicine) identified patient-centered care as one of six aims for healthcare improvement in its landmark 2001 report 'Crossing the Quality Chasm.'"
            },
            {
                question: "Which of the following is an evidence-based outcome of implementing PFCC?",
                options: [
                    "Increased healthcare costs",
                    "Reduced patient engagement",
                    "Improved clinical outcomes",
                    "Decreased provider job satisfaction"
                ],
                correctAnswer: 2,
                explanation: "Research has consistently demonstrated that PFCC implementation is associated with improved clinical outcomes, including better adherence to treatment plans, reduced readmissions, and improved health status."
            },
            {
                question: "In the context of PFCC, what does 'dignity and respect' primarily refer to?",
                options: [
                    "Allowing patients unrestricted access to all medical records",
                    "Honoring patient and family perspectives and choices",
                    "Ensuring all patients receive identical treatment regardless of background",
                    "Providing luxury accommodations in healthcare facilities"
                ],
                correctAnswer: 1,
                explanation: "Dignity and Respect in PFCC refers to listening to and honoring patient and family perspectives and choices, incorporating their knowledge, values, beliefs, and cultural backgrounds into the planning and delivery of care."
            }
        ]
    },
    2: {
        title: "Quiz 2: Core Principles in Practice",
        questions: [
            {
                question: "Which principle is demonstrated when healthcare providers incorporate patient values and preferences into care plans?",
                options: [
                    "Information Sharing",
                    "Dignity and Respect",
                    "Participation",
                    "Collaboration"
                ],
                correctAnswer: 1,
                explanation: "Incorporating patient values and preferences into care plans demonstrates the principle of Dignity and Respect, which involves honoring patient and family perspectives and choices."
            },
            {
                question: "Which of the following best demonstrates the 'participation' principle of PFCC?",
                options: [
                    "Providers sharing complete diagnostic information",
                    "Families being allowed to visit during specified hours",
                    "Patients choosing their level of involvement in care activities",
                    "Hospital administrators consulting with patient advisors"
                ],
                correctAnswer: 2,
                explanation: "The participation principle involves patients and families being encouraged and supported to participate in care and decision-making at the level they choose. This empowers patients to determine their own involvement."
            },
            {
                question: "How is the principle of 'information sharing' best implemented in practice?",
                options: [
                    "Providing all medical information regardless of patient preference",
                    "Sharing comprehensive information in ways that are affirming and useful",
                    "Limiting information to prevent patient anxiety",
                    "Directing all communication through a designated family spokesperson"
                ],
                correctAnswer: 1,
                explanation: "Information sharing is best implemented by communicating complete and unbiased information with patients and families in ways that are affirming and useful, ensuring they receive timely, accurate information to effectively participate in care and decision-making."
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
        title: "Quiz 4: Building Systems to Support PFCC",
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
                explanation: "Using data to identify and address specific improvement opportunities creates a continuous improvement cycle. This approach transforms measurement from a passive activity into an active driver of better care."
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
                explanation: "Including patients, families, staff, and leadership in measurement design ensures that metrics reflect what matters to all stakeholders. This collaborative approach embodies the PFCC principle of partnership."
            }
        ]
    }
};

// Resource Functions
function downloadResource(resourceName) {
    alert(`In a production environment, this would download the file: ${resourceName}`);
    // In actual implementation, this would trigger a file download
}
