// Dom
let canvas = document.getElementById('canvas')
let instruksi = document.getElementById('instructions');
let inputName = document.getElementById('inputName');
let btnStart = document.getElementById('btnStart');
let rewindRange = document.getElementById('rewindRange');
let btnRewind = document.getElementById('btnRewind');
let btnCancel = document.getElementById('btnCancel');
score = document.getElementById('score');

var sec = 0;









// snake
class Snake {
    constructor(params) {
        this.canvas = params.el;
        this.canvas.width  = params.width;
        this.canvas.height = params.height;
        this.ctx = this.canvas.getContext('2d');
        this.gameStatus = true;
        this.score = params.score;
        
        this.blocks = [];
        this.Barisblok = params.Barisblok;
        this.blockSize = {
            w: this.canvas.width / this.Barisblok.x,
            h: this.canvas.height / this.Barisblok.y
        }

        this.snakes = [];
        this.snakeTemp = [];
        this.snakeLength = params.length;
        this.snakeColor = params.snakeColor;
        this.snakeBorderColor = params.snakeBorderColor;
        this.snakesDirection = 'right';
        this.snakePositions = [];
        this.snakeSpeed = 250;
        this.snakeDx = this.blockSize.w;
        this.snakeDy = 0;

        this.foodQuantity = 3;
        this.foods = [];
        this.foodColor = params.foodColor;
        this.generateFoodEvery = params.generateFoodEvery;
    }

    init() {
        // make blocks
        for(let i = 0; i < this.Barisblok.y; i++){
            let row = [];
            for(let j = 0; j < this.Barisblok.x; j++){
                let background = (i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)? 'grey':'black'
                row.push({
                    background,
                    x: j * this.blockSize.w,
                    y: i * this.blockSize.h
                });
            }
            this.blocks.push(row);
        }
        
        // make snake 
        for(let i = 1; i <= this.snakeLength; i++) {
            let block = this.blocks[this.Barisblok.y/2][this.Barisblok.x/2-i]

            this.snakes.push({
                x: block.x,
                y: block.y
            });
        }

        // make food
        for (let i = 1; i <= this.foodQuantity; i++){
            this.generateFood();
        }

        this.events();
    }

    draw() {
        this.drawBlocks();
        this.drawSnake();
        this.drawFoods();
    }

    drawBlocks() {
        this.blocks.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                this.ctx.fillStyle = col.background;
                this.ctx.fillRect(col.x, col.y, this.blockSize.w, this.blockSize.h);
            })
        })
    }

    drawSnake() {
        this.snakes.forEach(snake => {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.snakeColor;
            this.ctx.strokeStyle = this.snakeBorderColor;
            this.ctx.rect(snake.x, snake.y, this.blockSize.w, this.blockSize.h);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        });
    }

    drawFoods(){
        this.foods.forEach(food => {
            this.ctx.fillStyle = this.foodColor;
            this.ctx.fillRect(food.x, food.y, this.blockSize.w, this.blockSize.h);
        });
    }

    start() {
        this.runRender();
    }

    runRender() {
        const numInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
            this.update();
            console.log('tes')
            if (this.gameStatus == false) {
                clearInterval(numInterval);
                alert('Game Over');
            }
        }, this.snakeSpeed);
    }

    update(){
        this.updateSnake();
        this.updateScore();
    }

    updateSnake(){
        // membuat kepala ular
        let newHead = {
            x: this.snakes[0].x + this.snakeDx,
            y: this.snakes[0].y + this.snakeDy
        };
        this.snakes.unshift(newHead);

        let isEat = this.isSnakeEat();
        if (!isEat) {
            this.snakes.pop();
        }

        // jika ular menabrak batas
        if (newHead.x < 0) {
            this.gameOver();
        }
        if (newHead.y < 0) {
            this.gameOver();
        }
        else if(newHead.x + this.blockSize.w > this.canvas.width){
            this.gameOver();
        }
        else if(newHead.y + this.blockSize.h > this.canvas.height){
            this.gameOver();
        }

        this.snakes.forEach((snake, index) => {
            if(index > 0){
                if(newHead.x == snake.x && newHead.y == snake.y) {
                    this.gameOver();
                } 
            }
        })
    }

    updateScore(){
        this.score.innerText = this.snakes.length;
    }
    upda

    gameOver(){
        this.gameStatus = false;
    }

    randomInt(min, max){
        return Math.floor(Math.random() * max) + min;
    }

    generateFood(){
        let food = this.blocks[this.randomInt(1, this.Barisblok.y-2)][this.randomInt(1, this.Barisblok.x - 2)];



        this.foods.push(food);
    }

    isSnakeEat() {
        let head = this.snakes[0];
        let eaten = false;
        let foodEatenIndex = null;
        
        this.foods.forEach((food, index) =>{
            if (head.x == food.x && head.y == food.y) {
                eaten = true;
                foodEatenIndex = index;

                return true
            }
        });

        if(foodEatenIndex !== null) {
            this.foods.splice(foodEatenIndex, 1);
        }
        
        return eaten;

    }

    time(val){
        return val > 9 ? val : '0' + val;
    }

    runTimer(){
        setInterval(() => {
            document.getElementById('seconds').innerHTML = this.time(++sec % 60);
            document.getElementById('minutes').innerHTML = this.time(parseInt(sec/60));
        }, 1000);
    }

    events(){
        let _this = this;
        
        this.canvas.addEventListener('keyup', function(e){
            if ((e.key == 'w' || e.key == 'arrowUp') && _this.snakeDirection != 'down') {
                _this.snakeDy = -_this.blockSize.h;
                _this.snakeDx = 0;
                _this.snakeDirection = 'up';
            }
            else if((e.key == 's' || e.key == 'arrowDown') && _this.snakeDirection != 'up') {
                _this.snakeDy = _this.blockSize.h;
                _this.snakeDx = 0;
                _this.snakeDirection = 'down';
            }
            else if ((e.key == 'd' || e.key == 'arrowRight') && _this.snakeDirection != 'left') {
                _this.snakeDy = 0;
                _this.snakeDx = _this.blockSize.w;
                _this.snakeDirection = 'right'
            }
            else if ((e.key == 'a' || e.key == 'arrowLeft') && _this.snakeDirection != 'right') {
                _this.snakeDy = 0;
                _this.snakeDx = -_this.blockSize.w;
                _this.snakeDirection = 'left'
            }
        });

        setInterval(() => {
            if (this.foods.length >= 5) {
                return
            }
            this.generateFood();
        }, this.generateFoodEvery);
    }
}






// main
let snake = new Snake({
    el: canvas,
    width: 960,
    height: 600,
    score,
    length: 6,
    snakeColor: 'yellow',
    snakeBorderColor: 'black',
    foodColor: 'lime',
    generateFoodEvery: 3000,
    Barisblok: {
        x: 48,
        y: 30
    }
})

snake.runTimer();

inputName.addEventListener('input', function(name){
    if(name.target.value == ''){
        btnStart.setAttribute('dsabled', true)
    }
    else{
        btnStart.removeAttribute('disabled')
    }
});

btnStart.addEventListener('click', function(){
    instruksi.style.display = 'none'
    playground.style.display = 'flex'

    // masuk game
    snake.init();
    snake.start();
});

btnRewind.addEventListener('click', function(){
    rewindRange.style.display = 'block';
    btnCancel.style.display = 'flex';
    btnRewind.style.display = 'none';
    rewindRange.value = 5;
});

btnCancel.addEventListener('click', function(){
    rewindRange.style.display = 'none';
    btnCancel.style.display = 'none';
    btnRewind.style.display = 'flex';
});