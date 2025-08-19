// Select important elements
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const finalMessage = document.getElementById("final-message");
const holes = document.querySelectorAll(".hole img");
const bompSound = document.getElementById("bomp-sound");
const gameEndSound = document.getElementById("game-end-sound");
const gameEndHighSound = document.getElementById("game-end-high-sound");

let score = 0;
let timeLeft = 30;
let gameInterval = null; // interval for popping faces
let timerInterval = null; // interval for countdown
let gameActive = false;

// Function to start the game
function startGame() {
  // Reset values
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  finalMessage.textContent = "";
  gameActive = true;

  // Update button text
  startBtn.textContent = "Playing...";

  // Stop any existing intervals before restarting
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Start popping faces
  gameInterval = setInterval(showRandomFace, 1000);

  // Start countdown timer
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to handle timer countdown
function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

// Function to randomly pick a hole and show the face
function showRandomFace() {
  if (!gameActive) return;

  // Pick a random hole
  const randomIndex = Math.floor(Math.random() * holes.length);
  const face = holes[randomIndex];

  // Show face
  face.classList.add("show");

  // Hide face after a short time
  setTimeout(() => {
    face.classList.remove("show");
  }, 800); // face stays visible for 0.8s
}

// Click event for faces
holes.forEach(face => {
  face.addEventListener("click", () => {
    if (!gameActive) return;

    // Only count if the face is currently visible
    if (face.classList.contains("show")) {
      score++;
      scoreDisplay.textContent = score;

      // Play bomp sound
      bompSound.currentTime = 0;
      bompSound.play();

      // Apply red border effect
      face.classList.add("clicked");

      // Remove the border after 200ms
      setTimeout(() => {
        face.classList.remove("clicked");
      }, 200);

      // Hide face immediately after click (optional)
      face.classList.remove("show");
    }
  });
});

// Function to end the game
function endGame() {
  gameActive = false;

  // Stop intervals
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  // Hide all faces
  holes.forEach(face => face.classList.remove("show"));

  // Reset button text
  startBtn.textContent = "Start Game";

  // Show final message and play sound
  let message = "";
  if (score === 0) {
    message = "Ouch! Not even one? Better luck next time!";
    gameEndSound.play();
  } else if (score < 10) {
    message = `You scored ${score}. Not bad — but those faces got the best of you!`;
    gameEndSound.play();
  } else if (score < 20) {
    message = `Great job! ${score} faces bonked!`;
    gameEndHighSound.play();
  } else {
    message = `Legendary! ${score} faces smashed! You're a true FaceBomp champ 🎉`;
    gameEndHighSound.play();
  }

  finalMessage.textContent = message;
}

// Attach event listener to start button
startBtn.addEventListener("click", startGame);
