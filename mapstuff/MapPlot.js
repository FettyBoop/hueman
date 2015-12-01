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
var currblobs = [];
var clicked = false;
var keysquares = [];

/* Fit the canvas properly inside the window
1000 * 550 are the "baseline" dimensions */
function doResize()
{
	var canvas = document.getElementById("canvas");
	if (window.innerWidth * 0.55 > window.innerHeight)
	{ // height will be the limiting factor
		canvas.height = window.innerHeight * 0.9;
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

	// Initialize the clickable boxes in the key
	keysquares.push(new KeySquare(815, 365, "Angry"));
	keysquares.push(new KeySquare(865, 365, "Afraid"));
	keysquares.push(new KeySquare(915, 365, "Happy"));
	keysquares.push(new KeySquare(815, 415, "Impassive"));
	keysquares.push(new KeySquare(865, 415, "ALL"));
	keysquares.push(new KeySquare(915, 415, "Disgusted"));
	keysquares.push(new KeySquare(815, 465, "Confident"));
	keysquares.push(new KeySquare(865, 465, "Troubled"));
	keysquares.push(new KeySquare(915, 465, "Sad"));



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
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		x = x / canvas.width * 1000;
		y = y / canvas.height * 550;


		// Only let them click once for choosing location
		if (clicked) // Otherwise do the key
		{
			var found;
			for (var i in keysquares)
			{
				if (keysquares[i].contains(x, y))
				{
					found = keysquares[i];
					break;
				}
			}
			if (found == null)
				return;

			applyFilter(found.name);
			var ctx = drawCanvas();
			drawBlobs(ctx);
			return;
		}
		else
		{
			clicked = true;
			
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
			
			document.getElementById("toptext").innerHTML = "Please wait."

			getData(".*");
			var ctx = drawCanvas();

			// This gives enough time for the data to return
			setTimeout(function(){
				document.getElementById("toptext").innerHTML = "Please wait.."
				setTimeout(function(){
					document.getElementById("toptext").innerHTML = "Please wait..."
					setTimeout(function(){
						drawBlobsInterval(ctx, 0);
						document.getElementById("toptext").innerHTML = "This is how people around you feel!"
					}, 1000);
				}, 1000);
			}, 1000);

		}
		// console.log(data);
	});
	///// LISTENERS /////

	doResize();
	var ctx = drawCanvas();

	// for (var i in keysquares)
		// keysquares[i].draw(ctx);
}

function applyFilter(name)
{
	var filter = getColorRegex(name);
	console.log("Filtering for: " + filter);
	currblobs = [];
	for (var i in blobs)
	{
		if (blobs[i].name == null || blobs[i].name.match(filter))
			currblobs.push(blobs[i]);
	}
}

/* Get the existing data from wherever */
function getData()
{
	blobs = [];
	/* PARSE */
	Parse.initialize("mEmM0UeRE8GX5hYcuI3Z8Yao4bT4Z7wTWyjOImvt", "G5gLmYiSdDo9YNHF56Rrom15e7VJyGYmUYlcu7f9");
	var MapPoint = Parse.Object.extend("MapPoint");
	var query = new Parse.Query(MapPoint);
	query.each(function(object){
		blobs.push(new Blob(object.get("x"), object.get("y"), object.get("color"), object.get("name")));
  	});
  	currblobs = blobs;
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
	for (var i in currblobs)
	{
		currblobs[i].draw(ctx);
	}
}

/* Draws the blobs one by one */
function drawBlobsInterval(ctx, i)
{
	setTimeout(function(){
		currblobs[i].draw(ctx);
		i++;
		if (i < currblobs.length)
			drawBlobsInterval(ctx, i);
	}, BLOB_DRAW_INTERVAL);
}

//// BLOB ////

function Blob(x, y, color, name)
{
	// console.log("created new blob");
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.color = color;
	this.name = name;
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


//// KEYSQUARE ////

function KeySquare(x, y, name)
{
	this.x = x;
	this.y = y;
	this.name = name;
}

// For making sure bounding box is right
KeySquare.prototype.draw = function(ctx)
{
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(this.x * SCALEFACTOR, this.y * SCALEFACTOR, 46 * SCALEFACTOR, 46 * SCALEFACTOR);
}

// Bounding box
KeySquare.prototype.contains = function(x, y)
{
	if (this.x > x || (this.x + 46) < x
		|| this.y > y || (this.y + 46) < y)
		return false;
	return true;
}

// Emotion name to color mappings
function getColorRegex(name)
{
	switch(name)
	{
		case "Angry": return "Angry|Impatient|Annoyed|Frustrated|Upset|Exasperated|Hostile|Wrathful|Enraged";
		case "Happy": return "Happy|Content|Satisfied|Pleased|Thankful|Glad|Joyful|Excited|Ecstatic";
		case "Sad": return "Sad|Dissatisfied|Lonely|Disappointed|Ashamed|Despondent|Rejected|Depressed|Inconsolable";
		case "Afraid": return "Afraid|Surprised|Nervous|Uneasy|Startled|Anxious|Scared|Dreadful|Terrified";
		case "Disgusted": return "Disgusted|Distasteful|Bitter|Jealous|Spiteful|Scornful|Disdainful|Loathsome|Hateful";
		case "Troubled": return "Troubled|Hesitant|Vulnerable|Restrained|Confused|Guilty|Distraught|Disturbed|Powerless";
		case "Confident": return "Confident|Hopeful|Positive|Courageous|Proud|Arrogant|Bold|Fearless|Powerful";
		case "Impassive": return "Impassive|Calm|Indifferent|Sleepy|Apathetic|Unmoved|Detached|Distant|Cold";
		case "ALL": return ".*";
	}
}