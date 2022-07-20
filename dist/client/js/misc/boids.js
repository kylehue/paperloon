const events = require("../../../lib/events.js");
const mouse = require("../../../lib/mouse.js");
const key = require("../../../lib/key.js");
const utils = require("../../../lib/utils.js");
const Quadtree = require("@timohausmann/quadtree-js");

const canvas = document.getElementById("clip");
const ctx = canvas.getContext("2d");

const fishColors = [
	"#232b37",
	"#1e2530",
	"#29323f"
];

canvas.style.position = "absolute";

canvas.width = innerWidth;
canvas.height = innerHeight;

var fps = 30,
	frameCount = 0,
	fpsInterval = 1000 / fps,
	then = performance.now(),
	now,
	startTime = then,
	elapsed;

var bg = document.createElement("img");
bg.src = "../../assets/images/bg-04.jpg";

var pool,
	fishes = [],
	maxFishCount = utils.map(canvas.width, 0, 1440, 60, 200),
	limitX,
	limitY,
	minSpeed = 1.5,
	maxSpeed = 2.5,
	clampingSize = 5;

var tension = utils.map(canvas.width, 0, 1440, 15, 30);
var divisionPoints = [];

function init() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	limitX = canvas.width;
	limitY = canvas.height;

	pool = new Quadtree({
		x: 0,
		y: 0,
		width: canvas.width,
		height: canvas.height
	});

	divisionPoints = [];

	let maxSides = 9;
	for (var i = 0; i < maxSides; i++) {
		let angle = Math.PI * (i - 1) / (maxSides - 2) / 2;
		divisionPoints.push({
			x: Math.cos(angle) * 400,
			y: Math.sin(angle - i * 0.02) * (limitY - i * 10),
			angle: angle
		});
	}

	pool.clear();
}

init();

addEventListener("resize", event => {
	init();
});

class Fish {
	constructor() {
		this.id = utils.uid();
		this.size = utils.random(3, 7);
		this.color = utils.random(fishColors);
		this.opacity = 0;

		this.position = {
			x: utils.random(0, limitX),
			y: utils.random(0, limitY)
		}

		this.visionRadius = this.size * 4;

		this.velocity = utils.random(minSpeed, maxSpeed);
		this.direction = utils.random(-0.01, 0.01);

		this.angle = utils.random(-Math.PI, Math.PI);
	}

