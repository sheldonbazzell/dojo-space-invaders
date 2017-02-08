var canvas = document.getElementById('my-canvas'),
	ctx    = canvas.getContext('2d');
var rightPressed = false,
	leftPressed  = false;

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)

function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	} else if(e.keyCode == 37) {
		leftPressed = true;
	}
}
function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	} else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

document.onkeypress = function(e) {
	if(e.keyCode == 32) {
		shurikens.add();
	}
}

/*##################################################*/
/*#                  ninja class                   #*/
/*##################################################*/
function Ninja() {
	this.width  = 29;
	this.height = 43;
	this.lives	= 3;
	this.x      = canvas.width/2;
	this.y      = canvas.height - this.height/2 - 5;
	this.drawNinja = function(posX, posY) {
		ninja_image     = new Image();
		ninja_image.src = 'images/up1.png'
		ctx.drawImage(ninja_image, posX - this.width/2,
		posY - this.height/2, this.width, this.height);
	}
}

var ninja = new Ninja();

/*##################################################*/
/*#                highscore class                 #*/
/*##################################################*/
function HighScore() {
	this.amount = 0;
	this.show = function() {
		if(localStorage.getItem('highScore') == null) {
			localStorage.getItem('highScore') = 0;
		}
		document.getElementById('high-score').innerHTML = "<p>High Score: "+localStorage.getItem('highScore')+"</p>"
	}
	this.update = function() {
		if(score.amount > this.amount) {
			localStorage.setItem('highScore', score.amount);
			highScore.show();
		}
	}
}

var highScore = new HighScore()

/*##################################################*/
/*#                  score class                   #*/
/*##################################################*/
function Score() {
	this.amount = 0;
	this.increase = function() {
		this.amount +=10;
	}
}

var score = new Score();

/*##################################################*/
/*#            shurikens (parent) class            #*/
/*##################################################*/
function Shurikens() {
	this.arr = [];
	this.add = function() {
		this.arr.push(new Shuriken())
	}
	this.move = function() { 
		if(this.arr.length < 3) {
			for(var i = 0; i < this.arr.length; i++) {
				s = this.arr[i];
				s.draw(s.x, s.y);
				s.y = s.y + s.dy;
				if(s.x < 0 || s.x > ctx.width || s.y < 0) {
					this.arr.splice(i, 1);
				}
			}
		}
		else {
			this.arr.length = 3;
		}
	}
}
var shurikens = new Shurikens();

/*##################################################*/
/*#                 shuriken class                 #*/
/*##################################################*/
function Shuriken() {
	this.width  = 18;
	this.height = 18;
	this.dx     = 0;
	this.dy     = -2;
	this.x      = ninja.x;
	this.y      = ninja.y - ninja.height/2 - this.height/2;
	this.draw = function(posX, posY) {
		shuriken_image     = new Image();
		shuriken_image.src = 'images/ns1.png'
		ctx.drawImage(shuriken_image, posX - this.width/2,
		posY - this.height - 40, this.width, this.height);
	}
}

/*##################################################*/
/*#            invaders (parent) class             #*/
/*##################################################*/
function Invaders() {
	this.arr  = [];
	this.add = function() {
		this.arr.push(new Invader())
	}
	this.move = function() {
		for(var j = 0; j < invaders.arr.length; j++) {
			m = invaders.arr[j];
			m.draw(m.x, m.y);
			m.y = m.y + m.dy;
			if(m.x < 0 || m.x > canvas.width || m.y > canvas.height) {
				invaders.arr.splice(j, 1);
				ninja.lives--;
			}	
		}
	}
}
var invaders = new Invaders();

/*##################################################*/
/*#                 invader class                  #*/
/*##################################################*/
function Invader() {
	this.width  = 44;
	this.height = 33;
	this.x      = Math.floor(Math.random()*300);
	this.y      = 0;
	this.dx     = 0;
	this.dy     = 2;
	this.draw = function(posX, posY) {
		invader_image     = new Image();
		invader_image.src = 'images/spaceinvader.png'
		ctx.drawImage(invader_image, posX - this.width/2,
		posY, this.width, this.height);
	}
}
/*#            the invaders are coming             #*/
invaders.add();
setInterval(function() {
	invaders.add();
}, 500);
draw();

