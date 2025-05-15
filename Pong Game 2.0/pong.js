document.getElementById("music").volume = 0.1;

//canvas properties aka Spielfeld
let board;
let boardWidth = 900;
let boardHeight = 400;
let context;

//players
let playerWidth = 10;
let playerHeight = 80;
let PlayerVelocityY = 0; //bewegung nur in y-Achse

let player1 = {
    x : 20,
    y : boardHeight/2,  // coord x20, y250
    width : playerWidth,
    height : playerHeight,
    velocityY : PlayerVelocityY,
}
let player2 = {
    x : boardWidth - playerWidth -20,       //urspruenglich 1470 aber so schlauer
    y : boardHeight/2,  //coord x1470 y250
    width : playerWidth,
    height : playerHeight,
    velocityY : PlayerVelocityY,
}


//ball spaeter uiiaiauiiiai cat
let ballWidth = 15;
let ballHeight = 15;
let ball = {
    x : boardWidth/2,
    y : boardHeight/2, //spawns in the middle of the canvas
    width : ballWidth,
    height : ballHeight,
    velocityX : 4,
    velocityY : 8, // y-achse bewegt ball schneller
}

let player1Score = 5;
let player2Score = 5;

//Sound für Ball (abprallen und Punkt bekommen
var plop = new Howl({
    src: ['vid/plop.mp3'] //Für aufprall von Ball auf Player
  });
var bing = new Howl({
    src: ['vid/bing.mp3'] //Für Punkt
});

var start = new Howl({
    src: ['vid/ping.mp3'] //Für Start
});
var stopp = new Howl({
    src: ['vid/pong.mp3'] //Für Stopp/Reset
});

var win = new Howl({
    src: ['vid/yippie.mp3'] //Für Gewinner
});

//für Spiel start/stopp/reset
let gameStarted = false;

//Buttons für das Spiel
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("stopButton").addEventListener("click", stopGame);
document.getElementById("resetButton").addEventListener("click", resetGameFull);


//Spiel starten
function startGame() {
    if (!gameStarted) {
        gameStarted = true;

        board = document.getElementById("board");
        board.width = boardWidth;
        board.height = boardHeight;
        context = board.getContext("2d");
        start.play(); //Soundeffekt

        requestAnimationFrame(update);
        document.addEventListener("keyup", movePlayer);
    }
}

//Spiel Stopp/Pausieren
function stopGame() {
    gameStarted = false;
    stopp.play(); //Soundeffekt
    context.clearRect(0, 0, board.width, board.height); // löcht aber setzt nicht zurück
    context.fillStyle = "#f8e1f6";
    context.font = "50px Arial";
    context.fillText("Game Stop", boardWidth / 2.35, boardHeight / 2);
}

// Spiel zurücksetzen
function resetGameFull() {
    player1Score = 5;
    player2Score = 5;
    ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: 4,
        velocityY: 8,
    };
    player1.y = boardHeight / 2;
    player2.y = boardHeight / 2;


    if (gameStarted) {
        context.clearRect(0, 0, board.width, board.height); // Löscht Spielfeld
        context.fillStyle = "#f8e1f6";
        context.fillText("Game Reset", boardWidth / 2.4, boardHeight / 2);
        stopp.play(); //Soundeffekt fürs stoppen
    }
    gameStarted = false;
}

function update () {
    if (!gameStarted) return;
    requestAnimationFrame(update);
    context.clearRect (0, 0, board.width, board.height); //loescht draw p1 u p2 
    
    //player1
    context.fillStyle = "#f8e1f6";
    //player1.y += player1.velocityY;  //+= == kombiniert add. und zuweisung bsp a= a+b == a+=b
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, player1.width, player1.height);
    
    //player2
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, player2.width, player2.height); //draw p2


    //ball
    context.fillStyle = "#ff00ff";
    ball.y += ball.velocityY;
    ball.x += ball.velocityX;
    context.fillRect(ball.x, ball.y, ball.width, ball.height); //draw ball

    if(ball.y <=0 || (ball.y + ball.height>= boardHeight)){
        ball.velocityY *= -1; //wenn ball top or bottom touch, dann in opposite direction
    }

    //ball bounce → wenn touch p1 || p2 opp direction
    if (detectCollision (ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX *= -1; //x-achse spiegel →wenn auf zb 2 erhoeht, dann kann man den ball in andere richtung LAUNCHEN
            plop.play();
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) {
            ball.velocityX *= -1;
            plop.play();
        }
    }

    //score stuff
    if (ball.x < 0) { //wenn ball auf links trifft
        player2Score++; //P2 bekommt ein Punkt
        player1Score--; //P1 verliert ein Punkt
        resetGame(1);
        bing.play();
    }
    else if (ball.x + ballWidth > boardWidth) {//falls ball rechte seite uebergeht
        player1Score++; //P1 bekommt ein Punkt
        player2Score--; //P2 verliert ein Punkt
        resetGame(-1);
        bing.play();
    }

    //Punkte überprüfen/ ob das spiel zuende ist
    checkGameEnd();

    //score draw
    context.font = "50px Arial"; //fragen warum groesse nich geaendert wird → weil css??
    context.fillStyle = "#f8e1f6";
    context.fillText(player1Score, boardWidth/5, 80);
    context.fillText(player2Score, boardWidth*4/5 -45, 80);
}

// Spiel beenden wenn ein spieler 10 punkte bekommt
function checkGameEnd() {
    if (player1Score >= 10 || player2Score >= 10) {
        gameStarted = false; // Spiel stoppen
        win.play(); //Sound fürs gewinnen
        context.clearRect(0, 0, board.width, board.height); // Spielfeld löschen
        context.fillStyle = "#f8e1f6";
        context.font = "50px Arial";
        if (player1Score >= 10) {
            context.fillText("Player 1 Wins!", boardWidth / 2.5, boardHeight /2);
        }
        else {
            context.fillText("Player 2 Wins!", boardWidth / 2.5, boardHeight /2);
        }
    }
}


function outOfBounds (yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight); // || = oder
}

//Controlls für ESP
function handleTouch12() {
    console.log("called in handleTouch12");
    player1.velocityY = -5;}

function handleTouch13() {
    console.log("called in handleTouch13");
    player1.velocityY = 5;}

function handleTouch14() {
    console.log("called in handleTouch14");
    player2.velocityY = -5;}

function handleTouch27() {
    console.log("called in handleTouch27");
    player2.velocityY = 5;}

//evtl ersetzen mit handletouch
function movePlayer (e) {
    //p1
    if(e.code == "KeyW") {  //wenn w gedrueckt ist, bewegt es sich infinitely hoch, bis s gedrueckt wird
        player1.velocityY = -5; //wie in scratch mit change x by 10 honestly
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 5;
    }
    //p2
    if(e.code == "ArrowUp") {
        player2.velocityY = -5;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 5;
    }
}

function detectCollision (a, b) {   //ball collides with p
    return a.x < b.x + b.width &&       //a's top left corner doesn't reach b's top right corner
            a.x + a.width > b.x &&      //a's top right corner passes b's top left corner
            a.y < b.y + b.height &&     //a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y;       //a's bottom left corner passes b's top left corner
}   

function resetGame (direction) {
    ball = {
        x : boardWidth/2,
        y : boardHeight/2, //spawns in the middle of the canvas
        width : ballWidth,
        height : ballHeight,
        velocityX : direction* 7,
        velocityY : 10, // y-achse bewegt ball schneller aber nur piu piu
    }
} 