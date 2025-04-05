// Interactive PFCC Scenario Game

// Define the scenarios for the interactive game
const pfccScenarios = [
  {
    id: 1,
    title: "Family Presence During a Procedure",
    description: "You are a nurse caring for 8-year-old Maya who needs an IV insertion. Her mother asks if she can stay with Maya during the procedure. The unit has traditionally asked family members to leave during procedures.",
    choices: [
      {
        id: "a",
        text: "Explain to the mother that it's hospital policy for family to leave during procedures to maintain a sterile environment.",
        feedback: "This response doesn't align with PFCC principles. While maintaining sterility is important, family presence policies can be adapted to accommodate both clinical needs and family support. This response fails to respect the mother's desire to support her child.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Allow the mother to stay, explaining how she can position herself to provide comfort to Maya while staying out of the sterile field.",
        feedback: "Excellent choice! This response honors the family's desire to stay together during a stressful procedure while addressing clinical needs. You've practiced the PFCC principles of respect and participation by finding a way to include the mother as a supportive presence.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Tell the mother it depends on how Maya behaves during the procedure - if she stays calm, the mother can stay, but if Maya becomes agitated, the mother will need to leave.",
        feedback: "This response creates conditional acceptance that could increase stress for both Maya and her mother. It also fails to recognize that parental presence often helps children stay calmer during procedures. This approach doesn't fully embrace PFCC principles of respect and participation.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Suggest that the mother step out during the procedure but can return immediately after it's completed.",
        feedback: "This response maintains the traditional approach of excluding family during procedures without considering the benefits of family presence or respecting the mother's request. PFCC principles would encourage finding ways to include family members when it's important to them.",
        isCorrect: false
      }
    ],
    reflection: "Consider how family presence during procedures can be facilitated in your practice setting. What policies or adaptations would be needed? How might you prepare families for what to expect during procedures?"
  },
  {
    id: 2,
    title: "Sharing Difficult Information",
    description: "You are a physician who has just received concerning test results for Mr. Chen, a 62-year-old patient. The results indicate a likely cancer diagnosis that will require further testing. Mr. Chen's adult daughter, who speaks English more fluently than he does, has asked to be present for all discussions about her father's care.",
    choices: [
      {
        id: "a",
        text: "Share the information with the daughter first so she can help decide how to tell her father.",
        feedback: "This approach bypasses the patient and doesn't respect his autonomy. While family members can provide support, the patient should be the primary recipient of information about their own health unless they've explicitly requested otherwise.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Tell Mr. Chen alone using simplified language since English isn't his first language.",
        feedback: "While this approach respects the patient's right to information, it doesn't address the language barrier effectively and excludes the family support person the patient appears to rely on. A PFCC approach would find ways to communicate clearly with both the patient and his identified support person.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Arrange for a professional interpreter and speak with Mr. Chen and his daughter together, with the patient's permission.",
        feedback: "Excellent choice! This response addresses the language barrier with professional interpretation services while respecting the patient's wishes to have his daughter involved. This approach honors the PFCC principles of dignity, respect, and information sharing.",
        isCorrect: true
      },
      {
        id: "d",
        text: "Ask the daughter to serve as the interpreter to explain the results to her father.",
        feedback: "Using family members as interpreters, especially for sensitive or complex medical information, places an undue burden on them and may compromise accurate information exchange. Professional interpreters should be used for medical discussions when language barriers exist.",
        isCorrect: false
      }
    ],
    reflection: "Reflect on how you balance family involvement with patient autonomy when sharing sensitive information. How might you ensure effective communication across language barriers while maintaining dignity and respect?"
  },
  {
    id: 3,
    title: "Care Planning for Discharge",
    description: "Mrs. Jackson is an 83-year-old woman being discharged after hip replacement surgery. She lives alone but her son lives nearby. The care team believes she needs rehabilitation in a skilled nursing facility before going home, but Mrs. Jackson is insistent that she wants to go directly home.",
    choices: [
      {
        id: "a",
        text: "Explain to Mrs. Jackson that the team has decided rehabilitation is necessary, and begin making arrangements for placement.",
        feedback: "This approach doesn't respect Mrs. Jackson's preferences or involve her in decision-making. While the clinical recommendation may be sound, implementing it without addressing her concerns violates PFCC principles of respect and participation.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Call the son separately to convince him to persuade his mother to go to rehabilitation.",
        feedback: "This approach bypasses the patient's autonomy and attempts to use family influence to override her preferences. While family involvement is important, it should supplement, not replace, direct communication with the patient.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Hold a care planning meeting with Mrs. Jackson and, with her permission, her son to discuss options, concerns, and develop a shared plan.",
        feedback: "Excellent choice! This response respects Mrs. Jackson's autonomy while creating space for collaborative decision-making that includes her concerns and the team's recommendations. Including her son with her permission demonstrates respect for family relationships while maintaining her centrality in the decision.",
        isCorrect: true
      },
      {
        id: "d",
        text: "Agree to Mrs. Jackson's preference for home discharge despite clinical concerns to honor her autonomy.",
        feedback: "While this approach respects Mrs. Jackson's autonomy, it doesn't fully engage in collaborative problem-solving that might address both her preferences and clinical needs. A PFCC approach would involve deeper discussion to understand concerns and explore options together.",
        isCorrect: false
      }
    ],
    reflection: "Consider how you approach situations where patient preferences and clinical recommendations differ. How can you create a collaborative process that respects patient autonomy while addressing safety and clinical concerns?"
  },
  {
    id: 4,
    title: "Involving Family in Critical Care",
    description: "You are an ICU nurse caring for Roberto, a 45-year-old patient on a ventilator following a severe case of pneumonia. His wife and teenage children have been taking shifts staying at his bedside. The medical team needs to perform daily assessments and care routines.",
    choices: [
      {
        id: "a",
        text: "Ask the family to leave during all care routines to maintain privacy and efficiency.",
        feedback: "This approach unnecessarily excludes the family from participation and doesn't recognize their potential role in the patient's recovery. A PFCC approach would look for ways to include family appropriately during care routines when possible.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Allow the family to stay without restrictions but don't actively engage them in the care process.",
        feedback: "While this approach allows for family presence, it misses the opportunity to engage them as partners in care. PFCC involves not just allowing families to be present but also engaging them in meaningful participation when appropriate.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Teach interested family members how they can assist with certain aspects of care such as mouth care or range of motion exercises.",
        feedback: "Excellent choice! This response recognizes family members as potential partners in care and provides them with meaningful ways to participate. This approach supports the PFCC principles of participation and collaboration while respecting the family's desire to be involved.",
        isCorrect: true
      },
      {
        id: "d",
        text: "Create a schedule that allows family to be present only during specified hours to balance their presence with clinical needs.",
        feedback: "While scheduling can help manage a busy unit, rigid visiting schedules that don't take into account the family's needs and preferences don't align with PFCC principles. This approach prioritizes unit routine over family-centered care.",
        isCorrect: false
      }
    ],
    reflection: "Reflect on how families can be integrated into care processes in acute care settings. What benefits might come from family participation? What preparation or support would families need to participate effectively?"
  },
  {
    id: 5,
    title: "Cultural Considerations in End-of-Life Care",
    description: "Mrs. Patel is a 78-year-old woman with advanced heart failure. Her condition is deteriorating, and the team believes it's time to discuss palliative care options. In Mrs. Patel's culture, important healthcare decisions typically involve the extended family, and direct discussion of death may be considered disrespectful or harmful.",
    choices: [
      {
        id: "a",
        text: "Insist on speaking directly to Mrs. Patel alone about her prognosis and end-of-life preferences, as is standard practice.",
        feedback: "This approach fails to respect cultural differences in communication and decision-making. While patient autonomy is important, cultural context should inform how discussions are approached. PFCC principles include respect for values, beliefs, and cultural backgrounds.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Speak only with the eldest son as the family decision-maker, avoiding any direct conversation with Mrs. Patel about her condition.",
        feedback: "While this acknowledges cultural traditions, it goes too far in excluding the patient from her own care decisions. A balanced approach would respect both cultural norms and the patient's right to information and involvement.",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ask Mrs. Patel how she would like sensitive information to be shared and who should be involved in decisions about her care.",
        feedback: "Excellent choice! This response respects both the patient's autonomy and cultural considerations by asking directly about her preferences for communication and decision-making. This patient-centered approach allows her to define the role of her family in accordance with her cultural values and personal wishes.",
        isCorrect: true
      },
      {
        id: "d",
        text: "Provide full diagnostic and prognostic information to both Mrs. Patel and her family simultaneously, regardless of cultural considerations.",
        feedback: "This one-size-fits-all approach doesn't account for cultural nuances in discussing sensitive topics like end-of-life care. PFCC involves adapting communication approaches to respect diverse cultural backgrounds and preferences.",
        isCorrect: false
      }
    ],
    reflection: "Consider how cultural backgrounds influence preferences for communication, decision-making, and family involvement. How can healthcare providers balance respect for cultural traditions with individual patient preferences and rights?"
  }
];

