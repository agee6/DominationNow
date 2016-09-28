

function Country(name){
  this.owner = null;
  this.troops = 10;
  this.connections = [];
  this.nameId = name;
  this.ableToMove = 0;
  this.fighting = [];
  this.defending = [];
}

Country.prototype.addConnection = function(connection){
  // this.connections = this.connections.concat(arguments);
  // for (var i = 0; i < arguments.length; i++) {
  //     this.connections.push(arguments[i]);
  // }
  this.connections.push(connection);
};

Country.prototype.neighbors = function(){
  var neighborArr = [];
  for (var i = 0; i < this.connections.length; i++) {
    neighborArr.push(this.connections[i].getNeighbor(this));
  }
  return(neighborArr);
};

Country.prototype.getFriendlyNeighbors = function(){
  var friendly = [];
  for (var i = 0; i < this.connections.length; i++) {
      if(this.connections[i].friendly){
        friendly.push(this.connections[i].getNeighbor(this));
      }
  }
  return friendly;
};

Country.prototype.getEnemyNeighbors = function(){
  var enemies = [];
  for (var i = 0; i < this.connections.length; i++) {
    if(!this.connections[i].friendly){
      enemies.push(this.connections[i].getNeighbor(this));
    }
  }
};

Country.prototype.update = function(){

};

Country.prototype.fightWars = function(callback, indexOne, indexCurrent){
  for (var i = indexCurrent; i < this.wars.length; i++) {
    callback(this.wars[i], i);
    break;
  }
};

Country.prototype.resetFriendly = function(){
  this.connections.forEach(function(connection){
    connection.updateFriendly();
  });
};

Country.prototype.resetAbleToMove = function(){
  this.ableToMove = this.troops - 1;
};

Country.prototype.ableToFight = function(){
  if(this.troops < 2){
    return false;
  }
  var enemies = this.getEnemyNeighbors();
  for (var i = 0; i < enemies.length; i++) {
    if(enemies[i].atWar === false){
      return true;
    }
  }
  return false;
};

Country.prototype.addFight = function(country){
  this.fighting.push(country);
};

Country.prototype.addDefend = function(country){
  this.defending.push(country);
};


module.exports = Country;
