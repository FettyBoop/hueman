var colors = new Array(
  [234,153,153], //angry
  [249,203,156],//afraid
  [234,153,153],//angry
  [249,203,156],//afraid
  [255,229,153], //happy
  [204,204,204],//impassive
  [255,229,153],//happy
  [204,204,204],//impassive
  [182,215,168],//disgusted
  [180,167,214],//confident
  [182,215,168],//disgusted
  [180,167,214],//confident
  [130,181,193],//Troubled
  [164,194,244],//sad
  [130,181,193],//Troubled
  [164,194,244],//sad
  [234,153,153], //angry
  [249,203,156]//afraid
);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient()
{
  
  if ( $===undefined ) return;
  
var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];

var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgb("+r1+","+g1+","+b1+")";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('#gradient').css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
  
  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    
    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    
  }
}

setInterval(updateGradient,10);



var happy = ["Content", "Satisfied", "Pleased", "Thankful", "Glad", "Joyful", "Excited", "Ecstatic"];
var happyColors = ["#FFDE05", "#FFFFB0", "#FFFFB0", "#FFFF73", "#F4ED5F", "#F3C13A", "#F8EE28", "#FFFF05"]
var sad = ["Dissatisfied", "Lonely", "Disappointed", "Ashamed", "Despondent", "Rejected", "Depressed", "Inconsolable"];
var sadColors = ["#022DFD", "#8FC2F0", "#4B64D8", "#A6BCF8", "#78CDF2", "#5098F6", "#D0E6F9", "#5D84F4"];
var angry = ["Impatient", "Irritated/Annoyed", "Frustrated", "Upset", "Exasperated","Hostile","Wrathful", "Enraged"];
var angryColors = ["#F07070","#FF0551", "#EE4D63", "#F82364", "#FF1111", "#E01B1B", "#FD1A37", "#DC0707"];
var afraid = ["Surprised","Nervous","Apprehensive","Startled", "Anxious","Scared","Dreadful", "Terrified"];
var afraidColors = ["#F8C757","#FF9669", "#F8B164", "#F08947", "#F4AE0F", "#F26E35", "#F2520B", "#E54C09"];
var disgusted = ["Distasteful", "Bitter", "Jealous", "Spiteful", "Scornful", "Disdainful", "Loathsome", "Hateful"];
var disgustedColors = ["#00521A","#006620", "#007A27", "#008F2D", "#00A334", "#00B83A", "#00CC41", "#00E047"];
var troubled = ["Hesitant","Restrained", "Confused", "Distraught",  "Overwhelmed", "Powerless", "Vulnerable"];
var troubledColors = ["#14203E","#18284E", "#1D2F5D", "#22376D", "#273F7C", "#2C478C", "#304D96", "#304D96"];
var confident = ["Hopeful", "Positive", "Courageous", "Proud", "Arrogant", "Bold", "Fearless", "Powerful"];
var confidentColors = ["#30194D","#391E5C", "#43236C", "#4C287B", "#562D8B", "#5B3094", "#6937A9", "#723CB9"];
var impassive = ["Calm", "Indifferent", "Sleepy", "Apathetic", "Unethusiastic", "Detached", "Distant", "Content"];
var impassiveColors = ["#323234","#323234", "#3D3D3E", "#49494A", "#515152", "#5B5B5D", "#656567", "#6F6F71"];
var secondary;  // set when a main emotion is selected
// these are used to save the old location of the selected main emotion box
var secondaryColors;
var selectedTop = "auto";
var selectedBottom = "auto"; 
var selectedLeft = "auto";
var selectedRight = "auto"; 

