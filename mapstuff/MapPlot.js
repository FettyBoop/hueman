INTERVAL = 0;
BLOB_SIZE = 10;
BLOB_DRAW_INTERVAL = 50;
SCALEFACTOR = 1.0;
BACKGROUND_COLOR = "#444444";

/* 
 * Libraries used
 * jQuery: http://jquery.com/
 * Tabletop: https://github.com/jsoma/tabletop
 */

 var map = new Image();
 map.src = "./img/map.png";
 var blobs = [];

/*
 * Fit the canvas properly inside the window
 * 1000 * 550 are the "baseline" dimensions
 * */
function doResize()
{
	var canvas = document.getElementById("canvas");
	if (window.innerWidth * 0.55 > window.innerHeight)
	{ // height will be the limiting factor
		canvas.height = window.innerHeight * 0.95;
		canvas.width = canvas.height / 0.55;
	}
	else
	{
		canvas.width = window.innerWidth * 0.95;
		canvas.height = canvas.width * 0.55;
	}
	SCALEFACTOR = canvas.width / 1000;
}

function main()
{
	// Set the background color
	document.body.style.backgroundColor = BACKGROUND_COLOR;

	// Get rid of annoying text select
	canvas.addEventListener("selectstart", function(e)
	{
		e.preventDefault();
		return false;
	}, false);

	var resizeTimer;
	$(window).resize(function()
	{
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function()
		{
			doResize();
			var ctx = drawCanvas();
			drawBlobs(ctx);
		});
	});
	
	/*	// Clicks
	canvas.addEventListener("click", function(e)
	{
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		data += x + "," + y + ",\"" + colors[Math.floor(Math.random() * 8)] + "\"\n";
		// console.log(data);
	});*/

	doResize();
	getData();
	var ctx = drawCanvas();

	// This gives enough time for the data to return
	setTimeout(function(){
		drawBlobsInterval(ctx, 0);
	}, 2000);
}

/*
 * Get the existing data from wherever
 * */
function getData()
{
	var ctx = drawCanvas();

	Tabletop.init( { key: "https://docs.google.com/spreadsheets/d/1VgwHL0V7Or7WMGFLtbn5BtuMk98W6bxiAUbiA8WsVJI/pubhtml?gid=0&single=true",
		callback: showInfo,
		simpleSheet: true } )

	function showInfo(data, tabletop) {
		for (var i in data)
		{
			var point = data[i];
			blobs.push(new Blob(point.x, point.y, "rgba(" + point.color + ",0.65)"));
		}
	}
}

/*
 * Draws the map onto the canvas
 * */
function drawCanvas()
{
	var canvas = document.getElementById("canvas");
	// console.log("drawCanvas called. width: " + canvas.width + " height: " + canvas.height);

	var ctx = canvas.getContext("2d");
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// ctx.strokeStyle = "rgb(0,0,0)";
	// ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(map, 0, 0, canvas.width, canvas.height);

	return ctx;
}

function drawBlobs(ctx)
{
	for (var i in blobs)
	{
		blobs[i].draw(ctx);
	}
}

function drawBlobsInterval(ctx, i)
{
	setTimeout(function(){
		blobs[i].draw(ctx);
		i++;
		if (i < blobs.length)
			drawBlobsInterval(ctx, i);
	}, BLOB_DRAW_INTERVAL);
}

//// BLOB ////

function Blob(x, y, color)
{
	// console.log("created new blob");
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.color = color;
}

Blob.prototype.draw = function(ctx)
{
	// console.log("draw a blob: " + this.color);

/*	// BLACK BORDER
	var path = new Path2D();
	path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, BLOB_SIZE * SCALEFACTOR, 0, 360);
	ctx.fillStyle = "#222222";
	ctx.fill(path);

	var path = new Path2D();
	path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, (BLOB_SIZE - 1) * SCALEFACTOR, 0, 360);
	ctx.fillStyle = this.color;
	ctx.fill(path);*/

/*  // HOUSE
	var path = new Path2D();
	path.moveTo(this.x * SCALEFACTOR, (this.y - BLOB_SIZE) * SCALEFACTOR);
	path.lineTo((this.x + BLOB_SIZE) * SCALEFACTOR, (this.y - BLOB_SIZE/2) * SCALEFACTOR);
	path.lineTo((this.x - BLOB_SIZE) * SCALEFACTOR, (this.y - BLOB_SIZE/2) * SCALEFACTOR);
	ctx.fillStyle = this.color;
	ctx.fill(path);
	var path = new Path2D();
	ctx.fillRect((this.x - BLOB_SIZE * 0.8) * SCALEFACTOR, (this.y - BLOB_SIZE/2) * SCALEFACTOR,
		BLOB_SIZE * 1.6 * SCALEFACTOR, BLOB_SIZE * SCALEFACTOR);
*/

/*	// FADED
	for (var i = BLOB_SIZE; i > 0; i--)
	{
		console.log(this.color);
		var path = new Path2D();
		path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, i * SCALEFACTOR, 0, 360);
		ctx.fillStyle = this.color;
		ctx.fill(path);
	}
	*/

	ctx.fillStyle = this.color;
	ctx.strokeStyle = "#222222";

	var path = new Path2D();
	path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, (BLOB_SIZE - 4) * SCALEFACTOR, 
		0, Math.PI * 2);
	ctx.fill(path);
	// ctx.stroke(path);

	var path = new Path2D();
	path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, (BLOB_SIZE - 1) * SCALEFACTOR,
		0.3 * Math.PI, 0.7 * Math.PI);
	path.lineTo((this.x - BLOB_SIZE - 1) * SCALEFACTOR, (this.y + BLOB_SIZE + 3) * SCALEFACTOR);
	path.lineTo((this.x + BLOB_SIZE + 1) * SCALEFACTOR, (this.y + BLOB_SIZE + 3) * SCALEFACTOR);
	ctx.fill(path);
	// ctx.stroke(path);
}