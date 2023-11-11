
const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const handleControls = document.querySelectorAll('.controls i');

let gameOver = false
let foodX =13 , foodY = 10;
let snakeX = 5 , snakeY = 10;
let snakeBody = [];
let velocityX = 0 , velocityY = 0;
let score = 0;
let setIntervalId;
let highScore = localStorage.getItem('highScore') || 0;

const keypressed = new Audio('./sounds/keypressed.mp3');
const wallhit = new Audio('./sounds/wallhit.mp3');
const eat = new Audio('./sounds/eat.mp3');





const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handlerGameOver = () => {
    clearInterval(setIntervalId);
    alert('Game Over! press Ok to replay');
    location.reload();
}

const changeDirection = (e) => {
    keypressed.load()
    keypressed.play();
    if(e.key=='ArrowUp' && velocityY != 1){
        velocityX=0;
        velocityY=-1;
    }else if(e.key=='ArrowDown' && velocityY != -1){
        velocityX=0;
        velocityY=1;
    }else if(e.key == 'ArrowLeft' && velocityX != 1){
        velocityX=-1;
        velocityY=0;
    }else if(e.key == 'ArrowRight' && velocityX != -1){
        velocityX=1;
        velocityY=0;
    }
    
}

handleControls.forEach((key) => {
    key.addEventListener('click', ()=>{ changeDirection({key: key.dataset.key})});
})

const initGame = () => {

    if(gameOver) return handlerGameOver();

    let htmlMarkup = `<div class='food' style='grid-area: ${foodY}/ ${foodX}'></div>`;

    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition()
        snakeBody.push([foodX, foodY]);
        score++;

        highScore = score >= highScore ? score : highScore;

        localStorage.setItem('highScore', highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;

        eat.load();
        eat.play();
    }

    for(let i = snakeBody.length -1; i > 0; i--){
        snakeBody[i] = snakeBody[i -1];
    }

    snakeBody[0] = [snakeX, snakeY]


    snakeX +=velocityX;
    snakeY += velocityY;

    if(snakeX <= 0|| snakeX>30 || snakeY<=0 || snakeY>30){
        wallhit.play()
        gameOver = true
    }

    for(let i = 0; i < snakeBody.length ; i++){
        htmlMarkup += `<div class='head' style='grid-area: ${snakeBody[i][1]}/ ${snakeBody[i][0]}'></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true
        }
    }
    
    playBoard.innerHTML = htmlMarkup
}





changeFoodPosition();
initGame();
highScoreElement.innerHTML = `High Score: ${highScore}`;
setIntervalId = setInterval(initGame, 125);
document.addEventListener('keydown', changeDirection)