$(document).ready(function(){
  $(".in").mouseover(function(event){
    // TODO: when you hover over a box, it should stop moving
  });
  
  

  // when a primary emotion is clicked...
  $(".in.primary").click(function(event){
    // stop the animation
    $(".in.primary").css("animation-name","none");
    // make all the other boxes fade out
    $(this).removeClass("primary");
    $(this).addClass("primary-selected");
    $(".primary").fadeOut();
    // put the selected box on top
    $(this).css("z-index", "2");
    
    // set the secondary emotions array
    if ($(this).attr("id") == "happy") {
      secondary = happy;
      secondaryColors = happyColors;
    }
    else if ($(this).attr("id") == "sad") {
      secondary = sad;
      secondaryColors = sadColors;
    }
    else if ($(this).attr("id") == "angry") {
      secondary = angry;
      secondaryColors = angryColors;
    }
    else if ($(this).attr("id") == "afraid") {
      secondary = afraid;
      secondaryColors = afraidColors;
    }
    else if ($(this).attr("id") == "disgusted") {
      secondary = disgusted;
      secondaryColors = disgustedColors;
    }
    else if ($(this).attr("id") == "troubled") {
      secondary = troubled;
      secondaryColors = troubledColors;
    }
    else if ($(this).attr("id") == "confident") {
      secondary = confident;
      secondaryColors = confidentColors;
    }
    else if ($(this).attr("id") == "impassive") {
      secondary = impassive;
      secondaryColors = impassiveColors;
    }
    
    // when the box finished transitioning to the center, go to the function movedToCenter()
    // Code for Safari 3.1 to 6.0
    document.getElementsByClassName("primary-selected")[0].addEventListener("webkitTransitionEnd", movedToCenter);
    // Standard syntax
    document.getElementsByClassName("primary-selected")[0].addEventListener("transitionend", movedToCenter);
    
    
    $(this).css("transition");
    /* elements in row 1 should transition downward, 
    elements in row 3 should transition upward */
    if ($(this).parent().parent().hasClass("row-1")) {
      selectedBottom = $(this).css("bottom");
      $(this).css("bottom", "-160px");
    }
    else if (($(this).parent().parent().hasClass("row-3"))) {
      selectedTop = $(this).css("top");
      $(this).css("top", "-160px");
    }
    /* elements in col 1 should transition right, 
    elements in col 3 should transition left */       
    if ( $(this).parent().hasClass("col-1")) {
      selectedRight = $(this).css("right");
      $(this).css("right", "-160px");
    }
    else if ($(this).parent().hasClass("col-3")) {
      selectedLeft = $(this).css("left");
      $(this).css("left", "-160px");
    }
    
  });
  /*
  $(".back-button").click(function(event){
    $(".secondary").fadeOut();
    $(".primary-selected").css("top", selectedTop);
    $(".primary-selected").css("bottom", selectedBottom);
    $(".primary-selected").css("left", selectedLeft);
    $(".primary-selected").css("right", selectedRight);
    console.log($(".primary-selected").css("top") + " " + $(".primary-selected").css("bottom") + " " + $(".primary-selected").css("top") + " " + $(".primary-selected").css("top"));
    $(".primary-selected").addClass("primary");
    $(".primary-selected").removeClass("primary-selected");
    restartMainAnimation();
    $(".back-button").fadeOut();
    $(".secondary").css("display","none");
    selectedTop = "auto";
    selectedBottom = "auto"; 
    selectedLeft = "auto";
    selectedRight = "auto";
  });
  */
});

function movedToCenter () {
  // set the text for the secondary emotions
  $("#secondary-1").text(secondary[0]);
  $("#secondary-2").text(secondary[1]);
  $("#secondary-3").text(secondary[2]);
  $("#secondary-4").text(secondary[3]);
  $("#secondary-5").text(secondary[4]);
  $("#secondary-6").text(secondary[5]);
  $("#secondary-7").text(secondary[6]);
  $("#secondary-8").text(secondary[7]);
  // set the color for the secondary emotions
  $("#secondary-1").css("background", secondaryColors[0] );
  $("#secondary-2").css("background", secondaryColors[1] );
  $("#secondary-3").css("background", secondaryColors[2] );
  $("#secondary-4").css("background", secondaryColors[3] );
  $("#secondary-5").css("background", secondaryColors[4] );
  $("#secondary-6").css("background", secondaryColors[5] );
  $("#secondary-7").css("background", secondaryColors[6] );
  $("#secondary-8").css("background", secondaryColors[7] );
  // fade in the secondary emotions boxes
  $(".secondary").fadeIn();
  $(".back-button").fadeIn();
}

function restartMainAnimation() {
  $("#angry").css("animation-name","cell1");
  $("#afraid").css("animation-name","cell2");
  $("#happy").css("animation-name","cell3");
  $("#impassive").css("animation-name","cell4");
  $("#disgusted").css("animation-name","cell6");
  $("#confident").css("animation-name","cell7");
  $("#troubled").css("animation-name","cell8");
  $("#sad").css("animation-name","cell9");
  $(".primary").fadeIn();
}