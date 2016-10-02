

var actionDirections = document.getElementById('currrentAction');
var confirmationButton = document.getElementById('confirmationButton');
var denyButton = document.getElementById('denyButton');
var questPage = document.getElementsByClassName('quest-page')[0];


var socket = io();

function addParticipantsMessage (data) {
  var message = '';
  if (data.numUsers === 1) {
    message += "there's 1 participant";
  } else {
    message += "there are " + data.numUsers + " participants";
  }
  log(message);
}

function closeModal(){
  questPage.style.display = 'none';
  window.removeListener('click', closeModal);

}


  // Sets the client's username
function setUsername (event) {

  if(event.keyCode === 13){
    if(userNameInput.value !== ''){
      socket.emit('login', userNameInput.value);
    }

  }

}
function startWar(){

  socket.emit('start war', {
    attack: attackCountry,

  })
}


  // Sends a chat message
function sendMessage () {

    // tell server to execute 'new message' and send along one parameter
    console.log("banana");
    var message = "banana";
    socket.emit('new message', message);

}

  // Log a message


  // Keyboard events
  var userNameInput = document.getElementsByClassName('usernameInput')[0];

  var userNameListener = userNameInput.addEventListener('keyup', setUsername);




  // Click events

  // Focus input when clicking anywhere on login page


  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    var connected = true;
    // Display the welcome message
    var loginPage = document.getElementsByClassName("initial-page")[0];
    loginPage.style.display = "none";
    questPage.style.display = "block";
    window.addEventListener('click', closeModal);
    console.log(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    console.log(data);

  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  var messageButton = document.getElementById('sendMessage');
  messageButton.addEventListener('click', sendMessage);
