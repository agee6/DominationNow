var Board = require('./Board.js');
var HumanPlayer = require('./HumanPlayer.js');
var ComputerPlayer = require('./ComputerPlayer.js');

function Game(){
  this.board = new Board();
  this.players = [];
  this.currentWars=[];
  this.currentPlayer = 0;
  this.gameOver = false;
  this.numPlayers = 0;
  this.year = 0;
  this.playersNames = [];
}

Game.prototype.startGame = function(){
  // this.getPlayers();
  this.setBoard();
};

Game.prototype.getPlayers = function(){

  // Add code here that will connect to players using the pluggins. Need to figure this out this week, asap.
  var computerNames = ['Nicolas Cage', 'Anita Job', 'Darth Bird', 'Legolas'];
  for (var i = 0; i < this.numPlayers; i++) {
    if(this.playersName !== null){
      var player = new HumanPlayer(this.playersName);
      this.players.push(player);
      this.playersName = null;
    }else{
      var Cplayer = new ComputerPlayer(computerNames[i-1]);
      this.players.push(Cplayer);
    }
  }
};

Game.prototype.setBoard = function(){
  this.interval = setInterval(this.incrementTurn.bind(this), 100000);
};

Game.prototype.addPlayer = function(name){
  if(this.playersNames.include(name) !== -1){
    return false;
  }
  var pl = new HumanPlayer(name);
  this.playersNames.push(name);
  this.players.push(pl);
  return true;
};

Game.prototype.removePlayer = function(name){
  var index = this.playersNames.indexOf(name);
  this.playersName.splice(index, 1);
  this.players.splice(index, 1);

};

Game.prototype.incrementTurn = function(){
  this.board.addSoldiersToOwnedCountries();
  this.year++;
};



Game.prototype.fightWars = function(index){
  this.board.update();
  var currentCountries = this.players[this.currentPlayer].countriesOwned;
  for (var i = 0; i < currentCountries.length; i++) {
    currentCountries[i].fightWars(this.startBattle, i, 0);
  }

  for (var i = index; i < this.currentWars.length; i++) {
    if(this.currentWars[i].isOffense(this.players[this.currentPlayer])){
      this.startBattle(this.currentWars[i], i);
      break;
    }
  }

  if(index >= this.currentWars.length || i >= this.currentWars.length){
    this.players[this.currentPlayer].wantToWar(this.checkToWar.bind(this));
  }
};

Game.prototype.checkToWar = function(toFightWar){
  if(toFightWar){
    this.instructionsDiv.innerHTML =
      "choose from which country you will be attacking";
    this.players[this.currentPlayer].startWar(this.board, this.initiateWar.bind(this));

  }else{
    this.instructionsDiv.innerHTML =
     "click on which country you want to move men from and then to which to move. It will move one solider per click";
    this.players[this.currentPlayer].moveMen( this.finishMove.bind(this));
  }
};

Game.prototype.finishMove = function(){
  this.rotatePlayers();
  this.distributeSoldiers();
};

Game.prototype.rotatePlayers = function(){
  this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
  this.turnDiv.innerHTML =
  'It is ' + this.players[this.currentPlayer].name + '\'s turn';
};

Game.prototype.startBattle = function(war, index){
  this.soldiersAttack = 0;
  this.soldiersDefend = 0;
  this.instructionsDiv.innerHTML = "";
  war.aggressor.owner.getAttackSoldiers(war, index, this.getDefense.bind(this));
};

Game.prototype.getDefense = function(war, index, attackSoldiers){
  this.soldiersAttack = attackSoldiers;
  war.defender.owner.getDefenseSoldiers(war, index, this.battle.bind(this));
};

Game.prototype.battle = function(war, index, defenseSoldiers){
  this.soldiersDefend = defenseSoldiers;
  if(this.soldiersAttack > this.soldiersDefend){
    war.addAttackVictory();
    alert(war.aggressor.owner.name + " has won the battle!");
  }else {
    war.addDefenseVictory();
    alert(war.defender.owner.name + " has won the battle!");
  }
  war.updateSoldiers(this.soldiersAttack, this.soldiersDefend);

  var defense = war.defender.owner;
  if(war.over()){
    if(defense.numOwned() === 0){
      this.removePlayer(defense);
    }
    this.removeWar(war);
    var warsToRemove = [];
    for (var i = 0; i < this.currentWars.length; i++) {
      if(this.currentWars[i].aggressor.owner === this.currentWars[i].defender.owner){
        warsToRemove.push(i);
      }
    }
    for (var j = 0; j < warsToRemove.length; j++) {
      this.removeWar(warsToRemove[j]);
    }
    if(this.numPlayers === 1){
      this.gameOver();
    }
  }
  this.board.update();

  if(index < this.currentWars.length){
    index += 1;
    this.fightWars(index);
  }else{
    this.players[this.currentPlayer].wantToWar(this.checkToWar.bind(this));
  }
};

Game.prototype.removePlayer = function(player){
  var index = this.players.indexOf(player);
  if (index >= 0) {
    this.players.splice( index, 1 );
  }
  this.numPlayers -= 1;
};

Game.prototype.distributeSoldiers = function(){
  //player recieves and places soldiers on countries at the start of turn.
  //1 player per country?
  var numberPlayers = this.players[this.currentPlayer].numOwned();
  this.instructionsDiv.innerHTML = "Place your men on the board";
  this.players[this.currentPlayer].placeSoldiers(numberPlayers, this.fightWars.bind(this), 0);
};

Game.prototype.initiateWar = function(war){
  //creates new war object where current player is the aggressor and chooses
  //defender. Adds war object to the current wars array.
  this.currentWars.push(war);
  this.fightWars(this.currentWars.length-1);
};

Game.prototype.removeWar = function(war){
  war.aggressor.owner.removeOWar(war);
  war.defender.owner.removeDWar(war);
  var index = this.currentWars.indexOf(war);
  if (index >= 0) {
    this.currentWars.splice( index, 1 );
  }
};

Game.prototype.gameOver = function(){
  this.warningDiv.innerHTML =
    "congrats " + this.players[0].name + " you have conquered the world";
};

module.exports = Game;
