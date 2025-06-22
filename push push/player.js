// Game constants
const PUSH_STRENGTH = 0.01; // Stronger pushes for better responsiveness
const WIN_THRESHOLD = 0.95;
const BAR_WIDTH = 50;
const BAR_HEIGHT = 200;
const RESET_DELAY = 3000;
const WEB_SOCKET_SERVER = 'wss://nosch.uber.space/web-rooms/';

// Game elements
const titleElem = document.getElementById('title-display');
const teamElem = document.getElementById('team-display');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Game state
let clientId = null;
let clientTeam = null;
let barPosition = 0.5;
let gameActive = true;
let socket = null;

function initGame() {
  updateCanvasSize();
  setupEventListeners();
  connectWebSocket();
  requestAnimationFrame(gameLoop);
}

function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function setupEventListeners() {
  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('resize', updateCanvasSize);
}

function connectWebSocket() {
  socket = new WebSocket(WEB_SOCKET_SERVER);

  socket.addEventListener('open', () => {
    console.log("Connected to server");
    sendToServer('*enter-room*', 'push-battle');
    // Request initial game state
    setTimeout(() => sendToServer('*broadcast-message*', 'request-state'), 500);
  });

  socket.addEventListener('close', () => {
    console.log("Disconnected from server");
    document.body.classList.add('disconnected');
  });

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      // Handle different message types
      if (data[0] === '*client-id*') {
        clientId = data[1];
        clientTeam = data[1] % 2 === 0 ? 'red' : 'blue';
        teamElem.textContent = `Team ${clientTeam.toUpperCase()}`;
        teamElem.style.color = clientTeam;
      } 
      else if (data[0] === '*broadcast-message*') {
        const messageType = data[1];
        const content = data[2];

        switch(messageType) {
          case 'state-update':
            barPosition = content.position;
            gameActive = content.active;
            break;
          case 'game-over':
            handleGameOver(content.winner);
            break;
          case 'reset-game':
            resetGame();
            break;
        }
      }
    } catch (e) {
      console.error("Message handling error:", e);
    }
  });
}

function onPointerDown(e) {
  if (!gameActive || !socket) return;

  const clickX = e.clientX / canvas.width;
  const isOnTeamSide = (clientTeam === 'red' && clickX > 0.5) || 
                      (clientTeam === 'blue' && clickX <= 0.5);

  if (isOnTeamSide) {
    const pushAmount = PUSH_STRENGTH * (clientTeam === 'red' ? 1 : -1);
    const newPosition = Math.max(0, Math.min(1, barPosition + pushAmount));
    
    if (newPosition !== barPosition) {
      barPosition = newPosition;
      sendToServer('*broadcast-message*', 'state-update', {
        position: barPosition,
        active: true
      });
      
      checkWinCondition();
    }
  }
}

function checkWinCondition() {
  if (barPosition >= WIN_THRESHOLD) {
    endGame('red');
  } else if (barPosition <= 1 - WIN_THRESHOLD) {
    endGame('blue');
  }
}

function endGame(winner) {
  gameActive = false;
  sendToServer('*broadcast-message*', 'game-over', { winner });
  setTimeout(resetGame, RESET_DELAY);
}

function handleGameOver(winner) {
  gameActive = false;
  alert(`${winner.toUpperCase()} team wins! Game will reset in ${RESET_DELAY/1000} seconds.`);
}

function resetGame() {
  barPosition = 0.5;
  gameActive = true;
  sendToServer('*broadcast-message*', 'reset-game');
}

function gameLoop() {
  render();
  requestAnimationFrame(gameLoop);
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw team areas
  context.fillStyle = 'rgba(255, 0, 0, 0.2)';
  context.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
  
  context.fillStyle = 'rgba(0, 0, 255, 0.2)';
  context.fillRect(0, 0, canvas.width / 2, canvas.height);
  
  // Draw push bar
  const barX = canvas.width * barPosition - BAR_WIDTH / 2;
  const barY = canvas.height / 2 - BAR_HEIGHT / 2;
  context.fillStyle = '#fff';
  context.fillRect(barX, barY, BAR_WIDTH, BAR_HEIGHT);
  
  // Draw center line
  context.strokeStyle = '#fff';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();
}

function sendToServer(...message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("Sending:", message);
    socket.send(JSON.stringify(message));
  } else {
    console.warn("Cannot send - socket not ready");
  }
}

// Initialize game
document.addEventListener('DOMContentLoaded', initGame);