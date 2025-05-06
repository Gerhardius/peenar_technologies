const snowContainer = document.querySelector('#snow-system');
const snowflakes = [];

const originalSnowflakeImage = "snowflake.png"; // Ursprüngliches Schneeflocken-Bild
const newSnowflakeImage = "star.png"; // Neues Schneeflocken-Bild nach Klick

const snowflakeImage = originalSnowflakeImage; // Anfangs das originale Schneeflocken-Bild
for (let index = 0; index < 50; index++) {
    let flake = document.createElement("a-image");

    let posX = Math.random() * 10 - 5;
    let posY = Math.random() * 5 + 2; // höher starten
    let posZ = Math.random() * 10 - 5;

    // Korrekte Formatierung des Positions-Strings
    flake.setAttribute("position", `${posX} ${posY} ${posZ}`);
    flake.setAttribute("src", snowflakeImage);
    flake.setAttribute("width", "0.2"); // Breite des Bildes
    flake.setAttribute("height", "0.2"); // Höhe des Bildes
    flake.setAttribute("transparent", "true"); // PNGs mit Transparenz

    // Für Fallbewegung
    flake.setAttribute("snowflake", "");

    snowContainer.appendChild(flake);
    snowflakes.push(flake);
}

const spheal = document.createElement("a-image");
spheal.setAttribute("src", "spheal.png");
spheal.setAttribute("position", "1 1.5 -1.5");
spheal.setAttribute("width", "1");
spheal.setAttribute("height", "1");
spheal.setAttribute("transparent", "true");
spheal.setAttribute("face-camera", ""); // Setze face-camera als leeres Attribut
snowContainer.appendChild(spheal);

AFRAME.registerComponent('face-camera', {
  tick: function () {
    const camera = document.querySelector('[camera]').object3D;
    this.el.object3D.lookAt(camera.position);
  }
});

AFRAME.registerComponent('snowflake', {
   tick: function (_time, timeDelta) {
     let pos = this.el.object3D.position;
     pos.y -= timeDelta * 0.001; // Geschwindigkeit

     if (pos.y < -1) {
       pos.y = Math.random() * 5 + 3; // Wieder oben erscheinen
       pos.x = Math.random() * 10 - 5;
       pos.z = Math.random() * 10 - 5;
     }
   }
});

// Initiale Bilder und Zustände
let originalSky = "wasser.jpg"; // Ursprüngliches Sky-Bild
let originalSpheal = "spheal.png"; // Ursprüngliches Spheal-Bild
let newSky = "night.jpg"; // Neues Sky-Bild für den Klick
let newSpheal = "spheal_eepy.png"; // Neues Spheal-Bild#


// Event-Listener für das Spheal-Bild
spheal.addEventListener('click', function () {
  let skyElement = document.querySelector('a-sky');
  
  // Überprüfen, welches Sky-Bild angezeigt wird
  if (skyElement.getAttribute('src') === originalSky) {
    // Setze das neue Sky und Spheal Bild
    skyElement.setAttribute('src', newSky);
    spheal.setAttribute('src', newSpheal);
    
    // Ändere das Schneeflocken-Bild
    snowflakes.forEach(flake => {
      flake.setAttribute('src', newSnowflakeImage);
    });
  } else {
    // Setze das ursprüngliche Sky und Spheal Bild zurück
    skyElement.setAttribute('src', originalSky);
    spheal.setAttribute('src', originalSpheal);
    
    // Setze das ursprüngliche Schneeflocken-Bild zurück
    snowflakes.forEach(flake => {
      flake.setAttribute('src', originalSnowflakeImage);
    });
  }
});