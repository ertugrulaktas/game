const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 24;
const tileCount = canvas.width / gridSize;

let snake;
let direction;
let queuedDirection;
let apple;
let score;
let highScore;
let speed;
let gameOver;
let started;
let intervalId;

const keyToDirection = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function loadHighScore() {
  const saved = Number(localStorage.getItem('snake-high-score') || '0');
  return Number.isFinite(saved) ? saved : 0;
}

function saveHighScore(value) {
  localStorage.setItem('snake-high-score', String(value));
}

function randomCell() {
  return Math.floor(Math.random() * tileCount);
}

function spawnApple() {
  do {
    apple = { x: randomCell(), y: randomCell() };
  } while (snake.some((segment) => segment.x === apple.x && segment.y === apple.y));
}

function resetGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  queuedDirection = { ...direction };
  score = 0;
  speed = 110;
  gameOver = false;
  started = false;
  statusEl.textContent = 'Başlamak için bir tuşa bas.';
  statusEl.classList.remove('game-over');
  spawnApple();
  updateScore();
  draw();
}

function updateScore() {
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;
}

function setDirection(next) {
  if (!next) return;

  const isOpposite = next.x === -direction.x && next.y === -direction.y;
  if (!isOpposite) {
    queuedDirection = next;
    if (!started) {
      started = true;
      statusEl.textContent = 'Bol şans!';
    }
  }
}

function moveSnake() {
  direction = queuedDirection;
  const head = snake[0];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };

  const wallHit = nextHead.x < 0 || nextHead.x >= tileCount || nextHead.y < 0 || nextHead.y >= tileCount;
  const selfHit = snake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (wallHit || selfHit) {
    gameOver = true;
    statusEl.textContent = 'Oyun bitti! Yeniden başlat ile tekrar dene.';
    statusEl.classList.add('game-over');
    return;
  }

  snake.unshift(nextHead);

  const ateApple = nextHead.x === apple.x && nextHead.y === apple.y;
  if (ateApple) {
    score += 10;
    if (score > highScore) {
      highScore = score;
      saveHighScore(highScore);
    }
    if (speed > 70) speed -= 2;
    spawnApple();
    updateScore();
    restartLoop();
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 1; i < tileCount; i += 1) {
    const pos = i * gridSize;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
    ctx.stroke();
  }
}

function draw() {
  drawGrid();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  const r = gridSize * 0.35;
  ctx.arc(apple.x * gridSize + gridSize / 2, apple.y * gridSize + gridSize / 2, r, 0, Math.PI * 2);
  ctx.fill();

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#22c55e' : '#16a34a';
    ctx.fillRect(segment.x * gridSize + 1.5, segment.y * gridSize + 1.5, gridSize - 3, gridSize - 3);
  });
}

function gameTick() {
  if (gameOver || !started) {
    draw();
    return;
  }

  moveSnake();
  draw();
}

function restartLoop() {
  clearInterval(intervalId);
  intervalId = setInterval(gameTick, speed);
}

document.addEventListener('keydown', (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (Object.hasOwn(keyToDirection, key)) {
    setDirection(keyToDirection[key]);
  }
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

highScore = loadHighScore();
resetGame();
restartLoop();
