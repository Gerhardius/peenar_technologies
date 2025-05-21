const totalPairs = 10;
let images = [];
let cards = [];
let revealedCards = [];
let matchedPairs = 0;

let playerCount = 2;
let currentPlayer = 0;
let scores = [];

function startGame() {
  // Spieleranzahl holen
  playerCount = parseInt(document.getElementById("playerCount").value);
  if (playerCount < 1 || playerCount > 5) {
    alert("Bitte eine Spieleranzahl zwischen 1 und 5 wählen.");
    return;
  }

  scores = new Array(playerCount).fill(0);
  document.getElementById("player-setup").style.display = "none";
  document.getElementById("game-info").style.display = "block";

  loadImages();
  shuffleCards();
  renderBoard();
  updateInfo();
}

function restartGame() {
  matchedPairs = 0;
  currentPlayer = 0;
  revealedCards = [];
  scores = new Array(playerCount).fill(0);

  loadImages();
  shuffleCards();

  renderBoard();
  updateInfo();
}

function loadImages() {
  images = [];
  for (let i = 1; i <= totalPairs; i++) {
    images.push(`img/bild${i}.jpg`);  }

  cards = [...images, ...images];
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  cards.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = index;

    const img = document.createElement("img");
    img.src = src;

    card.appendChild(img);
    card.addEventListener("click", () => revealCard(card));
    board.appendChild(card);
  });
}

function revealCard(card) {
  const index = parseInt(card.dataset.index);
  if (card.classList.contains("revealed") || card.classList.contains("matched") || revealedCards.length === 2) return;

  card.classList.add("revealed");
  revealedCards.push({ card, index });

  if (revealedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = revealedCards;

  const firstImg = cards[first.index];
  const secondImg = cards[second.index];

  if (firstImg === secondImg) {
    first.card.classList.add("matched");
    second.card.classList.add("matched");
    scores[currentPlayer]++;
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      setTimeout(showWinner, 500);
    }
    revealedCards = [];
    updateInfo();
  } else {
    setTimeout(() => {
      first.card.classList.remove("revealed");
      second.card.classList.remove("revealed");
      revealedCards = [];
      nextPlayer();
    }, 1000);
  }
}

function nextPlayer() {
  currentPlayer = (currentPlayer + 1) % playerCount;
  updateInfo();
}

function updateInfo() {
  document.getElementById("currentPlayer").textContent = `Spieler ${currentPlayer + 1} ist am Zug`;

  let scoreText = scores.map((s, i) => `Spieler ${i + 1}: ${s} Punkt${s !== 1 ? 'e' : ''}`).join(" | ");
  document.getElementById("scores").textContent = scoreText;
}

function showWinner() {
  const maxScore = Math.max(...scores);
  const winners = scores.map((s, i) => (s === maxScore ? `Spieler ${i + 1}` : null)).filter(Boolean);

  alert(`WOOP WOOP WINNER ANNOUNCEMENT: ${winners.join(" & ")} mit ${maxScore} Punkt${maxScore !== 1 ? 'en' : ''}.`);
}