let t = 0;

// Dieses Skript erzeugt das Hintergrund-Canvas mit p5.js
function setup() {
  // Erstelle das Hintergrund-Canvas
  let backgroundCanvas = document.getElementById('backgroundCanvas');
}
  //backgroundCanvas.parent('backgroundCanvas'); // Ordne das Canvas dem HTML-Div zu, um es richtig anzuzeigen

  /* Setze das Hintergrund-Canvas auf den gesamten Bildschirm, falls nötig
  backgroundCanvas.style('position', 'absolute');
  backgroundCanvas.style('top', '0');
  backgroundCanvas.style('left', '0');
  backgroundCanvas.style('z-index', '-1');  // Stellt sicher, dass das Hintergrund-Canvas hinter dem Spiel ist
}*/

function draw() {
    // set pen properties
    background(20,20)
    stroke(255, 0, 255); // draw with a white pen
    strokeWeight(5); // use a thickness of 5
  
    // shift the drawing into the center of the canvas
    translate(width / 2, height / 2);
    line(x1(t), y1(t),x2(t), y2(t)); // draw a point in the corner of the canvas
    t = t+0.05;
  }
  
  // use math to compute drawing position
  function x1(t) {
    return 200 * sin(3 * t) + 40 * sin(4 * t);
  }
  
  function y1(t) {
    return 200 * cos(0.8 * t);
  }
  
  function x2(t) {
    return 200 * sin(4 * t) + 40 * sin(4 * t);
  }
  
  function y2(t) {
    return 200 * cos(4 * t);
  }