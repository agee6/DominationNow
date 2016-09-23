

function War(aggressor, defendor){
  this.aggressor = aggressor;
  this.defender = defendor;
  this.battles = [];
  this.victor = null;
}

War.prototype.isOffense = function(player){
  if(this.aggressor.owner === player){
    return true;
  }else {
    return false;
  }
};

War.prototype.addAttackVictory = function(){
    this.battles.push(1);
};

War.prototype.addDefenseVictory = function(){
  this.battles.push(0);
};

War.prototype.updateSoldiers = function(attackMen, defenseMen){
  var lessOffense = Math.ceil(attackMen/2);
  var lessDefense = Math.floor(defenseMen/2);
  if(this.defender.troops === 1){
    lessDefense = 1;
  }
  this.aggressor.troops = this.aggressor.troops - lessOffense;
  this.defender.troops = this.defender.troops - lessDefense;
};


War.prototype.over = function(){
  if(this.defender.troops === 0){
    this.aggressor.owner.claimCountry(this.aggressor,this.defender);
    return true;
  }
  var arrSum = 0;
  this.battles.forEach(function(battle){
    arrSum += battle;
  });
  if(arrSum >= 2){
    this.aggressor.owner.claimCountry(this.aggressor, this.defender);
    return true;
  }
  if(this.battles.length === 3 ){
    return true;

  }
  return false;
};

module.exports = War;
