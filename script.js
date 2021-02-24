var canvas = document.getElementById("diffCanvas");
var ctx = canvas.getContext("2d");
var counter = 0;
var numberOfAttempts = 400;
//количество попыток роста, чем больше, тем быстрее вырастет
var requestId;
var matrix; //матрица пикселей канвы
var p, x, y;

function clearCanvas() {
    counter = 0;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    matrix = new Array(canvas.width);
    for (var x = 0; x < canvas.width; x++) {
        matrix[x] = new Array(canvas.height);
        for (var y = 0; y < canvas.height; y++) matrix[x][y] = 0;
        matrix[x][canvas.height - 1] = 1;
        ctx.fillRect(x, canvas.height - 1, 1, 1);
    }
    p = new Particle();
}

function Particle() {
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = 0;
    this.speed = 1;
    this.angle = Math.random() * 2 * Math.PI;
    this.move = function() {
        this.angle += Math.random() - 0.5;
        //угол от 0 до Pi:
        if (this.angle > Math.PI) this.angle = Math.PI;
        else if (this.angle < 0) this.angle = 0;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        //выход за экран:    
        if (this.x >= canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width - 1;
        if (this.y >= canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height - 1;
    }
}

function isCollition(x, y) { //есть коллизия с имеющейся точкой
    if (x < 0 || x >= matrix.length || y < 0 || y >= matrix[x].length) return false;
    return matrix[x][y] === 1;
}

function walk() { //основная функция
    for (var i = 0; i < numberOfAttempts; i++) {
        do {
            p.move();
            x = Math.round(p.x);
            y = Math.round(p.y);
        } while (!(isCollition(x - 1, y - 1) || isCollition(x, y - 1) || isCollition(x + 1, y - 1) ||
                isCollition(x - 1, y) || isCollition(x, y) || isCollition(x + 1, y) ||
                isCollition(x - 1, y + 1) || isCollition(x, y + 1) || isCollition(x + 1, y + 1)));
        if (y <= 1) { //костыль
            cancelAnimationFrame(requestId);
            this.speed = 0;
            return;
        }
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            matrix[x][y] = 1;
            ctx.fillStyle = "hsl(" + counter / (canvas.height / 2) + ", 100%, 50%)"; //начнём с красного
            ctx.fillRect(p.x, p.y, 1, 1);
            p = new Particle();
            x = Math.round(p.x);
            y = Math.round(p.y);
            counter++;
        }
    }
    requestId = requestAnimationFrame(walk);
}

canvas.onclick = function(event) {
    clearCanvas();
    walk();
}
window.addEventListener('load', function(e) {
    clearCanvas();
    walk();
}, false);