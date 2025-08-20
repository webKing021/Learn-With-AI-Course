/* Temperature Control */
let temperature = 78;
const tempDisplay = document.getElementById('tempDisplay');

function increaseTemp() {
  temperature++;
  updateTempDisplay();
}

function decreaseTemp() {
  temperature--;
  updateTempDisplay();
}

function updateTempDisplay() {
  tempDisplay.textContent = temperature + "°F";
}

/* Lighting Toggle */
function toggleLights(el) {
  if (el.checked) {
    alert("Lights turned ON!");
  } else {
    alert("Lights turned OFF!");
  }
}

/* Music Control */
const songDisplay = document.getElementById('songDisplay');
const playBtn = document.getElementById('playBtn');

const songs = [
  "Dancing Llamas",
  "Penguin Polka",
  "Banana Boogie",
  "Socks in Space",
  "Funky Chicken Jam",
  "Octopus Opera",
  "Cactus Tango"
];

let isPlaying = false;
let currentSongIndex = null;

function playMusic() {
  if (!isPlaying) {
    currentSongIndex = currentSongIndex === null ? getRandomIndex() : currentSongIndex;
    songDisplay.textContent = songs[currentSongIndex];
    playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    isPlaying = true;
  } else {
    pauseMusic();
  }
}

function pauseMusic() {
  if (isPlaying) {
    songDisplay.textContent += " (Paused)";
    playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
    isPlaying = false;
  }
}

function stopMusic() {
  songDisplay.textContent = "No song playing";
  playBtn.innerHTML = '<i class="fas fa-play"></i> Play';
  isPlaying = false;
  currentSongIndex = null;
}

function nextTrack() {
  currentSongIndex = getRandomIndex();
  songDisplay.textContent = songs[currentSongIndex];
  if (!isPlaying) {
    playMusic();
  }
}

function getRandomIndex() {
  return Math.floor(Math.random() * songs.length);
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("Service Worker registered!", reg))
      .catch(err => console.log("Service Worker registration failed:", err));
  });
}
