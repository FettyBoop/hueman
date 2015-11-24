INTERVAL = 0;
BLOB_SIZE = 10;
BLOB_DRAW_INTERVAL = 50;
SCALEFACTOR = 1.0;
BACKGROUND_COLOR = "#1D1D1D";

/* Libraries used
jQuery: http://jquery.com/ */
var map = new Image();
map.src = "./img/map.png";
var blobs = [];
var clicked = false;

/* Fit the canvas properly inside the window
1000 * 550 are the "baseline" dimensions */
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

	///// LISTENERS /////
	// Get rid of annoying text select
	canvas.addEventListener("selectstart", function(e)
	{
		e.preventDefault();
		return false;
	}, false);

	// Responsive to resizing
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
	
	Parse.initialize("mEmM0UeRE8GX5hYcuI3Z8Yao4bT4Z7wTWyjOImvt", "G5gLmYiSdDo9YNHF56Rrom15e7VJyGYmUYlcu7f9");
	var MapPoint = Parse.Object.extend("MapPoint");

	// Click to choose a location
	canvas.addEventListener("click", function(e)
	{
		// Only let them click once
		if (clicked)
			return;
		clicked = true;
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;

		
		var query = new Parse.Query(MapPoint);
		// Sorts the results in descending order by the Created Date field
		query = query.addDescending("createdAt");

		query.first().then(function(object){
			object.set("x", x);
			object.set("y", y);
			console.log(object.get("x") + " " + object.get("y") + " " + object.get("color"));
			
			object.save(null, {
			  success: function(object) {
			    // Execute any logic that should take place after the object is saved.	    
			  },
			  error: function(object, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			    alert("error occurred while saving");
			  }
			});
			
		});
		

		getData();
		var ctx = drawCanvas();

		// This gives enough time for the data to return
		setTimeout(function(){
			drawBlobsInterval(ctx, 0);
		}, 1000);

		// console.log(data);
	});
	///// LISTENERS /////

	doResize();
	drawCanvas();
}

/* Get the existing data from wherever */
function getData()
{
	/* PARSE */
	Parse.initialize("mEmM0UeRE8GX5hYcuI3Z8Yao4bT4Z7wTWyjOImvt", "G5gLmYiSdDo9YNHF56Rrom15e7VJyGYmUYlcu7f9");
	var MapPoint = Parse.Object.extend("MapPoint");
	var query = new Parse.Query(MapPoint);
	query.each(function(object){
  		// console.log(object.get("x") + " " + object.get("y") + " " + object.get("color"));
  		blobs.push(new Blob(object.get("x"), object.get("y"), object.get("color")));
  	});
}

/* Draws the map onto the canvas */
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

/* Draws the blobs immediately, no delay */
function drawBlobs(ctx)
{
	for (var i in blobs)
	{
		blobs[i].draw(ctx);
	}
}

/* Draws the blobs one by one */
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

/* Not really a blob anymore but I'm still calling it a blob. */
Blob.prototype.draw = function(ctx)
{
	// console.log("draw a blob: " + this.color);
	ctx.fillStyle = this.color;
	ctx.strokeStyle = "#FFFFFF";

	var path = new Path2D();
	path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, (BLOB_SIZE - 4) * SCALEFACTOR, 
		0, Math.PI * 2);
	ctx.fill(path);
	ctx.stroke(path);

	var path = new Path2D();
	path.arc(this.x * SCALEFACTOR, this.y * SCALEFACTOR, (BLOB_SIZE - 1) * SCALEFACTOR,
		0.3 * Math.PI, 0.7 * Math.PI);
	path.lineTo((this.x - BLOB_SIZE - 1) * SCALEFACTOR, (this.y + BLOB_SIZE + 3) * SCALEFACTOR);
	path.lineTo((this.x + BLOB_SIZE + 1) * SCALEFACTOR, (this.y + BLOB_SIZE + 3) * SCALEFACTOR);
	path.closePath();
	ctx.fill(path);
	ctx.stroke(path);
}