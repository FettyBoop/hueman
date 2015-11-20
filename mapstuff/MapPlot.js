INTERVAL = 0;
BLOB_SIZE = 10;
BLOB_DRAW_INTERVAL = 50;

/* 
 * Libraries used
 * jQuery: http://jquery.com/
 * Tabletop: https://github.com/jsoma/tabletop
 */

var map = new Image();
map.src = "./img/map.png";
var blobs = [];
var data = "";

var colors = ["234,153,153", "249,203,156", "234,153,153", "249,203,156", "234,153,153", "249,203,156", "234,153,153", "249,203,156"];

// TODO: on window resizing etc

function main()
{
	// Get rid of annoying text select
	canvas.addEventListener("selectstart", function(e)
	{
		e.preventDefault();
		return false;
	}, false);
	
	// Clicks
	canvas.addEventListener("click", function(e)
	{
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		data += x + "," + y + ",\"" + colors[Math.floor(Math.random() * 8)] + "\"\n";
		console.log(data);
	});
	

	
	update();
	//setInterval(update, INTERVAL);
}

function update()
{
	var ctx = drawCanvas();

	Tabletop.init( { key: "https://docs.google.com/spreadsheets/d/1VgwHL0V7Or7WMGFLtbn5BtuMk98W6bxiAUbiA8WsVJI/pubhtml?gid=0&single=true",
		callback: showInfo,
		simpleSheet: true } )

	function showInfo(data, tabletop) {
		for (var i in data)
		{
			var point = data[i];
			blobs.push(new Blob(point.x, point.y, "rgba(" + point.color + ",0.8)"));
		}
	}

/*
	$.ajax("https://docs.google.com/spreadsheets/d/1VgwHL0V7Or7WMGFLtbn5BtuMk98W6bxiAUbiA8WsVJI/pub?gid=0&single=true&output=csv").done(function(result)
	{
		var plot = result.split("\n");
		for (var i in plot)
		{
			var point = plot[i];
			var x = point.split(",")[0];
			var y = point.split(",")[1];
			var color = point.match("\".*\"")[0];
			blobs.push(new Blob(x, y, "rgba(" + color.substring(1, color.length - 2) + ",0.8)"));
		}

	});
*/

setTimeout(function(){
	drawBlobs(ctx, 0);
}, 2000);
}

function drawCanvas()
{
	console.log("drawCanvas called");
	var canvas = document.getElementById("canvas");

	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "rgb(0,0,0)";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(map, 0, 0, canvas.width, canvas.height);

	return ctx;
}

function drawBlobs(ctx, i)
{
	setTimeout(function(){
		blobs[i].draw(ctx);
		i++;
		if (i < blobs.length)
			drawBlobs(ctx, i);
	}, BLOB_DRAW_INTERVAL);
}

//// BLOB ////

function Blob(x, y, color)
{
	console.log("created new blob");
	this.x = x;
	this.y = y;
	this.color = color;
}

Blob.prototype.draw = function(ctx)
{
	// stuff
	console.log("draw a blob: " + this.color);
	var path = new Path2D();
	path.arc(this.x, this.y, BLOB_SIZE, 0, 360);
	ctx.fillStyle = this.color;
	ctx.fill(path);
}