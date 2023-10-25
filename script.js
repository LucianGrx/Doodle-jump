//board
let game;
let gameWidth = 360;
let gameHeight = 576;
let context;

//doodler

let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = gameWidth / 2 - doodlerWidth / 2;
let doodlerY = (gameHeight * 7) / 8 - doodlerHeight;
let doodlerLeftImg;
let doodlerRightImg;

let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  width: doodlerWidth,
  height: doodlerHeight,
};

//platforms

let platformsArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;
let platformImgRed;

//physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

//score

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function () {
  game = document.getElementById("game");
  game.width = gameWidth;
  game.height = gameHeight;
  context = game.getContext("2d");

  //Load image

  doodlerRightImg = new Image();
  doodlerRightImg.src = "./assets/doodler-right.png";
  doodler.img = doodlerRightImg;

  doodlerRightImg.onload = function () {
    context.drawImage(
      doodler.img,
      doodler.x,
      doodler.y,
      doodler.width,
      doodler.height
    );
  };

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "./assets/doodler-left.png";

  platformImg = new Image();
  platformImg.src = "./assets/platform.png";

  platformImgRed = new Image();
  platformImgRed.src = "./assets/platform-broken.png";

  velocityY = initialVelocityY;

  placePlatforms();
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  document.addEventListener("keydown", moveDoodler);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, game.width, game.height);
  //doodler
  doodler.x += velocityX;
  if (doodler.x > gameWidth) {
    doodler.x = 0;
  } else if (doodler.x + doodler.width < 0) {
    doodler.x = gameWidth;
  }

  velocityY += gravity;
  doodler.y += velocityY;
  if (doodler.y > game.height) {
    gameOver = true;
  }

  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y,
    doodler.width,
    doodler.height
  );

  //platforms
  for (let i = 0; i < platformsArray.length; i++) {
    let platform = platformsArray[i];
    if (velocityY < 0 && doodler.y < (gameHeight * 3) / 4) {
      platform.y -= initialVelocityY; //slide platform down
    }
    if (detectCollision(doodler, platform) && velocityY >= 0) {
      velocityY = initialVelocityY; //jumping
    }

    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }

  // remove platforms and add new platforms
  while (platformsArray.length > 0 && platformsArray[0].y > gameHeight) {
    platformsArray.shift(); // remove first elem from the array
    newPaltformGenerate();
  }

  //score

  updateScore();
  context.fillStyle = "black";
  context.font = "16px sans-serif";
  context.fillText(score, 5, 20);

  if (gameOver) {
    context.fillText(
      "Game Over: Press 'Space' to Restart",
      gameWidth / 7,
      (gameHeight * 7) / 8
    );
  }
}

function moveDoodler(e) {
  if (e.code == "ArrowRight" || e.code == "KeyD") {
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    //reset
    doodler = {
        img: doodlerRightImg,
        x: doodlerX,
        y: doodlerY,
        width: doodlerWidth,
        height: doodlerHeight,
      };

      velocityX = 0;
      velocityY = initialVelocityY;
      score = 0;
      maxScore = 0;
      gameOver = false;
      placePlatforms();
      
  }
}

function placePlatforms() {
  platformsArray = [];

  let platform = {
    img: platformImg,
    x: gameWidth / 2,
    y: gameHeight - 50,
    width: platformWidth,
    height: platformHeight,
  };

  platformsArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.floor((Math.random() * gameWidth * 3) / 4);
    let platform = {
      img: platformImg,
      x: randomX,
      y: gameHeight - 75 * i - 150,
      width: platformWidth,
      height: platformHeight,
    };
    platformsArray.push(platform);
  }
}

function newPaltformGenerate() {
  let randomX = Math.floor((Math.random() * gameWidth * 3) / 4);
  let platform = {
    img: platformImg,
    x: randomX,
    y: -platformHeight,
    width: platformWidth,
    height: platformHeight,
  };
  platformsArray.push(platform);
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && // a top left corner doesn't reach b top right corner
    a.x + a.width > b.x && // a top right corner passes b top left corner
    a.y < b.y + b.height && // a top left corner doens't reach b bottom left corner
    a.y + a.height > b.y
  ); // a top bottom left corner passes b top left corner
}

function updateScore() {
  let points = Math.floor(50 * Math.random());
  if (velocityY < 0) {
    //negative going up
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    }
  } else if (velocityY >= 0) {
    maxScore -= points;
  }
}
