angular.module('270.services', ['ngCookies'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
//authentication for user
.factory('Auth', function($cookieStore){
	//make variables for user
	var _user = $cookieStore.get('270.user');
	//make a cookie for the party
	var _party = $cookieStore.get('270.party');
	//make a cookie for the delegates
	var _delegates = $cookieStore.get('270.delegates');
	//make a cookie for the current state
	var _currentState = $cookieStore.get('270.currentState');
	//make a cookie for the current state card
	var _currentStateCard = $cookieStore.get('270.currentStateCard');
    //make a cookie for the trivia
    var _trivia = $cookieStore.get('270.trivia');    
	//function to set user
	var setUser = function(user){
		_user = user;
		$cookieStore.put('270.user', _user);
	}
	//function to set party
	var setParty = function(party){
		_party = party;
		$cookieStore.put('270.party', _party);
	}		
	//function to add delegates
	var addDelegates = function(delegates){
		_delegates += delegates;
		$cookieStore.put('270.delegates', _delegates);
	}
	//function to set current state
	var setCurrentState = function(state){
		//state.score = score;
		//state.rivalScore = rivalScore;
		_currentState = state;
		$cookieStore.put('270.currentState', _currentState);
	}
	//function to set current state card
	var setCurrentStateCard = function(card){
		_currentStateCard = card;
		$cookieStore.put('270.currentStateCard', _currentStateCard);
	}
    
    var setTrivia = function(trivia){
        _trivia = trivia;
        $cookieStore.put('270.trivia', _trivia);
    }
	return{
		setUser: setUser,
		setParty: setParty,
		setCurrentState: setCurrentState,
		setCurrentStateCard: setCurrentStateCard,
        setTrivia: setTrivia,
		addDelegates: addDelegates,
		hasChosenParty: function(){
			return _party ? true : false;
		},
		hasWonPresidency : function(){
			if(_delegates >= 270){
				return true;
			}
			else{
				return false;
			}
		},
		getUser: function(){
			return _user;	
		},
		getParty: function(){
			return _party;	
		},
		getDelegates: function(){
			return _delegates;
		},
		getCurrentState: function(){
			return _currentState;
		},
		getCurrentStateCard: function(){
			return _currentStateCard;
		},
        getTrivia: function(){
            return _trivia;
        },
		reset: function(){
			$cookieStore.remove('270.party');
			$cookieStore.remove('270.user');
			$cookieStore.remove('270.delegates');
			_delegates = 0;
            _trivia = null;
			_user = null;
			_party = null;
            _currentState = null;
		}
	}
})
//Factory to get JSON Data
//call Json.getdata() and pass in an url
.factory('Random', function(){	
	var randomFloat = function(min, max){
		return Math.random() * (max - min) + min;
	}
	var randomInt = function(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	var shuffle = function(array){
		var len = array.length, temp, i;
        //while there remain elements to shuffle
        while(len){
            //pick a remaining element
            i = Math.floor(Math.random() * len--);
            
            //And swap it with a current element
            temp = array[len];
            array[len] = array[i];
            array[i] = temp;
        }
	}
	return{
		getRandomFloat: randomFloat,
		getRandomInt: randomInt,
		shuffle: shuffle
	}
})
.factory('Trivia', function(){
	var all = function(objects){
		return objects;
	}
	
	var remove = function(objects, object){
		return objects.splice(objects.indexOf(object), 1);
	}
	
	var get = function(objects, objectId){
		for(var i = 0; i < objects.length; i++){
			if(objects[i].id === parseInt(objectId)){
				return objects[i];
			}
		}
		return null;
	}
	
	return{
		all: all,
		remove: remove,
		get: get
	}
})
.factory('Json', function($http){
	return {getData: function(url){
		return $http({
			url: url,
			method: 'GET'
		})
	}}
});