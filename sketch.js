let bubbles = []; // array to hold bubble objects
let clicks = 0; // counter to track the number of clicks
let targetClicks = 1; // target number of clicks to double the bubbles

function setup() {
  // Convert inches to pixels (assuming 96 pixels per inch)
  let canvasWidth = int((8.5 + 7) * 96); // 8.5 inches (standard width) + 7 inches

  createCanvas(canvasWidth, 600);
  noStroke();

  // Initial bubble creation
  for (let i = 0; i < targetClicks; i++) {
    bubbles.push(new GhostlyBubble());
  }
}

function draw() {
  background('black');

  // Display instructions
  fill(255);
  textSize(18);
  textAlign(CENTER, TOP);
  text("Vengeful spirits are out to harm you to keep you from knowing the truth. Get rid of as many as you can, before you get trapped into insanity like the patients.", width / 2, 10);

  // loop through bubbles with a for..of loop
  for (let bubble of bubbles) {
    bubble.update(); // update bubble position
    bubble.display(); // draw bubble
    bubble.displaySmoke(); // display smoke flare effect
  }
}

function mousePressed() {
  // check if mouse is inside any bubble
  for (let i = bubbles.length - 1; i >= 0; i--) {
    if (bubbles[i].contains(mouseX, mouseY)) {
      // pop the bubble
      bubbles.splice(i, 1);

      // increment click counter
      clicks++;

      // check if the required number of clicks is reached to double bubbles
      if (clicks === targetClicks) {
        // double the target clicks and reset the click counter
        targetClicks *= 2;
        clicks = 0;

        // spawn double the number of bubbles
        for (let j = 0; j < targetClicks; j++) {
          bubbles.push(new GhostlyBubble());
        }
      }
    }
  }
}

// ghostly bubble class
class GhostlyBubble {
  constructor() {
    // initialize coordinates
    this.posX = random(width);
    this.posY = random(height);
    this.size = random(10, 30); // reduced size range for smaller bubbles
    this.speedX = random(-1, 1); // set a random horizontal speed
    this.speedY = random(-1, 1); // set a random vertical speed
    this.angle = 0; // angle for wobbling motion
    this.wobbleSpeed = 0.05; // speed of wobbling
    this.wobbleRange = 10; // range of wobbling motion
    this.color = color(255, 255); // white color
    this.smokeParticles = []; // array to hold smoke particles
    this.numSmokeParticles = 5; // reduced number of smoke particles
  }

  update() {
    // move the bubble
    this.posX += this.speedX;
    this.posY += this.speedY;

    // wobble motion
    this.angle += this.wobbleSpeed;
    this.posX += sin(this.angle) * this.wobbleRange;

    // wrap around the screen
    this.posX = (this.posX + width) % width;
    this.posY = (this.posY + height) % height;
  }

  display() {
    fill(this.color);
    ellipse(this.posX, this.posY, this.size * 2); // make shape larger
  }

  displaySmoke() {
    // create and display reduced number of smoke particles
    for (let i = 0; i < this.numSmokeParticles; i++) {
      let smokeParticle = new SmokeParticle(this.posX, this.posY, this.size);
      this.smokeParticles.push(smokeParticle);
    }

    // loop through smoke particles
    for (let smokeParticle of this.smokeParticles) {
      smokeParticle.update();
      smokeParticle.display();
    }

    // remove faded smoke particles
    this.smokeParticles = this.smokeParticles.filter(particle => particle.alpha > 0);
  }

  contains(x, y) {
    // check if a point (x, y) is inside the bubble
    let d = dist(x, y, this.posX, this.posY);
    return d < this.size;
  }
}

// smoke particle class
class SmokeParticle {
  constructor(x, y, bubbleSize) {
    this.posX = x + random(-bubbleSize, bubbleSize);
    this.posY = y + random(-bubbleSize, bubbleSize);
    this.size = random(3, 8); // reduced size range for smaller smoke particles
    this.alpha = 255;
  }

  update() {
    // move and fade smoke particle
    this.posX += random(-1, 1);
    this.posY += random(-1, 1);
    this.alpha -= 2;
  }

  display() {
    fill(255, this.alpha);
    ellipse(this.posX, this.posY, this.size);
  }
}

