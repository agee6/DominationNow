var Player = require('./Player.js');
var util = require('./util.js');
var War = require('./War.js');

function HumanPlayer(options){
  Player.call(this,options);
}
util.inherits(HumanPlayer, Player);

HumanPlayer.prototype.claimUnclaimed = function(board, callBack){

  var countriesToAdd = board.unclaimedCountries;
  var that = this;
  var addCountry = function(event){
    var countryDiv = event.target;
    var country = board.getCountryByDiv(countryDiv);

    that.countriesOwned.push(country);
    country.owner = that;
    country.troops = 1;
    for (var i = 0; i < countriesToAdd.length; i++) {
      countriesToAdd[i].div.removeEventListener('click', addCountry);
    }
    board.removeUnclaimed(country);
    board.update();

    callBack();
  };

  for (var i = 0; i < countriesToAdd.length; i++) {
    countriesToAdd[i].div.addEventListener('click', addCountry);
  }

};

HumanPlayer.prototype.placeSoldiers = function(num,callBack,soldiersRemaining){

  var that = this;
  var addMen = function(event){
    event.preventDefault();
    var countryDiv = event.target;
    var country = that.getCountryFromDiv(countryDiv);
    country.troops += num;
    for (var i = 0; i < that.countriesOwned.length; i++) {
      that.countriesOwned[i].div.removeEventListener('click',addMen);
    }
    callBack(soldiersRemaining);
  };
  for (var i = 0; i < this.countriesOwned.length; i++) {
    this.countriesOwned[i].div.addEventListener('click',addMen);
  }
};

HumanPlayer.prototype.getCountryFromDiv = function(div){
  for (var i = 0; i < this.countriesOwned.length; i++) {
    if(this.countriesOwned[i].div === div){
      return this.countriesOwned[i];
    }
  }
};

HumanPlayer.prototype.startWar = function(board, callback){

  var defender = null;
  var attacker = null;
  var that = this;
  var setAttack = function(event){
    var attackDiv = event.target;
    attacker = board.getCountryByDiv(attackDiv);
    for (var i = 0; i < that.ableToFight.length; i++) {
      that.ableToFight[i].div.removeEventListener('click',setAttack);
      that.ableToFight[i].div.classList.remove('glow');
    }
    setDefense();
  };
  for (var i = 0; i < this.ableToFight.length; i++) {
    this.ableToFight[i].div.addEventListener('click',setAttack);
    this.ableToFight[i].div.classList.add('glow');
  }
  var setDefense = function(){
    for (var j = 0; j < attacker.ableToFight().length; j++) {
      attacker.ableToFight()[j].div.addEventListener('click', sendAttack);
      attacker.ableToFight()[j].div.classList.add('glow');
    }
    document.getElementById('instruction-div').innerHTML =
      "Choose which country you would like to attack";
  };

  var sendAttack = function(){
    var defenseDiv = event.target;
    defender = board.getCountryByDiv(defenseDiv);
    for (var j = 0; j < attacker.ableToFight().length; j++) {
      attacker.ableToFight()[j].div.removeEventListener('click', sendAttack);
      attacker.ableToFight()[j].div.classList.remove('glow');
    }

    var war = new War(attacker, defender);
    that.addOWar(war);
    defender.owner.addDWar(war);
    callback(war);
  };

};

HumanPlayer.prototype.wantToWar = function(callback){
  var ableToWar = false;
  this.ableToFight = [];
  for (var i = 0; i < this.countriesOwned.length; i++) {
    if(this.countriesOwned[i].ableToFight()){
      this.ableToFight.push(this.countriesOwned[i]);
      ableToWar = true;
    }
  }
  if(!ableToWar){
    callback(false);
  }else{
    var stay = window.confirm("would you like to initiate a War?");

    if(stay){
      callback(true);
    }else{
      callback(false);
    }
  }
};

