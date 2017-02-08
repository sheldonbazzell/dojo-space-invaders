var canvas = document.getElementById('myCanvas'),
	ctx    = canvas.getContext('2d');

function drawSquare(height) {
	var height = height;
	ctx.beginPath();
	ctx.rect(canvas.width/2 + 100, canvas.height/2 + 190, 40, height);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath()
}
drawSquare(40);

var ninjaWidth  = 29,
	ninjaHeight = 43,
	lives	    = 3,
	ninjaX      = canvas.width/2,
	ninjaY      = canvas.height - ninjaHeight/2 - 5;
function drawNinja(posX, posY) {
	ninja_image     = new Image();
	ninja_image.src = 'images/up1.png'
	ctx.drawImage(ninja_image, posX - ninjaWidth/2,
	posY - ninjaHeight/2, ninjaWidth, ninjaHeight);
}

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

var shurikens = [],
	monsters  = [];

addShuriken();
addMonster();
setInterval(function() {
	addShuriken();
	addMonster();
}, 500);
draw();

var shurikenWidth  = 18;
var shurikenHeight = 18;
var shurikenX      = canvas.width/2;
var shurikenY      = canvas.height - shurikenHeight/2;

function addShuriken() {
	shurikenY = ninjaY - ninjaHeight/2 - shurikenHeight/2;
	shurikens.push({x:ninjaX, y:shurikenY, dx: 0, dy:-2})
}

function drawMoveShurikens() {
	for(var i = 0; i < shurikens.length; i++) {
		s = shurikens[i];
		drawShuriken(s.x, s.y);
		s.y = s.y + s.dy;
		if(s.x < 0 || s.x > ctx.width || s.y < 0) {
			shurikens.splice(i, 1);
		}
	}
}

function addMonster() {
	monsterY = 0;
	monsterX = Math.floor(Math.random()*300)
	monsters.push({x:monsterX, y:monsterY, dx: 0, dy:2})
}

function drawMoveMonsters() {
	for(var j = 0; j < monsters.length; j++) {
		m = monsters[j];
		drawMonster(m.x, m.y);
		m.y = m.y + m.dy;
		if(m.x < 0 || m.x > canvas.width || m.y > canvas.height) {
			monsters.splice(j, 1);
			lives--;
		}	
	}
}

var explosionHeight = 20,
	explosionWidth  = 20,
	explosionX      = ninjaX,
	explosionY      = ninjaY;


function drawShuriken(posX, posY) {
	shuriken_image     = new Image();
	shuriken_image.src = 'images/ns1.png'
	ctx.drawImage(shuriken_image, posX - shurikenWidth/2,
	posY - shurikenHeight - 40, shurikenWidth, shurikenHeight);
}

var monsterWidth  = 44,
	monsterHeight = 33,
	monsterX      = canvas.width/2,
	monsterY      = 0;
function drawMonster(posX, posY) {
	monster_image     = new Image();
	monster_image.src = 'images/monster_transparent.png'
	ctx.drawImage(monster_image, posX - monsterWidth/2,
	posY, monsterWidth, monsterHeight);
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawMoveShurikens();
	drawMoveMonsters();
	drawLives();
	monsterNinjaCollision();
	monsterShurikenCollision();
	drawNinja(ninjaX, ninjaY);
	if(rightPressed && ninjaX < (canvas.width - ninjaWidth/2)) {
		ninjaX +=3
	} else if(leftPressed && ninjaX > 15) {
		ninjaX -=3
	}
	monsterY++;
	shurikenY--;
	if (lives == 0) {
		gameOver();
		drawExplosion();
	} else {
		requestAnimationFrame(draw);
	}
}
draw();

function drawExplosion(posX, posY) {
	explosion_image     = new Image();
	explosion_image.src = 'images/poof1.png';
	ctx.drawImage(explosion_image, posX,
	posY, explosionWidth, explosionHeight);
}

function gameOver() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawNinja(ninjaX, ninjaY);
	drawMoveShurikens();
	drawMoveMonsters();
	drawLives();
	ctx.fillStyle = "Black";
	ctx.font      = "16px Arial";
	ctx.fillText("GAME OVER", canvas.width/2-50, canvas.height/2-10)
	document.onkeypress = function(e) {
		if(e.keyCode == 32) {
			document.location.reload();
		}
	}

}

function monsterNinjaCollision() {

	for(var i = 0; i < monsters.length; i++) {
		monster = monsters[i];
		console.log(monster)
		monsterMinX = monster.x - monsterWidth/2;
		monsterMaxX = monster.x + monsterWidth/2;
		monsterMinY = monster.y - monsterHeight/2;
		monsterMaxY = monster.y + monsterHeight/2;

		ninjaMinX   = ninjaX    - ninjaWidth/2;
		ninjaMaxX   = ninjaX    + ninjaWidth/2;
		ninjaMinY   = ninjaY    - ninjaHeight/2;
		ninjaMaxY   = ninjaY    + ninjaHeight/2;

		if((ninjaMaxX > monsterMinX && ninjaMinX < monsterMaxX) &&
		(monsterMaxY > ninjaMinY && monsterMinY < ninjaMaxY)) {
			monsters.splice(i, 1);
			lives = lives - 1;
		}
	}
}

function monsterShurikenCollision() {

	for(var j = 0; j < monsters.length; j++) {
		for(var k = 0; k < shurikens.length; k++) {
			monster = monsters[j];
			if(monster){
				monsterMinX = monster.x - monsterWidth/2;
				monsterMaxX = monster.x + monsterWidth/2;
				monsterMinY = monster.y - monsterHeight/2;
				monsterMaxY = monster.y + monsterHeight/2;
			}
			shuriken = shurikens[k]
			shurikenMinX = shuriken.x - shurikenWidth/2;
			shurikenMaxX = shuriken.x + shurikenWidth/2;
			shurikenMinY = shuriken.y - shurikenHeight/2;
			shurikenMaxY = shuriken.y + shurikenHeight/2;

			if((shurikenMaxX > monsterMinX && shurikenMinX < monsterMaxX) &&
			(monsterMaxY > shurikenMinY && monsterMinY < shurikenMaxY)) {
				monsters.splice(j, 1);
				shurikens.splice(k, 1);
			}
		}
	}
}


