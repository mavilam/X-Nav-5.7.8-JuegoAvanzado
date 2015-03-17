// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

var keys = { 'left': 37 ,'right': 39 ,'down': 40 ,'up': 38 };

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// rock image
var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
	rockReady = true;
};
rockImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};

var rock = {
	rendered : false
}; 


var monsters = [];
var nmonsters = 0;

var rocks = [];
var nrocks = 0;

var princess = {};
var princessesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	if(princessesCaught > 3){
		for(i = 0; i<nrocks +1; i ++){
			rocks[i] = rock = {
							rendered : false
						};
				console.log(i);
		}
		nrocks ++;
	}

	if(princessesCaught > 6){
		for(i = 0; i<nmonsters +1; i ++){
			monsters[i] = monster = {
							speed : 2*princessesCaught
						};
		}
		
		console.log(i);
		if((princessesCaught % 3) == 0){
			nmonsters ++;
		}
		
	}
	
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 64 + (Math.random() * (canvas.width - 96));
	princess.y = 64 + (Math.random() * (canvas.height - 96));

	for(i = 0; i<nrocks; i++){
		console.log("asdf " + i);
		if(princessesCaught > 3 && rocks[i].rendered == false ){
			rocks[i].x = 32 + (Math.random() * (canvas.width - 64));
			rocks[i].y = 32 + (Math.random() * (canvas.height - 64));
			rocks[i].rendered = true;

		}
	}
	
	for(i = 0; i< nmonsters; i ++){
		console.log("asdffff " + i);
		if(princessesCaught > 7){
			if(i % 3 == 0){
				monsters[i].x = 0;
				monsters[i].y = 32 + (Math.random() * (canvas.height - 96));
			}else if(i % 2 == 0){
				monsters[i].x = 32 + (Math.random() * (canvas.width - 96));
				monsters[i].y = 0;
			}
			
		}
	}

	localStorage["Princesses"] = princessesCaught;
	console.log(JSON.stringify(localStorage["Rocks"]));
	localStorage["rocks"] = rocks;
	localStorage["nrocks"] = nrocks;
	console.log(JSON.stringify(localStorage["monsters"]));
	localStorage["monsters"] = monsters;
	localStorage["nmonsters"] = nmonsters;
	
};

var lastMove;
var cantMove;



// Update game objects
var update = function (modifier) {

	if (keys['up'] in keysDown && cantMove != keys['up']) { // Player holding up
		hero.y -= hero.speed * modifier;
		lastMove = keys['up'];
		cantMove = 0;
	}
	if (keys['down'] in keysDown && cantMove != keys['down']) { // Player holding down
		hero.y += hero.speed * modifier;
		lastMove = keys['down'];
		cantMove = 0;
	}
	if (keys['left'] in keysDown && cantMove != keys['left']) { // Player holding left
		hero.x -= hero.speed * modifier;
		lastMove = keys['left'];
		cantMove = 0;
	}
	if (keys['right'] in keysDown && cantMove != keys['right']) { // Player holding right
		hero.x += hero.speed * modifier;
		lastMove = keys['right'];
		cantMove = 0;
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		
		reset();
	}
	for(i = 0; i<nrocks; i++){
		if (hero.x <= (rocks[i].x + 16)
		&& rocks[i].x <= (hero.x + 16)
		&& hero.y <= (rocks[i].y + 16)
		&& rocks[i].y <= (hero.y + 32))
		{
			cantMove = lastMove;
		//ctx.fillText("YOU LOSE", 250, 240);
		}
	}
	
	for(i = 0; i<nmonsters; i++){
		if ((hero.x <= (monsters[i].x + 16)
		&& monsters[i].x <= (hero.x + 16)
		&& hero.y <= (monsters[i].y + 16)
		&& monsters[i].y <= (hero.y + 32)) 
		|| (princess.x <= (monsters[i].x + 16)
		&& monsters[i].x <= (princess.x + 16)
		&& princess.y <= (monsters[i].y + 16)
		&& monsters[i].y <= (princess.y + 32)))
		{
			princessesCaught = 0;
			nmonsters = 0;
			nrocks = 0;
			reset();
		}
	}

	if(hero.x > (canvas.width-32)){
		hero.x = canvas.width-32;
	}else if(hero.x < 1){
		hero.x = 1;
	}else if(hero.y > (canvas.height-32)){
		hero.y = canvas.height-32;
	}else if(hero.y < 1){
		hero.y = 1;
	}

	for(i = 0; i<nmonsters; i++){
		if (hero.x <= (monsters[i].x + 16)
		&& monsters[i].x <= (hero.x + 16)
		&& hero.y <= (monsters[i].y + 16)
		&& monsters[i].y <= (hero.y + 32))
		{
			princessesCaught = 0;
			nmonsters = 0;
			nrocks = 0;
			reset();
		}
	}

	for(i=0; i<nmonsters; i++){	
		x = monsters[i].x - princess.x;
		y = monsters[i].y - princess.y;
		if(x > 0){
			monsters[i].x -= monsters[i].speed * modifier; 
		}else if (x < 0){
			monsters[i].x += monsters[i].speed * modifier;
		}
		if(y > 0){
			monsters[i].y -= monsters[i].speed * modifier; 
		}else if (y < 0){
			monsters[i].y += monsters[i].speed * modifier;
		}
	}

};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (rockReady && princessesCaught > 3){
		for(i = 0; i < nrocks ; i++){
			ctx.drawImage(rockImage, rocks[i].x, rocks[i].y);
		}
		
	}

	if(monsterReady && princessesCaught > 7){
		for(i=0;i<nmonsters;i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {

	
	var now = Date.now();
	var delta = now - then;


	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
if(localStorage["Princesses"] != null && localStorage["nrocks"] != null && localStorage["nmonsters"] != null){
		princessesCaught = localStorage["Princesses"];
		nrocks = localStorage["nrocks"];
		console.log("piedras " + nrocks);
		nmonsters = localStorage["nmonsters"];
		console.log(nmonsters);
}
reset();

var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