// Initialize variables for the game state
let currentScenario = 0;
let scenariosCompleted = 0;

// Load a specific scenario
function loadScenario(scenarioIndex) {
  // Make sure we have a valid scenario index
  if (scenarioIndex >= 0 && scenarioIndex < pfccScenarios.length) {
    currentScenario = scenarioIndex;
    const scenario = pfccScenarios[currentScenario];
    
    // Update the scenario container with the current scenario
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-description').textContent = scenario.description;
    
    // Clear any previous feedback and reflection
    document.getElementById('feedback-container').style.display = 'none';
    document.getElementById('reflection-container').style.display = 'none';
    document.getElementById('next-scenario-btn').style.display = 'none';
    
    // Create the choice buttons
    const choicesContainer = document.getElementById('scenario-choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    
    scenario.choices.forEach(choice => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      button.textContent = choice.text;
      button.onclick = function() {
        selectChoice(choice.id);
      };
      
      const choiceIdSpan = document.createElement('span');
      choiceIdSpan.className = 'font-bold mr-2';
      choiceIdSpan.textContent = choice.id.toUpperCase() + ': ';
      
      button.prepend(choiceIdSpan);
      choicesContainer.appendChild(button);
    });
    
    // Update scenario counter
    document.getElementById('scenario-counter').textContent = (currentScenario + 1) + ' of ' + pfccScenarios.length;
  }
}

