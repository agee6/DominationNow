var Country = require('./Country.js');
var Connection = require('./Connection');

function Board(){
    this.countries = {};
    var countryIds = [
      "East Africa", "Egypt", "Congo", "Madagascar", "South Africa",
      "North Africa", "Afghanistan", "India", "Irkutsk", "Kamchatka",
      "Middle East", "Mongolia", "Siam", "China", "Japan", "Siberia",
      "Ural", "Yakutsk", "New Guinea", "Western Australia", "Indonesia",
      "Eastern Australia", "Great Britain", "Iceland", "Northern Europe",
      "Scandinavia", "Southern Europe", "Ukraine", "Western Europe", "Alaska",
      "Alberta", "Central America", "Eastern United States", "Greenland",
      "Northwest Territory", "Ontario", "Western United States", "Quebec",
      "Argentina", "Brazil", "Peru", "Venezuela"
    ];

    var countryMap = {
      "East Africa": ["Egypt", "Congo", "Madagascar", "South Africa", "North Africa", "Middle East"],
      "Egypt": ["Middle East", "Southern Europe", "North Africa", "East Africa"],
      "Congo": ["East Africa", "North Africa", "South Africa"],
      "Madagascar": ["East Africa", "South Africa"],
      "South Africa": ["Madagascar", "East Africa", "Congo"],
      "North Africa": ["Brazil", "Southern Europe", "Western Europe", "Congo", "East Africa", "Egypt"],
      "Afghanistan": ["Middle East", "India", "China", "Ural", "Ukraine"],
      "India": ["Siam", "China", "Afghanistan", "Middle East"],
      "Irkutsk":["Mongolia", "Kamchatka", "Yakutsk", "Siberia"],
      "Kamchatka": ["Japan", "Alaska", "Yakutsk", "Irkutsk", "Mongolia"],
      "Middle East": ["Egypt", "East Africa", "India", "Afghanistan", "Ukraine", "Southern Europe"],
      "Mongolia": ["China", "Japan", "Kamchatka", "Irkutsk", "Siberia"],
      "Siam": ["China", "India", "Indonesia"],
      "China": ["Japan", "Mongolia", "Siberia", "Ural", "Afghanistan", "India", "Siam"],
      "Japan": ["China", "Mongolia", "Kamchatka"],
      "Siberia": ["Ural", "China", "Mongolia", "Irkutsk", "Yakutsk"],
      "Ural":["Afghanistan", "China", "Siberia", "Ukraine"],
      "Yakutsk": ["Kamchatka", "Siberia", "Irkutsk"],
      "New Guinea": ["Indonesia", "Eastern Australia", "Western Australia"],
      "Western Australia":["Eastern Australia", "New Guinea", "Indonesia"],
      "Indonesia": ["Eastern Australia", "New Guinea", "Western Australia"],
      "Eastern Australia": ["Western Australia", "New Guinea", "Indonesia"],
      "Great Britain": ["Scandinavia", "Northern Europe", "Western Europe", "Iceland"],
      "Iceland": ["Greenland", "Great Britain", "Scandinavia"],
      "Northern Europe": ["Ukraine", "Southern Europe", "Western Europe", "Great Britain", "Scandinavia"],
      "Scandinavia": ["Ukraine", "Northern Europe", "Great Britain","Iceland"],
      "Southern Europe": ["Ukraine", "Middle East", "Egypt", "North Africa", "Western Europe", "Northern Europe"],
      "Ukraine": ["Ural", "Afghanistan", "Middle East", "Southern Europe", "Northern Europe", "Scandinavia"],
      "Western Europe": ["Northern Europe", "Southern Europe", "North Africa", "Great Britain"],
      "Alaska": ["Kamchatka", "Northwest Territory", "Alberta"],
      "Alberta": ["Alaska", "Northwest Territory", "Ontario", "Western United States"],
      "Central America": ["Western United States", "Eastern United States", "Venezuela"],
      "Eastern United States": ["Ontario", "Quebec", "Central America", "Western United States"],
      "Greenland": ["Iceland", "Northwest Territory", "Ontario", "Quebec"],
      "Northwest Territory": ["Alaska", "Greenland", "Ontario", "Alberta"],
      "Ontario": ["Alberta", "Northwest Territory", "Greenland", "Quebec", "Eastern United States", "Western United States"],
      "Western United States": ["Alaska", "Ontario", "Eastern United States", "Central America"],
      "Quebec": ["Ontario", "Greenland", "Eastern United States"],
      "Argentina": ["Peru", "Brazil"],
      "Brazil": ["Venezuela", "North Africa", "Argentina", "Peru"],
      "Peru": ["Venezuela", "Brazil", "Argentina"],
      "Venezuela": ["Central America", "Brazil", "Peru"]
    };
    for (var i = 0; i < countryIds.length; i++) {
      this.countries[countryIds[i]] = new Country(countryIds[i]);
    }
    var countryMapKeys = Object.keys(this.countries);
    for (var i = 0; i < countryMapKeys.length; i++) {
      var neighbors = countryMap[countryMapKeys[i]];
      var currentCount = this.countries[countryMapKeys[i]];
      for (var j = 0; j < neighbors.length; j++) {
        var neighbor = this.countries[neighbors[j]];
        if(neighbor.neighbors().indexOf(currentCount) === -1){
          var connection = new Connection(currentCount, neighbor);
          neighbor.addConnection(connection);
          currentCount.addConnection(connection);
        }
      }
    }
    this.countryIds = countryIds;

    this.unclaimedCountries = countryMapKeys;
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
Board.prototype.getBoardState = function(){
  var boardState = {};
  for (var i = 0; i < this.countryIds.length; i++) {
    var curCountry = this.countries[this.countryIds[i]];
    boardState[this.countryIds[i]] = {troops: curCountry.troops, owner: curCountry.owner};
  }
  return boardState;

};



module.exports = Board;
