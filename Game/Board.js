var Country = require('./Country.js');
var Connection = require('./Connection');
function Board(){
    this.countries = [];
    var allCountries = document.getElementsByClassName('country');
    for (var i = 0; i < allCountries.length; i++) {
      this.countries.push(new Country(allCountries[i]));
    }
    // var NADiv = document.getElementById('NorthAmerica');
    // var SADiv = document.getElementById('SouthAmerica');
    // var EDiv = document.getElementById('Europe');
    //
    // var AsiaDiv = document.getElementById('Asia');
    //
    // var MEDiv = document.getElementById('MiddleEast');
    // var ADiv = document.getElementById('Africa');
    // var AusDiv = document.getElementById('Australia');
    //
    // var Africa = new Country(ADiv);
    // var Asia = new Country(AsiaDiv);
    // var Europe = new Country(EDiv);
    // var NorthAmerica = new Country(NADiv);
    // var Hispania = new Country(SADiv);
    //
    //
    // var MiddleEast = new Country(MEDiv);
    // var Australia = new Country(AusDiv);

    // var AfricaToMidEast = new Connection(Africa, MiddleEast);
    // var AfricaToEurope = new Connection(Africa, Europe);
    // var AfricaToHispania = new Connection(Africa, Hispania);
    // var AsiaToEurope = new Connection(Asia, Europe);
    // var AsiaToMiddleEast = new Connection(Asia, MiddleEast);
    // var AsiaToAustrailia = new Connection(Asia, Australia);
    // var AsiaToNorthAmerica = new Connection(Asia, NorthAmerica);
    // var EuropeToMiddleEast = new Connection(Europe, MiddleEast);
    // var EuropeToNorthAmerica = new Connection(Europe, NorthAmerica);
    // var NorthAmericaToHispania = new Connection(NorthAmerica, Hispania);
    //
    //
    // Africa.addConnection(AfricaToMidEast, AfricaToEurope, AfricaToHispania);
    // Asia.addConnection(AsiaToEurope, AsiaToAustrailia, AsiaToMiddleEast, AsiaToNorthAmerica);
    // Europe.addConnection(AfricaToEurope, EuropeToMiddleEast, AsiaToEurope, EuropeToNorthAmerica);
    // NorthAmerica.addConnection(NorthAmericaToHispania, EuropeToNorthAmerica, AsiaToNorthAmerica);
    // Hispania.addConnection(NorthAmericaToHispania, AfricaToHispania);
    // MiddleEast.addConnection(AfricaToMidEast, EuropeToMiddleEast, AsiaToMiddleEast);
    // Australia.addConnection(AsiaToAustrailia);
    //
    // this.countries.push(Africa);
    // this.countries.push(Asia);
    // this.countries.push(Europe);
    // this.countries.push(NorthAmerica);
    // this.countries.push(Hispania);
    // this.countries.push(MiddleEast);
    // this.countries.push(Australia);
    debugger;
    this.unclaimedCountries = this.countries.slice();
    this.claimedCountries = [];
}
Board.prototype.addSoldiersToOwnedCountries = function(){
  for (var i = 0; i < this.claimedCountries.length; i++) {
    this.claimedCountries[i].troops += 5; 
  }
};
Board.prototype.update = function(){

  for (var i = 0; i < this.countries.length; i++) {
    this.countries[i].update();
  }

};
Board.prototype.removeUnclaimed = function(country){
  var savedIdx;
  for (var i = 0; i < this.unclaimedCountries.length; i++) {
    if(this.unclaimedCountries[i] === country){
      savedIdx = i;
      break;
    }
  }
  this.unclaimedCountries.splice(i, 1);
};
Board.prototype.getCountryByDiv = function(div){
  for (var i = 0; i < this.countries.length; i++) {
    if(this.countries[i].div === div){
      return this.countries[i];
    }
  }
};



module.exports = Board;
