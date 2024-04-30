 /* @Author-Bikash Shiwakoti - 000891600 
Date: 07/20/2023
all the logic to move, display snake, create food, board and eventHandlers  */
        
let svgns = "http://www.w3.org/2000/svg",
    board = document.getElementById('board'),
    score = 0, //set initial score 
    rectSize = 30, //snakle size
    boardSize = 15, //board size
    boardLimit = boardSize - 1,
    speedMs = 200, //snake spped
    bgMusic = new Audio('bgMusic.mp3')
    gamePaused = false;

/**
 * Function to draw the game board and set up initial game elements.
 * It initializes the board size, style, and displays the initial score.
 */
function drawBoard() {
    // Set the width of the game board SVG element based on the cell size and number of cells.
    board.setAttribute('width', rectSize * boardSize);

    // Set the height of the game board SVG element based on the cell size and number of cells.
    board.setAttribute('height', rectSize * boardSize);

    // Add a blue border to the game board with a width of rectSize pixels for visual appeal.
    board.setAttribute('style', 'border: ' + rectSize + 'px solid blue;');

    // Set the initial score value to 0 by updating the innerHTML of the scoreBox element.
    document.getElementById("scoreBox").innerHTML = "Score: 0";

    // Display the game screen by setting the display style property of the game-screen element to "block".
    document.getElementById("game-screen").style.display = "block";
}


let currentX = 5, //initial position X of snake
    currentY = 5,//initial position Y of snake
    nextMoveX = 0, //Starting move X of snake
    nextMoveY = 1,  //Starting move Y of snake
    boardArray = []; //boardarray to store snake body
let gameIsOver = false;
let gameStarted  = false;
let snakeLength = 1; //default size of snake


/**
 * Function to draw and move the snake body on the game board.
 * @param {number} x - The x-coordinate of the new position for the snake body element.
 * @param {number} y - The y-coordinate of the new position for the snake body element.
 */
function drawPoint(x, y) {
    // Create a new array representing the snake's body with its SVG rect element and its coordinates
    const snakeBody = [document.createElementNS(svgns, 'rect'), x, y];
    const snakeBodyObj = snakeBody[0]; // Get a reference to the SVG rect element of the snake's body

    // Set the attributes of the SVG rect element to position it on the board
    snakeBodyObj.setAttribute('x', x * rectSize);
    snakeBodyObj.setAttribute('y', y * rectSize);
    snakeBodyObj.setAttribute('height', rectSize); 
    snakeBodyObj.setAttribute('width', rectSize); 
    snakeBodyObj.setAttribute('class', 'snake'); // Set the class attribute of the snake body element to 'snake' (this may apply some CSS styles to the snake body)

    // Add the snake body element to the game board (SVG) to make it visible
    boardArray.push(snakeBody); // Add the snake body element to the boardArray to keep track of the snake's body parts
    board.appendChild(snakeBodyObj);

    // Check if the length of the snake's body exceeds the desired length (snakeLength)
    if (boardArray.length > snakeLength) {
        // If the snake's body is longer than the desired length, remove the oldest body part
        board.removeChild(boardArray[0][0]); // Remove the SVG rect element of the oldest body part from the game board
        boardArray.shift(); // Remove the oldest body part from the boardArray to keep the length within the desired limit
    }
}



/**
 * Function to set the position of the food on the game board.
 */
function setFood() {
    // Generate random coordinates for the food within the game board's boardSize
    let foodX = Math.floor((Math.random() * boardSize));
    let foodY = Math.floor((Math.random() * boardSize));

    // Create a new array representing the food with its SVG rect element and its coordinates
    food = [document.createElementNS(svgns, 'rect'), foodX, foodY];
    let food1 = food[0]; // Get a reference to the SVG rect element of the food

    // Set the attributes of the SVG rect element to position it on the board
    food1.setAttributeNS(null, 'x', foodX * rectSize);
    food1.setAttributeNS(null, 'y', foodY * rectSize);
    food1.setAttributeNS(null, 'rx', '15'); -
    food1.setAttributeNS(null, 'ry', '15'); 
    food1.setAttributeNS(null, 'height', rectSize); 
    food1.setAttributeNS(null, 'width', rectSize); 
    food1.setAttributeNS(null, 'class', 'food'); 

    // Add the food element to the game board (SVG) to make it visible
    board.appendChild(food1);
}


/**
 * Function to handle game over event.
 */
