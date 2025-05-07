const gameArea = document.getElementById("game");
const wordDisplay = document.getElementById("wordDisplay");
const wordInput = document.getElementById("wordInput");
const scoreDisplay = document.getElementById("score");
const gameOverUI = document.getElementById("gameOverUI");
const restartPrompt = document.getElementById("restartPrompt");
const restartWordInput = document.getElementById("restartWordInput");
const definitionDisplay = document.getElementById("definition");

const dictionary = [
  { word: "apple", definition: "A round fruit with red or green skin." },
  { word: "banana", definition: "A long, curved fruit with a yellow skin." },
  { word: "cherry", definition: "A small, round, red fruit." },
  { word: "dragon", definition: "A large, mythical creature that breathes fire." },
  { word: "element", definition: "A basic constituent part of something." },
  { word: "forest", definition: "A large area covered chiefly with trees and undergrowth." },
  { word: "giant", definition: "An imaginary or mythical being of human form but superhuman size." },
  { word: "hover", definition: "To remain in one place in the air." },
  { word: "illusion", definition: "A false idea or belief." },
  { word: "jungle", definition: "An area of land overgrown with dense forest and tangled vegetation." },
  { word: "kingdom", definition: "A country, state, or territory ruled by a king or queen." },
  { word: "light", definition: "Visible radiant energy." },
  { word: "mirror", definition: "A reflective surface." },
  { word: "night", definition: "The time of darkness between sunset and sunrise." },
  { word: "ocean", definition: "A very large expanse of sea." },
  { word: "power", definition: "The ability to do something or act in a particular way." },
  { word: "quest", definition: "A long search for something." },
  { word: "river", definition: "A large natural stream of water flowing to the sea." },
  { word: "storm", definition: "A violent disturbance of the atmosphere." },
  { word: "thunder", definition: "A loud rumbling or crashing noise heard after a lightning flash." },
  { word: "umbrella", definition: "A device for protection against the rain." },
  { word: "violet", definition: "A small plant with purple flowers." },
  { word: "wizard", definition: "A man who has magical powers." },
  { word: "xenon", definition: "A chemical element." },
  { word: "yonder", definition: "At some distance in the direction indicated." },
  { word: "zebra", definition: "An African wild horse with black-and-white stripes." }
];

let score = 0;
let currentWordObj = getRandomWord();
let currentWord = currentWordObj.word;
let foodPos = getRandomPosition();
let snake = [{ x: 0, y: 0 }];
let direction = "right";
let gameOver = false;
let foodReady = true;

renderGame();
wordDisplay.textContent = currentWord;
wordInput.focus();

wordInput.addEventListener("input", () => {
  const typed = wordInput.value;

  if (currentWord.startsWith(typed)) {
    wordInput.style.background = "#fff";
  } else {
    wordInput.style.background = "#f88";
    score = Math.max(0, score - 1);
    scoreDisplay.textContent = `Score: ${score}`;
    wordInput.value = "";
  }

  if (typed === currentWord) {
    wordInput.value = "";
    wordInput.style.background = "#fff";
    currentWordObj = getRandomWord();
    currentWord = currentWordObj.word;
    wordDisplay.textContent = currentWord;
    foodPos = getRandomPosition();
    foodReady = true;
    growSnake();
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  }
});

function renderGame() {
  gameArea.innerHTML = "";
  snake.forEach(part => {
    const snakeEl = document.createElement("div");
    snakeEl.classList.add("snake-part");
    snakeEl.style.left = part.x + "px";
    snakeEl.style.top = part.y + "px";
    gameArea.appendChild(snakeEl);
  });
  if (foodReady) {
    const foodEl = document.createElement("div");
    foodEl.classList.add("food");
    foodEl.style.left = foodPos.x + "px";
    foodEl.style.top = foodPos.y + "px";
    gameArea.appendChild(foodEl);
  }
}

function growSnake() {
  const tail = snake[snake.length - 1];
  snake.push({ ...tail });
}

function getRandomPosition() {
  const gridSize = 20;
  const maxX = 380;
  const maxY = 380;
  return {
    x: Math.floor(Math.random() * (maxX / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (maxY / gridSize)) * gridSize
  };
}

function getRandomWord() {
  return dictionary[Math.floor(Math.random() * dictionary.length)];
}

function checkCollisionWithFood() {
  const head = snake[0];
  if (head.x === foodPos.x && head.y === foodPos.y && foodReady) {
    foodReady = false;
  }
}

function checkWallCollision() {
  const head = snake[0];
  if (head.x < 0 || head.y < 0 || head.x >= 400 || head.y >= 400) {
    gameOver = true;
    wordInput.disabled = true;
    const restartWordObj = getRandomWord();
    restartPrompt.textContent = `Game Over! Type the word "${restartWordObj.word}" to restart:`;
    definitionDisplay.textContent = `Meaning: ${restartWordObj.definition}`;
    gameOverUI.dataset.word = restartWordObj.word;
    gameOverUI.style.display = "block";
    restartWordInput.focus();
  }
}

function restartGame() {
  const typedWord = restartWordInput.value.trim().toLowerCase();
  const requiredWord = gameOverUI.dataset.word;

  if (typedWord === requiredWord) {
    gameOver = false;
    score = 0;
    snake = [{ x: 0, y: 0 }];
    direction = "right";
    foodPos = getRandomPosition();
    foodReady = true;
    currentWordObj = getRandomWord();
    currentWord = currentWordObj.word;
    wordDisplay.textContent = currentWord;
    scoreDisplay.textContent = `Score: ${score}`;
    wordInput.disabled = false;
    wordInput.value = "";
    restartWordInput.value = "";
    wordInput.focus();
    gameOverUI.style.display = "none";
  }
}

window.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  else if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (e.key === "ArrowDown" && direction !== "up") direction = "down";
});

setInterval(() => {
  if (gameOver) return;

  const head = { ...snake[0] };
  if (direction === "right") head.x += 20;
  if (direction === "left") head.x -= 20;
  if (direction === "up") head.y -= 20;
  if (direction === "down") head.y += 20;

  snake.unshift(head);
  snake.pop();

  checkWallCollision();
  checkCollisionWithFood();
  renderGame();
}, 200);
