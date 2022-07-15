//Modules
/*const events = require("../../lib/events.js");
const mouse = require("../../lib/mouse.js");
const key = require("../../lib/key.js");
const utils = require("../../lib/utils.js");
const client = require("./client.js");*/

//Public variables
const __development__ = true;
//Code...


const canvas = document.getElementById("clip");
const ctx = canvas.getContext("2d");

canvas.style.position = "absolute";

canvas.width = innerWidth;
canvas.height = innerHeight;


function draw() {
	ctx.fillStyle = "#131b28";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 4, canvas.height);
	ctx.lineTo(0, canvas.height);
	ctx.fill();
	ctx.closePath();
}

draw();

function update() {

}

addEventListener("resize", event => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	draw();
});

console.log(ctx);