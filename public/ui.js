// javascript controls of view

var instructionsDiv = document.getElementById('instructions-div');
var yesButton = document.getElementById('yes-button');
var noButton = document.getElementById('no-button');
var inputArea = document.getElementById('data-input');


var updateInstructionsDiv = function(string){
  instructionsDiv.innerHTML = string;
}; 
