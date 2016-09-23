function Player(name){
  this.countriesOwned = [];
  this.name = name;
  this.ableToFight = [];
  this.currentOffensiveWars = [];
  this.defending = [];

}

Player.prototype.claimCountry = function(fromCountry, toCountry){
  
  this.countriesOwned.push(toCountry);
  toCountry.owner.removeCountry(toCountry);
  toCountry.owner = this;
  if(toCountry.troops < 1){
    fromCountry.troops -=1;
    toCountry.troops += 1;
  }
  //prompt to user to get number of soldiers to move from
  //fromCountry to toCountry
};
Player.prototype.removeCountry = function(country){
  var index = this.countriesOwned.indexOf(country);
  if(index >= 0){
    this.countriesOwned.splice(index,1);
  }
};
Player.prototype.numOwned = function(){
  return this.countriesOwned.length;
};
Player.prototype.addOWar = function(war){
  this.currentOffensiveWars.push(war);
};
Player.prototype.addDWar = function(war){
  this.defending.push(war);
};
Player.prototype.removeOWar = function(war){

};
Player.prototype.removeDWar = function(war){

};
Player.prototype.inWarWith = function(country){
  for (var i = 0; i < this.currentOffensiveWars.length; i++) {
    if(this.currentOffensiveWars[i].defender === country){
      return true;
    }
  }
  for (var j = 0; j < this.defending.length; j++) {
    if(this.defending[j].aggressor === country){
      return true;
    }
  }
  return false;
};

module.exports = Player;