// Handle scenario choice selection
function selectChoice(choiceId) {
  const scenario = pfccScenarios[currentScenario];
  const selectedChoice = scenario.choices.find(choice => choice.id === choiceId);
  
  // Display feedback for the selected choice
  const feedbackContainer = document.getElementById('feedback-container');
  feedbackContainer.textContent = selectedChoice.feedback;
  feedbackContainer.className = 'feedback-container';
  
  if (selectedChoice.isCorrect) {
    feedbackContainer.classList.add('bg-green-50', 'border-l-4', 'border-green-500');
  } else {
    feedbackContainer.classList.add('bg-red-50', 'border-l-4', 'border-red-500');
  }
  
  feedbackContainer.style.display = 'block';
  
  // Disable all choice buttons after selection
  const choiceButtons = document.querySelectorAll('.choice-btn');
  choiceButtons.forEach(button => {
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');
  });
  
  // Show the reflection
  const reflectionContainer = document.getElementById('reflection-container');
  reflectionContainer.innerHTML = '<h3 class="font-semibold text-lg mb-2">Reflection Point:</h3><p>' + scenario.reflection + '</p>';
  reflectionContainer.style.display = 'block';
  
  // Show next scenario button or complete button
  const nextScenarioBtn = document.getElementById('next-scenario-btn');
  if (currentScenario < pfccScenarios.length - 1) {
    nextScenarioBtn.textContent = 'Next Scenario';
    nextScenarioBtn.onclick = function() {
      loadScenario(currentScenario + 1);
    };
  } else {
    nextScenarioBtn.textContent = 'Complete Game';
    nextScenarioBtn.onclick = function() {
      completeGame();
    };
  }
  nextScenarioBtn.style.display = 'block';
  
  // If this is a correct choice, increment completed scenarios
  if (selectedChoice.isCorrect) {
    scenariosCompleted++;
  }
}

// Handle game completion
function completeGame() {
  // Calculate score
  const totalScenarios = pfccScenarios.length;
  const percentageComplete = (scenariosCompleted / totalScenarios) * 100;
  
  // Display completion message
  document.getElementById('scenario-container').innerHTML = `
    <div class="bg-blue-50 p-6 rounded-lg">
      <h2 class="text-2xl font-bold text-blue-800 mb-4">Game Complete!</h2>
      <p class="mb-4">You've completed the PFCC interactive scenario game.</p>
      <p class="mb-4">You successfully navigated ${scenariosCompleted} out of ${totalScenarios} scenarios correctly.</p>
      <p class="font-semibold mb-6">Score: ${Math.round(percentageComplete)}%</p>
      <p>These scenarios represent common challenges in implementing patient and family-centered care. Remember these principles as you encounter similar situations in your practice.</p>
      <div class="mt-8">
        <button id="restart-game-btn" class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">Restart Game</button>
        <button id="return-to-course-btn" class="px-4 py-2 ml-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">Return to Course</button>
      </div>
    </div>
  `;
  
  // Add button event listeners
  document.getElementById('restart-game-btn').addEventListener('click', function() {
    // Reset game state
    currentScenario = 0;
    scenariosCompleted = 0;
    loadScenario(0);
  });
  
  document.getElementById('return-to-course-btn').addEventListener('click', function() {
    // Mark game as completed in local storage
    const gameProgress = {
      completed: true,
      score: percentageComplete,
      completedDate: new Date().toISOString()
    };
    localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
    
    // Return to course overview
    showSection('home');
    updateProgressBar();
  });
}

// Export functions for use in main script
window.loadScenario = loadScenario;
window.selectChoice = selectChoice;
window.completeGame = completeGame;