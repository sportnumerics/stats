'use strict';

function extractTeamId(elem) {
  var href = elem.attr('href');
  if (typeof href !== 'undefined') {
    var idMatcher = new RegExp(/\/team\/(\d+)\/\d+/);
    var matches = href.match(idMatcher);
    return matches[1];
  } else {
    return null;
  }
}

function locationAndOpponentNameFromNameHomeAndLocation(name, home, location) {
  var game = {
    location: {},
    opponent: {name}
  };
  game.location.type = location ? 'neutral' : home ? 'home' : 'away';
  if (location) {
    game.location.name = location;
  }
  return game;
}

function extractOpponentAndLocation(elem) {
  let text = elem.text();
  var matcher = new RegExp(/([^\@]*)(@?)([^\@]*)/);
  var matches = text.match(matcher);
  var name = matches[1].trim();
  var home = matches[2] == '';
  var location = matches[3].trim();
  if (name.length == 0) {
    name = location;
    location = undefined;
  }

  return locationAndOpponentNameFromNameHomeAndLocation(name, home, location);
}

function extractResultFromElement(elem) {
  let text = elem.text();
  var matcher = new RegExp(/[WLT] (\d+) \- (\d+)/);
  var matches = text.match(matcher);
  if (matches) {
    var pointsFor = parseInt(matches[1]);
    var pointsAgainst = parseInt(matches[2]);
    return {
      pointsFor,
      pointsAgainst
    };
  } else {
    return undefined;
  }
}

function extractTeamName(elem) {
  return elem.text().trim();
}

function extractGameFromElement(elem) {
  var game = extractOpponentAndLocation(elem);
  game.opponent.id = extractTeamId(elem.find('a').not('.skipMask'));
  return game;
}

function extractTeamFromElement(elem) {
  return {
    id: extractTeamId(elem),
    name: extractTeamName(elem)
  };
}


module.exports = {
  extractGameFromElement,
  extractTeamFromElement,
  extractResultFromElement
};