var explosionHeight = 20,
	explosionWidth  = 20,
	explosionX      = ninja.x,
	explosionY      = ninja.y;

/*##################################################*/
/*#                  game logic                    #*/
/*##################################################*/
function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Lives: " + ninja.lives, canvas.width-66, 20);
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Score: " + score.amount, canvas.width-66, 40);
}
function drawAmmo() {
	document.getElementById('ammo').innerHTML = "Shurikens: " + shurikens.arr.length;
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);	
	invaders.move();
	drawLives();
	drawAmmo();
	drawScore();
	shurikens.move();
	invaderNinjaCollision();
	highScore.show();
	invadershurikenCollision();
	ninja.drawNinja(ninja.x, ninja.y);
	if(rightPressed && ninja.x < (canvas.width - ninja.width/2)) {
		ninja.x +=3
	} else if(leftPressed && ninja.x > 15) {
		ninja.x -=3
	}
	for(var invader in invaders) {
		invaders[invader].y++;
	}
	for(var shuriken in shurikens) {
		shurikens[shuriken].y--;
	}
	if (ninja.lives == 0) {
		gameOver();
		drawExplosion();
	} else {
		requestAnimationFrame(draw);
	}
}
draw();


function gameOver() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ninja.drawNinja(ninja.x, ninja.y);
	invaders.move();
	drawLives();
	highScore.update();
	ctx.fillStyle = "Black";
	ctx.font      = "16px Arial";
	ctx.fillText("GAME OVER", canvas.width/2-50, canvas.height/2-10)
	document.onkeypress = function(e) {
		if(e.keyCode == 32) {
			document.location.reload();
		}
	}

}
/*##################################################*/
/*#                collision logic                 #*/
/*##################################################*/
function drawExplosion(posX, posY) {
	explosion_image     = new Image();
	explosion_image.src = 'images/poof1.png';
	ctx.drawImage(explosion_image, posX,
	posY, explosionWidth, explosionHeight);
}

function invaderNinjaCollision() {

	for(var i = 0; i < invaders.length; i++) {
		invader = invaders[i];
		invaderMinX = invader.x - invaderWidth/2;
		invaderMaxX = invader.x + invaderWidth/2;
		invaderMinY = invader.y - invaderHeight/2;
		invaderMaxY = invader.y + invaderHeight/2;

		ninjaMinX   = ninja.x    - ninja.width/2;
		ninjaMaxX   = ninja.x    + ninja.width/2;
		ninjaMinY   = ninja.y    - ninja.height/2;
		ninjaMaxY   = ninja.y    + ninja.height/2;

		if((ninjaMaxX > invaderMinX && ninjaMinX < invaderMaxX) &&
		(invaderMaxY > ninjaMinY && invaderMinY < ninjaMaxY)) {
			invaders.splice(i, 1);
			ninja.lives--;
		}
	}
}

function invadershurikenCollision() {
	for(var j = 0; j < invaders.arr.length; j++) {
		for(var k = 0; k < shurikens.arr.length; k++) {
			invader = invaders.arr[j];
			if(invader) {
				invaderMinX = invader.x - invader.width/2;
				invaderMaxX = invader.x + invader.width/2;
				invaderMinY = invader.y - invader.height/2;
				invaderMaxY = invader.y + invader.height/2;
			}
			if(shurikens) {
				shuriken = shurikens.arr[k]
				shurikenMinX = shuriken.x - shuriken.width/2;
				shurikenMaxX = shuriken.x + shuriken.width/2;
				shurikenMinY = shuriken.y - shuriken.height/2;
				shurikenMaxY = shuriken.y + shuriken.height/2;
			}
			if((shurikenMaxX > invaderMinX && shurikenMinX < invaderMaxX) &&
			(invaderMaxY > shurikenMinY && invaderMinY < shurikenMaxY)) {
				invaders.arr.splice(j, 1);
				shurikens.arr.splice(k, 1);
				score.increase();
			}
		}
	}
}