HumanPlayer.prototype.moveMen = function(callback){
  var finishDiv = document.getElementById('finished-moving');
  var fromCountry;
  var toCountry;
  var warningDiv = document.getElementById('warning-div');
  var numToMove = 1;
  var that = this;
  var placesToMove = [];
  var oneClicked = false;
  finishDiv.style.display = 'block';
  var finishedMoving = function(event){
    if(oneClicked){
      for (var i = 0; i < placesToMove.length; i++) {
        placesToMove[i].div.removeEventListener('click', moveTheMen);
      }
    }else{
      for (var i = 0; i < that.countriesOwned.length; i++) {
       that.countriesOwned[i].div.removeEventListener('click', toMove);
       that.countriesOwned[i].div.classList.remove('glow');
      }

    }

    finishDiv.style.display = "none";
    finishDiv.removeEventListener('click', finishedMoving);
    callback();

  };


  var moveTheMen = function(event){
    var toDiv = event.target;
    toCountry = that.getCountryFromDiv(toDiv);
    fromCountry.troops -= numToMove;
    fromCountry.ableToMove -= numToMove;
    toCountry.troops += numToMove;
    fromCountry.update();
    toCountry.update();
    oneClicked = false;
    for (var i = 0; i < that.countriesOwned.length; i++) {
      if(that.countriesOwned[i].ableToMove > 0 ){
        that.countriesOwned[i].div.addEventListener('click', toMove);
        that.countriesOwned[i].div.classList.add('glow');
      }
    }
    for (var i = 0; i < placesToMove.length; i++) {
      placesToMove[i].div.removeEventListener('click', moveTheMen);
      placesToMove[i].div.classList.remove('glow');
    }
    placesToMove = [];
  };

  var toMove = function(event){
    var fromDiv = event.target;
    fromCountry = that.getCountryFromDiv(fromDiv);
    var hasToMove = false;
    for (var i = 0; i < fromCountry.connections.length; i++) {
      if(fromCountry.connections[i].owner === that){
        hasToMove = true;
        placesToMove.push(fromCountry.connections[i]);
      }
    }


    if(fromCountry.ableToMove < 1 || !hasToMove){
      warningDiv.innerHTML = "No soldiers able to move here";
    }else{
      for (var i = 0; i < that.countriesOwned.length; i++) {
       that.countriesOwned[i].div.removeEventListener('click', toMove);
       that.countriesOwned[i].div.classList.remove('glow');
      }
      for (var i = 0; i < placesToMove.length; i++) {
        placesToMove[i].div.addEventListener('click', moveTheMen);
        placesToMove[i].div.classList.add('glow');
      }
      oneClicked = true;
    }
  };

  finishDiv.addEventListener('click', finishedMoving);
  for (var i = 0; i < this.countriesOwned.length; i++) {

    this.countriesOwned[i].resetAbleToMove();
    if(this.countriesOwned[i].ableToMove > 0){
      this.countriesOwned[i].div.addEventListener('click', toMove);
      this.countriesOwned[i].div.classList.add('glow');
    }
  }

};

HumanPlayer.prototype.getAttackSoldiers = function(war, index, callback){
  var instructDiv = document.getElementById('input-label');
  var input = document.getElementById('user-input');
  var inputBut = document.getElementById('user-input-button');
  input.value = 1;
  var inputVal;
  var max = war.aggressor.troops - 1;
  var modal = document.getElementById('myModal');
  modal.style.display = "block";
  var instructString =
    "Enter how many soldiers you want to send to war(min: 1, max: " + max + ")";
  instructDiv.innerHTML = instructString;

  var validateInput = function(event){

    event.preventDefault();
    inputVal = parseInt(input.value);
    if(inputVal > 0 && inputVal <= max){
      inputBut.removeEventListener('click', validateInput);
      modal.style.display = "none";

      callback(war, index, inputVal);
    }else{
      instructDiv.innerHTML =
      "invalid input please enter a number between 1 and " + max + ".";

    }

  };
  inputBut.addEventListener('click', validateInput);



};
HumanPlayer.prototype.getDefenseSoldiers = function(war, index, callback){
  var instructDiv = document.getElementById('input-label');
  var input = document.getElementById('user-input');
  var inputBut = document.getElementById('user-input-button');
  input.value = 1;
  var inputVal;
  var max = war.defender.troops;
  var modal = document.getElementById('myModal');
  modal.style.display = "block";
  var instructString =
    "Enter how many soldiers you want to use to defend(min: 1, max: " + max + ")";
  instructDiv.innerHTML = instructString;

  var validateInput = function(event){

    event.preventDefault();
    inputVal = parseInt(input.value);
    if(inputVal > 0 && inputVal <= max){
      inputBut.removeEventListener('click', validateInput);
      modal.style.display = "none";

      callback(war, index, inputVal);
    }else{
      instructDiv.innerHTML =
      "invalid input please enter a number between 1 and " + max + ".";

    }

  };
  inputBut.addEventListener('click', validateInput);

};


HumanPlayer.prototype.type = "HumanPlayer";
module.exports = HumanPlayer;