function gameOver() {
    bgMusic.pause(); // Pause the background music
    board.setAttributeNS(null, 'class', 'game-over'); // Set the class attribute of the board to 'game-over' (this may apply some CSS styles to indicate the game is over)
    clearInterval(timing); // Stop the game loop by clearing the interval
    alert('GAME OVER!\nYour result is ' + score + '!'); // Show an alert with the player's final score
    gameIsOver = true; // Set the gameIsOver flag to true to indicate the game has ended
    return; // The function doesn't need to return anything, as it doesn't have a specific return value.
}


let scoreBox = document.getElementById("scoreBox");
var timing;

/**
 * 
 * @returns next move of snake
 */
function controlSnake() {
if(gamePaused)return;

    let nextX = currentX + nextMoveX;
    let nextY = currentY + nextMoveY;
    boardArray.forEach(function(element){
        if (nextX === element[1] && nextY === element[2]) {  //check if snake collides with it's body
            gameOver();
        }
    });
    //check if snake collide with border
    if (nextY < 0 || nextY > boardLimit || nextX < 0 || nextX > boardLimit) { 
        gameOver();
    }
    if (!gameIsOver) {
        //check if snake eats food
        if (currentX === food[1] && currentY === food[2]) {
            score += 1;
            scoreBox.innerHTML = "Score: " + score;
            snakeLength++;
            board.removeChild(food[0]); //remove food
            setFood(); //set food again 
        }
        drawPoint(nextX, nextY);
        currentX = nextX;
        currentY = nextY;
    }
}

/**
 * function to move snake with key
 */
function setupEventListeners() {
    // Add event listener for arrow keys
    window.addEventListener('keydown', e => {
      

        switch (e.key) {
            case "ArrowUp":
                if (nextMoveY !== 1) { //check if snake is not going down
                    nextMoveX = 0;
                    nextMoveY = -1;
                }
                break;

            case "ArrowDown":
                if (nextMoveY !== -1) { //check if snake is not going up
                    nextMoveX = 0;
                    nextMoveY = 1;	
                }
                break;

            case "ArrowLeft":
                if (nextMoveX !== 1) { //check if snake is not going right
                    nextMoveX = -1;
                    nextMoveY = 0;
                }
                break;

            case "ArrowRight":
                if (nextMoveX !== -1) { //check if snake is not going left
                    nextMoveX = 1;
                    nextMoveY = 0;	
                }
                break;
        }
    });
}

/**
 * function to start game
 */
function startGame() {
    gamePaused = false;
    const inputElement = document.getElementById("snakeLength");
    const inputValue = parseInt(inputElement.value);
    bgMusic.loop = true; // Set the music to loop
    bgMusic.volume = 0.5; // Adjust the volume (0.0 to 1.0)
    bgMusic.play(); // Start playing the background music

    //check if input value is integer and within range
    if (!isNaN(inputValue) && (inputValue >= 2 && inputValue <= 5)) {
        snakeLength = inputValue; // set length according input
    } else {
        snakeLength = 1;
    }

    // Reset the game and start
    board.innerHTML = ''; // Clear the existing board
    boardArray = []; // Clear the snake body array
    currentX = 5; // Reset the starting position of the snake
    currentY = 5;
    nextMoveX = 0;
    nextMoveY = 1;
    score = 0; // Reset the score
    gameIsOver = false; // Reset the game over flag

    // Show the game screen and draw the board
    toogleScreen("start-screen", false);
    toogleScreen("game-screen", true);
    drawBoard();

    // Set the food
    setFood();

    // Clear any previous interval and start the game
    clearInterval(timing);
    timing = setInterval(controlSnake, speedMs);

    gameStarted = true;

    // Setup arrow key event listener
    setupEventListeners();
}
// Add event listener for the "Space" key to pause/resume the game
window.addEventListener('click', () => {
        gamePaused = !gamePaused; // Toggle the gamePaused variable
        if (gamePaused) {
            clearInterval(timing); // Pause the game loop
        } else {
            timing = setInterval(controlSnake, speedMs); // Resume the game loop
        }
    }
);

 /**
 * Toggles the display of an HTML element with the given ID.
* @param {string} id - The ID of the HTML element to be toggled.
* @param {boolean} toggle - If true, the element will be displayed (block), if false, it will be hidden (none).
*/
function toogleScreen(id, toggle) {
   // Get the HTML element by its ID
   let element = document.getElementById(id);

   // Determine the desired display style based on the 'toggle' parameter
   // If 'toggle' is true, the element will be displayed (block), otherwise, it will be hidden (none)
   let display = toggle ? "block" : "none";

   // Set the display style of the element
   element.style.display = display;
}

