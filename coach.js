let currentStep = 0;
let steps = [];
let recipe = null;

// Get recipe ID from URL
function getRecipeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Load recipe data
async function loadRecipe() {
  const id = getRecipeIdFromUrl();
  const errorEl = document.getElementById("coach-error");

  if (!id) {
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = "No recipe ID provided in the URL.";
    }
    return;
  }

  try {
    const res = await fetch("recipes.json");
    const recipes = await res.json();
    recipe = recipes.find((r) => r.id === id);

    if (!recipe) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = "Recipe not found.";
      }
      return;
    }

    // Set title
    const titleEl = document.getElementById("coach-title");
    if (titleEl) {
      titleEl.textContent = recipe.title || "Recipe Coach";
    }

    // Extract steps from instructions
    steps = recipe.instructions || [];
    
    if (steps.length === 0) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = "No instructions found for this recipe.";
      }
      return;
    }

    if (errorEl) {
      errorEl.hidden = true;
    }

    renderCards();
    updateProgress();
    setupNavigation();
  } catch (err) {
    console.error(err);
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = "Failed to load recipe data.";
    }
  }
}

// Render step cards
function renderCards() {
  const container = document.getElementById("cards-container");
  if (!container) return;

  container.innerHTML = "";

  steps.forEach((step, index) => {
    const card = document.createElement("div");
    card.className = "step-card";
    if (index === 0) {
      card.classList.add("active");
    }

    const stepNumber = document.createElement("div");
    stepNumber.className = "step-number";
    stepNumber.textContent = `Step ${step.step}`;

    const stepText = document.createElement("div");
    stepText.className = "step-text";
    stepText.textContent = step.text || "";

    card.appendChild(stepNumber);
    card.appendChild(stepText);

    // Add media if available
    if (step.media && Array.isArray(step.media) && step.media.length > 0) {
      const mediaContainer = document.createElement("div");
      mediaContainer.className = "step-media";

      step.media.forEach((mediaItem) => {
        if (mediaItem.src) {
          const mediaDiv = document.createElement("div");
          mediaDiv.className = "step-media-item";
          const img = document.createElement("img");
          img.src = mediaItem.src;
          img.alt = mediaItem.alt || `Step ${step.step} image`;
          mediaDiv.appendChild(img);
          mediaContainer.appendChild(mediaDiv);
        }
      });

      if (mediaContainer.children.length > 0) {
        card.appendChild(mediaContainer);
      }
    }

    container.appendChild(card);
  });
}

// Update progress bar and text
function updateProgress() {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");

  if (steps.length === 0) return;

  const progress = ((currentStep + 1) / steps.length) * 100;
  
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `Step ${currentStep + 1} of ${steps.length}`;
  }
}

// Update active card
function updateActiveCard() {
  const cards = document.querySelectorAll(".step-card");
  cards.forEach((card, index) => {
    card.classList.remove("active", "prev", "next");
    if (index === currentStep) {
      card.classList.add("active");
    } else if (index < currentStep) {
      card.classList.add("prev");
    } else {
      card.classList.add("next");
    }
  });
  updateProgress();
}

// Navigate to step
function goToStep(index) {
  if (index < 0 || index >= steps.length) return;
  
  currentStep = index;
  updateActiveCard();
  updateNavButtons();
}

// Update navigation buttons
function updateNavButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (prevBtn) {
    prevBtn.disabled = currentStep === 0;
  }

  if (nextBtn) {
    nextBtn.disabled = currentStep === steps.length - 1;
  }
}

// Setup navigation
function setupNavigation() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
        goToStep(currentStep - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && currentStep > 0) {
      goToStep(currentStep - 1);
    } else if (e.key === "ArrowRight" && currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  });

  updateNavButtons();
}

// Timer functionality
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

function updateTimerDisplay() {
  const display = document.getElementById("timer-display");
  if (!display) return;

  const minutes = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  display.textContent = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startTimer() {
  if (isTimerRunning) return;

  const minutesInput = document.getElementById("timer-minutes");
  const secondsInput = document.getElementById("timer-seconds");
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");

  if (!minutesInput || !secondsInput) return;

  if (timerSeconds === 0) {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    timerSeconds = minutes * 60 + seconds;
  }

  if (timerSeconds <= 0) {
    alert("Please set a timer duration first.");
    return;
  }

  isTimerRunning = true;
  if (startBtn) startBtn.style.display = "none";
  if (pauseBtn) pauseBtn.style.display = "flex";

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      isTimerRunning = false;
      if (startBtn) startBtn.style.display = "flex";
      if (pauseBtn) pauseBtn.style.display = "none";

      // Trigger shake animation on timer box
      const timerBox = document.querySelector(".timer-box");
      if (timerBox) {
        timerBox.classList.add("shake");
        setTimeout(() => {
          timerBox.classList.remove("shake");
        }, 500);
      }

      // Show alert modal
      showTimerAlert();

      // Play beep sound using Web Audio API
      playTimerSound();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isTimerRunning) return;

  clearInterval(timerInterval);
  timerInterval = null;
  isTimerRunning = false;

  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  if (startBtn) startBtn.style.display = "flex";
  if (pauseBtn) pauseBtn.style.display = "none";
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 0;
  updateTimerDisplay();

  const minutesInput = document.getElementById("timer-minutes");
  const secondsInput = document.getElementById("timer-seconds");
  if (minutesInput) minutesInput.value = "0";
  if (secondsInput) secondsInput.value = "0";
}

// Show timer alert modal
function showTimerAlert() {
  const overlay = document.getElementById("timer-alert-overlay");
  if (!overlay) return;

  overlay.classList.add("show");

  // Also show browser notification if permission granted
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Timer Complete!", {
      body: "Your timer has finished!",
      icon: "images/club-logo.png"
    });
  }
}

// Hide timer alert modal
function hideTimerAlert() {
  const overlay = document.getElementById("timer-alert-overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
}

// Play timer sound
function playTimerSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Fallback if Web Audio API is not available
    console.log("Audio notification not available");
  }
}

// Setup timer
function setupTimer() {
  const startBtn = document.getElementById("timer-start");
  const pauseBtn = document.getElementById("timer-pause");
  const resetBtn = document.getElementById("timer-reset");
  const minutesInput = document.getElementById("timer-minutes");
  const secondsInput = document.getElementById("timer-seconds");
  const alertConfirmBtn = document.getElementById("timer-alert-confirm");

  if (startBtn) {
    startBtn.addEventListener("click", startTimer);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", pauseTimer);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetTimer);
  }

  // Close alert modal when confirm button is clicked
  if (alertConfirmBtn) {
    alertConfirmBtn.addEventListener("click", hideTimerAlert);
  }

  // Close alert modal when clicking outside
  const overlay = document.getElementById("timer-alert-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        hideTimerAlert();
      }
    });
  }

  // Update timer when inputs change
  if (minutesInput && secondsInput) {
    const updateTimer = () => {
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      timerSeconds = minutes * 60 + seconds;
      updateTimerDisplay();
    };

    minutesInput.addEventListener("input", updateTimer);
    secondsInput.addEventListener("input", updateTimer);
  }

  // Request notification permission
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  updateTimerDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  loadRecipe();
  setupTimer();
});

