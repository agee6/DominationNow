

function Connection(country1, country2){
  this.country1 = country1;
  this.country2 = country2;
  this.friendly = true;
  this.atWar = false;
}

Connection.prototype.updateFriendly = function(){
  if(this.country1.owner === this.country2.owner){
    this.friendly = true;
  }else{
    this.friendly = false;
  }
};

Connection.prototype.updateWar = function(war){
  this.atWar = war;
};

Connection.prototype.endWar = function(){
  this.atWar = false;
  this.updateFriendly();
};

Connection.prototype.getNeighbor = function(country){
  if(this.country1 === country){
    return this.country2;
  }else{
    return this.country1;
  }
}; 

module.exports = Connection;
