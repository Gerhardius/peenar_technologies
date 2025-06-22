// Game constants and variables
const totalPairs = 10;
const board = document.getElementById("memory-board");
const statusText = document.getElementById("status");
const playerCountDisplay = document.getElementById("player-count");
const playerScoresList = document.getElementById("player-scores");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let currentPlayer = null;
let lockBoard = false;
let gameStarted = false;

// Initialize the game
function initGame() {
  createBoard();
  updateStatus();
}

// Create the game board
function createBoard() {
  board.innerHTML = '';
  const cardValues = [];
  
  for (let i = 1; i <= totalPairs; i++) {
    cardValues.push(i);
    cardValues.push(i);
  }

  shuffle(cardValues);

  cardValues.forEach(value => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = value;

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");
    const img = document.createElement("img");
    img.src = `images/bild${value}.jpg`;
    front.appendChild(img);

    const back = document.createElement("div");
    back.classList.add("card-back");

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    board.appendChild(card);

    card.addEventListener("click", () => handleCardClick(card));
  });
}

// Shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Handle card click
function handleCardClick(card) {
  if (!gameStarted) {
    startGame();
    return;
  }

  if (lockBoard || card.classList.contains("flipped") || currentPlayer !== clientId) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  // Send card flip to other players
  sendRequest('*broadcast-message*', ['card-flipped', clientId, card.dataset.value, Array.from(board.children).indexOf(card)]);

  if (flippedCards.length === 2) {
    lockBoard = true;
    setTimeout(checkForMatch, 800);
  }
}

// Check for matching cards
function checkForMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.value === card2.dataset.value;

  if (isMatch) {
    matchedPairs++;
    
    // Update score
    playerScores[currentPlayer] = (playerScores[currentPlayer] || 0) + 1;
    sendRequest('*broadcast-message*', ['score-update', playerScores]);
    
    flippedCards = [];
    lockBoard = false;

    if (matchedPairs === totalPairs) {
      statusText.textContent = "🎉 Spiel beendet!";
      sendRequest('*broadcast-message*', ['game-ended', playerScores]);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      lockBoard = false;

      // Switch player in order of their numbers
      const players = Object.keys(playerScores).sort((a, b) => playerNumbers[a] - playerNumbers[b]);
      const currentIndex = players.indexOf(currentPlayer);
      currentPlayer = players[(currentIndex + 1) % players.length];
      
      sendRequest('*broadcast-message*', ['player-turn', currentPlayer]);
      updateStatus();
    }, 600);
  }
}

// Update game status display
function updateStatus() {
  let statusMessage = '';
  
  if (!gameStarted) {
    statusMessage = "Warte auf Spieler...";
  } else if (currentPlayer === clientId) {
    statusMessage = "Du bist am Zug!";
  } else {
    statusMessage = `Spieler #${playerNumbers[currentPlayer]} ist am Zug`;
  }

  // Update scores display
  playerScoresList.innerHTML = '';
  const sortedPlayers = Object.keys(playerScores).sort((a, b) => playerNumbers[a] - playerNumbers[b]);
  
  for (const playerId of sortedPlayers) {
    const li = document.createElement('li');
    li.textContent = `Spieler #${playerNumbers[playerId]}: ${playerScores[playerId]} Paare`;
    if (playerId === clientId) li.style.fontWeight = 'bold';
    playerScoresList.appendChild(li);
  }

  statusText.textContent = statusMessage;
}

// Start the game when enough players are present
function startGame() {
  if (clientCount >= 1 && !gameStarted) {
    gameStarted = true;
    
    // Initialize player scores
    playerScores = {};
    const players = Object.keys(playerNumbers);
    players.forEach(player => playerScores[player] = 0);
    
    // Start with player #0
    currentPlayer = Object.keys(playerNumbers).find(player => playerNumbers[player] === 0);
    matchedPairs = 0;
    createBoard();
    
    sendRequest('*broadcast-message*', ['game-started', playerScores, currentPlayer]);
    updateStatus();
  }
}

// Advance to the next player's turn
function advanceTurn() {
  if (Object.keys(playerScores).length === 0) return;
  
  const players = Object.keys(playerScores).sort((a, b) => playerNumbers[a] - playerNumbers[b]);
  const currentIndex = players.indexOf(currentPlayer);
  currentPlayer = players[(currentIndex + 1) % players.length];
  
  sendRequest('*broadcast-message*', ['player-turn', currentPlayer]);
  updateStatus();
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);