// Konstanta dan variabel
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
let gameInterval;
let gameSpeed = 500; // Waktu untuk gerakan tetromino (ms)

const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]]  // J
];

const colors = ['#00FFFF', '#FFFF00', '#800080', '#00FF00', '#FF0000', '#0000FF', '#FFA500'];
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let currentTetromino = generateTetromino();
let currentPos = { x: 4, y: 0 };

// Menangani menu
const menu = document.getElementById('menu');
const optionsMenu = document.getElementById('options-menu');
const canvasElement = document.getElementById('tetris');
const continueButton = document.getElementById('continue-btn');
const newGameButton = document.getElementById('new-game-btn');
const optionsButton = document.getElementById('options-btn');
const backButton = document.getElementById('back-btn');
const levelButtons = document.querySelectorAll('.level-btn');

// Fungsi untuk menggambar blok di canvas
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#222';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Fungsi untuk menggambar papan
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, board[y][x]);
            }
        }
    }
}

// Fungsi untuk menggambar tetromino saat ini
function drawTetromino() {
    const tetromino = currentTetromino;
    const color = colors[tetrominoes.indexOf(tetromino)];
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x]) {
                drawBlock(currentPos.x + x, currentPos.y + y, color);
            }
        }
    }
}

// Fungsi untuk memeriksa apakah tetromino bisa jatuh lebih jauh
function isValidMove(tetromino, newPos) {
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x]) {
                const newX = newPos.x + x;
                const newY = newPos.y + y;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Fungsi untuk menempatkan tetromino di papan
function placeTetromino() {
    const tetromino = currentTetromino;
    const color = colors[tetrominoes.indexOf(tetromino)];
    for (let y = 0; y < tetromino.length; y++) {
        for (let x = 0; x < tetromino[y].length; x++) {
            if (tetromino[y][x]) {
                const boardX = currentPos.x + x;
                const boardY = currentPos.y + y;
                if (boardY >= 0) {
                    board[boardY][boardX] = color;
                }
            }
        }
    }
}

// Fungsi untuk menghapus baris yang penuh
function removeFullLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== null)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(null));
        }
    }
}

// Fungsi untuk menggerakkan tetromino ke bawah
function moveTetrominoDown() {
    if (isValidMove(currentTetromino, { x: currentPos.x, y: currentPos.y + 1 })) {
        currentPos.y++;
    } else {
        placeTetromino();
        removeFullLines();
        currentTetromino = generateTetromino();
        currentPos = { x: 4, y: 0 };
        if (!isValidMove(currentTetromino, currentPos)) {
            alert("Game Over!");
            resetGame();
        }
    }
}

// Fungsi untuk mereset permainan
function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentTetromino = generateTetromino();
    currentPos = { x: 4, y: 0 };
}

// Fungsi untuk menghasilkan tetromino baru
function generateTetromino() {
    const index = Math.floor(Math.random() * tetrominoes.length);
    return tetrominoes[index];
}

// Fungsi untuk memutar tetromino
function rotateTetromino() {
    const rotated = currentTetromino[0].map((_, index) => currentTetromino.map(row => row[index])).reverse();
    if (isValidMove(rotated, currentPos)) {
        currentTetromino = rotated;
    }
}

// Fungsi untuk menangani input keyboard
function handleInput(event) {
    if (event.key === 'ArrowLeft') {
        if (isValidMove(currentTetromino, { x: currentPos.x - 1, y: currentPos.y })) {
            currentPos.x--;
        }
    } else if (event.key === 'ArrowRight') {
        if (isValidMove(currentTetromino, { x: currentPos.x + 1, y: currentPos.y })) {
            currentPos.x++;
        }
    } else if (event.key === 'ArrowDown') {
        moveTetrominoDown();
    } else if (event.key === 'ArrowUp') {
        rotateTetromino();
    }
}

// Fungsi untuk memperbarui game setiap frame
function update() {
    moveTetrominoDown();
    drawBoard();
    drawTetromino();
}

// Fungsi untuk memulai permainan
function startGame(level) {
    gameSpeed = level === 'easy' ? 800 : level === 'medium' ? 500 : 300;
    menu.style.display = 'none';
    canvasElement.style.display = 'block';
    continueButton.style.display = 'inline-block';
    gameInterval = setInterval(update, gameSpeed);
}

// Event listeners untuk menu
newGameButton.addEventListener('click', () => {
    startGame('medium');
});

continueButton.addEventListener('click', () => {
    // Lanjutkan permainan (di sini bisa disesuaikan jika ada penyimpanan progres)
    gameInterval = setInterval(update, gameSpeed);
});

optionsButton.addEventListener('click', () => {
    menu.style.display = 'none';
    optionsMenu.style.display = 'block';
});

backButton.addEventListener('click', () => {
    optionsMenu.style.display = 'none';
    menu.style.display = 'block';
});

// Event listeners untuk memilih level
levelButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        startGame(e.target.getAttribute('data-level'));
    });
});