	render() {
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(-this.size, -this.size / 2);
		ctx.lineTo(this.size, 0);
		ctx.lineTo(-this.size, this.size / 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	update() {
		// Fade in
		if (this.opacity < 1) {
			this.opacity += 0.02;
		}

		//Move
		this.angle += this.direction;
		this.position.x += Math.cos(this.angle) * this.velocity;
		this.position.y += Math.sin(this.angle) * this.velocity;

		//Look for neighbors
		var neighbors = pool.retrieve({
			x: this.position.x - this.size,
			y: this.position.y - this.size,
			width: this.size * 2,
			height: this.size * 2
		});

		for (var neighbor of neighbors) {
			if (neighbor.self instanceof Fish) {
				if (neighbor.self.id != this.id) {
					var fish = neighbor.self;
					var distance = utils.dist(this.position.x, this.position.y, fish.position.x, fish.position.y);

					// Join near flocks
					if (distance < this.visionRadius + fish.visionRadius) {
						let reactionSpeed = 0.4 / distance;
						this.angle = utils.lerp(this.angle, fish.angle, reactionSpeed);
						fish.angle = utils.lerp(fish.angle, this.angle, reactionSpeed);
						this.velocity = utils.lerp(this.velocity, fish.velocity, reactionSpeed);
						fish.velocity = utils.lerp(fish.velocity, this.velocity, reactionSpeed);
					}

					// Avoid collision
					if (distance < this.size) {
						//Change angle
						var angle = Math.atan2(fish.position.y - this.position.y, fish.position.x - this.position.x);
						this.angle = utils.lerp(this.angle, -angle, 0.07 / distance)
						fish.angle = utils.lerp(fish.angle, angle, 0.07 / distance);
					}
				}
			}
		}

		this.addToPool();
		this.clamp();
	}

	respawn() {
		for (var i = 0; i < fishes.length; i++) {
			let fish = fishes[i];
			if (fish.id == this.id) {
				fishes.splice(i, 1);
				break;
			}
		}

		fishes.push(new Fish());
	}

	clamp() {
		let offset = -this.size * clampingSize;
		let mTop = this.position.y < offset;
		let mBottom = this.position.y > limitY - offset;
		let mLeft = this.position.x < offset;
		let mRight = this.position.x > limitX - offset;


		if (mTop || mBottom || mLeft || mRight) {
			this.respawn();
		}
	}

	addToPool() {
		pool.insert({
			x: this.position.x - this.size,
			y: this.position.y - this.size,
			width: this.size * 2,
			height: this.size * 2,
			self: this
		});
	}
}

for (var i = 0; i < maxFishCount; i++) {
	var fish = new Fish();
	fishes.push(fish);
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
	if (arguments.length === 2) {
		x = y = 0;
		w = ctx.canvas.width;
		h = ctx.canvas.height;
	}

	offsetX = typeof offsetX === "number" ? offsetX : 0.5;
	offsetY = typeof offsetY === "number" ? offsetY : 0.5;

	if (offsetX < 0) offsetX = 0;
	if (offsetY < 0) offsetY = 0;
	if (offsetX > 1) offsetX = 1;
	if (offsetY > 1) offsetY = 1;

	var iw = img.width,
		ih = img.height,
		r = Math.min(w / iw, h / ih),
		nw = iw * r, // new prop. width
		nh = ih * r, // new prop. height
		cx, cy, cw, ch, ar = 1;

	if (nw < w) ar = w / nw;
	if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
	nw *= ar;
	nh *= ar;

	cw = iw / (nw / w);
	ch = ih / (nh / h);

	cx = (iw - cw) * offsetX;
	cy = (ih - ch) * offsetY;

	if (cx < 0) cx = 0;
	if (cy < 0) cy = 0;
	if (cw > iw) cw = iw;
	if (ch > ih) ch = ih;

	ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

let curvePoints = utils.getCurvePoints(divisionPoints, 0.5);

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	ctx.fillStyle = "#232b37";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	utils.drawLines(ctx, curvePoints);
	//utils.drawCurve(ctx, divisionPoints, 0.5);
	ctx.closePath();
	ctx.fill();

	//Clip
	ctx.clip();

	// Overlay
	ctx.save();
	ctx.globalAlpha = 0.3;
	drawImageProp(ctx, bg, 0, 0, canvas.width, canvas.height);
	ctx.restore();

	// Objects
	for (var i = 0; i < fishes.length; i++) {
		fishes[i].render();
	}
	ctx.restore();
}

function update() {
	for (var i = 0; i < fishes.length; i++) {
		fishes[i].update();
	}

	curvePoints = utils.getCurvePoints(divisionPoints, 0.5);

	for (var i = 0; i < divisionPoints.length; i++) {
		let point = divisionPoints[i];

		let index = Math.abs(divisionPoints.length - i) * 2;
		let speed = 0.5;

		point.x += Math.cos(point.angle) * Math.sin((index + frameCount * speed) / 1.2) * (3) * speed;;
		point.y += Math.sin(point.angle) * Math.cos((index + frameCount * speed) / 1.2) * (3) * speed;;
	}

	if (frameCount % 3 == 0) {
		//console.log(frameCount);
	}

	pool.clear();
}

function animate() {
	requestAnimationFrame(animate);
	update();

	now = performance.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {
		draw();
		frameCount++;
		then = now - (elapsed % fpsInterval);
	}

}

animate();

console.log(ctx);