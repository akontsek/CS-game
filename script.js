const scoreDisplay = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const difficultyButtons = document.querySelectorAll('.difficulty button');

// Player and control variables
let player = { speed: 5, score: 0, active: false };
let keys = { ArrowLeft: false, ArrowRight: false };

// Speed levels
const speedLevels = {
    beginner: 3,
    advanced: 5,
    pro: 8
};

// Set up event listeners for difficulty selection buttons
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Set the player speed based on button clicked
        player.speed = speedLevels[button.id];
        
        // Highlight the selected difficulty button
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Start game on any key press
document.addEventListener('keydown', startGameOnKeyPress);

function startGameOnKeyPress(e) {
    startGame();
    document.removeEventListener('keydown', startGameOnKeyPress); // Remove event listener after game starts
}

// Event listeners for controls
document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

function startGame() {
    startScreen.classList.add('hide');
    gameArea.innerHTML = '';  // Clear obstacles
    player.score = 0;
    player.active = true;

    // Create cansat container
    let cansat = document.createElement('div');
    cansat.classList.add('cansat');

    // Create umbrella element
    let umbrella = document.createElement('div');
    umbrella.classList.add('umbrella');
    umbrella.innerHTML = '☂️';

    // Create can element
    let can = document.createElement('div');
    can.classList.add('can');
    can.innerHTML = '🥫';

    // Append umbrella and can to the cansat
    cansat.appendChild(umbrella);
    cansat.appendChild(can);

    gameArea.appendChild(cansat);
    player.x = cansat.offsetLeft;
    player.y = 0; // Start the cansat at the top of the game area

    // Create obstacles
    for (let i = 0; i < 3; i++) {
        createObstacle();
    }

    window.requestAnimationFrame(playGame);
}

function playGame() {
    if (player.active) {
        let cansat = document.querySelector('.cansat');
        moveObstacles(cansat);

        // Move cansat down (falling effect)
        player.y += player.speed;

        // Move cansat left or right with arrow keys
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < gameArea.offsetWidth - cansat.offsetWidth) player.x += player.speed;

        cansat.style.top = `${player.y}px`;
        cansat.style.left = `${player.x}px`;

        // Check if the cansat has fallen past the game area (for scoring)
        if (player.y > gameArea.offsetHeight - cansat.offsetHeight) {
            gameOver();
            return;
        }

        // Increase score as cansat falls
        player.score++;
        scoreDisplay.innerHTML = `Score: ${player.score}`;
        
        window.requestAnimationFrame(playGame);
    }
}

// Function to create an obstacle (cloud, bird, or UFO)
function createObstacle() {
    let obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    let obstacleType = ['cloud', 'bird', 'ufo'][Math.floor(Math.random() * 3)];
    obstacle.classList.add(obstacleType);

    obstacle.y = gameArea.offsetHeight + Math.floor(Math.random() * 500);  // Start off-screen at the bottom
    obstacle.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    obstacle.style.top = `${obstacle.y}px`;
    gameArea.appendChild(obstacle);
}

function moveObstacles(cansat) {
    let obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        obstacle.y -= player.speed;  // Move obstacles up
        obstacle.style.top = `${obstacle.y}px`;

        // If an obstacle moves out of the game area, reset its position to the bottom
        if (obstacle.y < -50) {
            obstacle.y = gameArea.offsetHeight + 50;
            obstacle.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
        }

        // Collision detection
        if (checkCollision(cansat, obstacle)) {
            gameOver();
        }
    });
}

function checkCollision(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        aRect.top > bRect.bottom ||
        aRect.bottom < bRect.top ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function gameOver() {
    player.active = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = `Game Over<br>Your final score is ${player.score}<br>Press Any Key to Restart.`;
    
    // Re-enable start on key press for restarting the game
    document.addEventListener('keydown', startGameOnKeyPress);
}
