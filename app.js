const cards = document.querySelectorAll('.game-card');
const panels = {
  snake: document.getElementById('snake-panel'),
  tic: document.getElementById('tic-panel')
};

cards.forEach((card) => {
  card.addEventListener('click', () => {
    const selected = card.dataset.game;
    cards.forEach((c) => c.classList.toggle('active', c === card));
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('active', key === selected);
    });
  });
});

// Snake game
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const scoreEl = document.getElementById('snake-score');
const bestEl = document.getElementById('snake-best');
const snakeReset = document.getElementById('snake-reset');

let snake;
let food;
let direction;
let nextDirection;
let snakeScore;
let best = Number(localStorage.getItem('snake-best-score') || 0);
bestEl.textContent = best;

function resetSnake() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  snakeScore = 0;
  scoreEl.textContent = snakeScore;
  spawnFood();
}

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize + 1, y * gridSize + 1, gridSize - 2, gridSize - 2);
}

function gameLoop() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    resetSnake();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    snakeScore += 1;
    scoreEl.textContent = snakeScore;
    if (snakeScore > best) {
      best = snakeScore;
      localStorage.setItem('snake-best-score', String(best));
      bestEl.textContent = best;
    }
    spawnFood();
  } else {
    snake.pop();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTile(food.x, food.y, '#f97316');
  snake.forEach((segment, index) => {
    drawTile(segment.x, segment.y, index === 0 ? '#22d3ee' : '#14b8a6');
  });
}

snakeReset.addEventListener('click', resetSnake);

document.addEventListener('keydown', (event) => {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };

  if (event.key.toLowerCase() === 'r') {
    resetSnake();
    return;
  }

  const newDirection = keyMap[event.key];
  if (!newDirection) {
    return;
  }

  if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
    return;
  }

  nextDirection = newDirection;
});

resetSnake();
setInterval(gameLoop, 110);

// Tic Tac Toe
const ticBoard = document.getElementById('tic-board');
const ticStatus = document.getElementById('tic-status');
const ticReset = document.getElementById('tic-reset');

let board;
let player;
let active;

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function evaluateBoard() {
  for (const [a, b, c] of wins) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return board.includes('') ? null : 'draw';
}

function renderBoard() {
  ticBoard.innerHTML = '';
  board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.className = 'tic-cell';
    cell.type = 'button';
    cell.textContent = value;
    cell.disabled = !active || value !== '';
    cell.addEventListener('click', () => handleMove(index));
    ticBoard.appendChild(cell);
  });
}

function handleMove(index) {
  if (!active || board[index]) return;

  board[index] = player;
  const result = evaluateBoard();

  if (result === 'draw') {
    ticStatus.textContent = "It's a draw!";
    active = false;
  } else if (result) {
    ticStatus.textContent = `Player ${result} wins!`;
    active = false;
  } else {
    player = player === 'X' ? 'O' : 'X';
    ticStatus.textContent = `Player ${player}'s turn`;
  }

  renderBoard();
}

function resetTicTacToe() {
  board = Array(9).fill('');
  player = 'X';
  active = true;
  ticStatus.textContent = "Player X's turn";
  renderBoard();
}

ticReset.addEventListener('click', resetTicTacToe);
resetTicTacToe();
