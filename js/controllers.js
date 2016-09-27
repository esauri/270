angular.module('270.controllers', [])
.controller('270Ctrl', function($scope, $rootScope, $state, Auth, Json, Random) {
	//make a global for the party the user chooses
	$rootScope.party = "";	
	//make a global for the number of delegates needed to win the election
	//which ncidentally is the name of the app
	$rootScope.appName = 270;
	//make a global for the number of delegates the user has
	$rootScope.delegates = 0;
	//make a global for the maximum number of delegates available
	$rootScope.delegatesMax = 538;
	//make a function chooseParty that takes in the party parameter
	$scope.chooseParty = function(party){	
		//reset shit just in case
		Auth.reset();
		//set the Auth party cookie to party
		Auth.setParty(party);
		//set the global party to the party cookie		
		$rootScope.party = Auth.getParty();
		
		//since we are only doing 10 states for now (the swing states)
		//players will get all the states that would normally go to democrats or republicans
		
		//if democrat
		if(party == "democrat"){
			//player gets delegates from blue states - 217
			Auth.addDelegates(217);
			Auth.setUser("Hillary Clinton");
			$rootScope.profileImg = 'img/hillary.jpg';
		}
		//else if republican
		else if(party == "republican"){
			//player gets delegates from red states - 191
			Auth.addDelegates(191);
			Auth.setUser("Donald Trump");
			$rootScope.profileImg = 'img/trump.jpg';
		}
		
		//add delegates to rootscope
		$rootScope.delegates = Auth.getDelegates();		
		$rootScope.user = Auth.getUser();
		$rootScope.isPresident = false;
	}   
	//get data from the json file
	$rootScope.getJson = function(){
		Json.getData('appdata/270.json').success(function(data){
			//set our states to that data
			$rootScope.data = data;
		});
	}
	$rootScope.getJson();
})
//States (Main) Screen Controller
.controller('StatesCtrl', function($scope, $rootScope, $ionicScrollDelegate,$http, $state, Auth) {
	//If party hasn't been chosen
	$scope.$on('$ionicView.beforeEnter', function(){
		if(!Auth.hasChosenParty()){
			// go to the start screen
			$state.go('270.start');
		}
        $rootScope.delegates = Auth.getDelegates();		
	});
	$scope.$on('$ionicView.enter', function(){
		if(Auth.hasWonPresidency() && ($rootScope.isPresident == false)){
			var audio = new Audio("media/win.mp3");
			audio.play();
			$rootScope.isPresident = true;
			$ionicScrollDelegate.scrollTop();
			//show congrats modal
			var modal = document.getElementById("congratulations");
			modal.style.display = "block";
		}
	});
	$scope.setState = function(state){		
		//pass into Auth
		Auth.setCurrentState(state);	
		var audio = new Audio("media/click.mp3");
		audio.play();
	};
	
	$scope.closeCongrats = function(event){
		event.currentTarget.parentElement.style.display = "none";
	}
})
.controller('StateCtrl', function($scope, $rootScope, $stateParams,$state, $ionicHistory, Auth) {
	//get the current state
	$scope.$on('$ionicView.beforeEnter', function(){
		getState();
	});
	
	//holds the state json data
	$scope.stateCards = [];
	//holds the current state
	$scope.state = "";	
	//minimum number of points needed to win
	$scope.percentToWin = 50;

	//function to get the current state- pass in the states.json data and the state number
	function getState(){		
		//get the current state
		$scope.state = Auth.getCurrentState();
		if($rootScope.data[$scope.state.id].voted == undefined){
			$rootScope.data[$scope.state.id].voted = false;
		}
		//get the json data from that state
		//if the player's score is greater than 50
		if($rootScope.data.states[$scope.state.num].score > $scope.percentToWin){		
			//player wins!		
			//mark the player
			$scope.playerMarker = "ion-checkmark-round balanced";
            if(!$rootScope.data[$scope.state.id].voted){
				Auth.addDelegates($scope.state.delegates);
				$rootScope.data[$scope.state.id].voted = true;
			}
		}
		//otherwise if the opponent's score is greater than 50
		else if($rootScope.data.states[$scope.state.num].rivalScore > $scope.percentToWin){
			//player loses :(
			//mark the opponent
			$scope.rivalMarker = "ion-checkmark-round balanced";
			$rootScope.data[$scope.state.id].voted = true;
		}
        else{
            //reset marker for player
            $scope.playerMarker = "";
            //reset marker for opponent
            $scope.rivalMarker = "";
        }
		//if  state voted add .state-completed
		if($rootScope.data[$scope.state.id].voted){
			var ele = document.getElementById($scope.state.id);
			ele.classList.add('state-completed');
		}
	}	
	//set card
	$scope.setCard = function(card, event){		
		//set card
		Auth.setCurrentStateCard(card);
		//if article has not been already chosen
		if(!event.currentTarget.classList.contains("completed")){
			//make that card completed
			event.currentTarget.classList.add("completed");
			//go to that card
			$state.go('270.trivia', {name: $stateParams.name, id: card.id});
			var audio = new Audio("media/click.mp3");
			audio.play();
		}
	};
})
.controller('TriviaCtrl', function($scope, $rootScope, $ionicHistory, $state, $stateParams, Auth, Random) {  
  //get the current card info
  $scope.card = Auth.getCurrentStateCard();
  $scope.answers= [];
  $scope.state;
  $scope.$on('$ionicView.beforeEnter', function(){
      $scope.state = Auth.getCurrentState();
      if($rootScope.data[$scope.card.difficulty].length > 0){
		//not shuffling array cause program breaks
        Random.shuffle($rootScope.data[$scope.card.difficulty]);

		//get the last item in the array
        $scope.trivia = $rootScope.data[$scope.card.difficulty][$rootScope.data[$scope.card.difficulty].length - 1];  
		//run init
		$scope.initTrivia($scope.trivia);   				
	}
	 else{
		 $scope.goBack();
	 }
	});	

  $scope.initTrivia = function(trivia){
	//add the answers to an array
	 $scope.answers.push({
		 answer: trivia.wrongOne,
		 bool: false
	 },
	 {
		 answer: trivia.wrongTwo,
		 bool: false
	 },
	 {	
		answer: trivia.wrongThree,
		bool: false
	 },
	 {						 
		answer: trivia.answer,
		bool: true
	 });
	 
	 //shuffle the array 
	 Random.shuffle($scope.answers);
     $rootScope.data[$scope.card.difficulty].pop();
 };	
 
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

	//answer
 $scope.answer = function(event, correct){
	 //vars
	 var question = document.getElementById('trivia-question');
	 var modal, audio;
	 
	 //disbale other buttons
	 var buttons = document.getElementById("answers").children;
	 for(var i =0; i < buttons.length; i++){
		 buttons[i].disabled = true;
	 }
	 //if answer is true
	 if(correct){	 
		 //set the answer background to green
		 event.currentTarget.classList.add("correct");		 
		 //give modal it's target
		 modal = document.getElementById('trivia-correct');
		 //ADD NUMBER TO STATE % SAME FOR INC
		 $rootScope.data.states[$scope.state.num].score += $scope.card.points;
		 audio = new Audio('media/success.mp3');
		
	 }
	 //if answer is false
	 else{
		 //set the answer background to party color
		 event.currentTarget.classList.add("incorrect");
		 //give modal it's target
		 modal = document.getElementById('trivia-incorrect');
 		 $rootScope.data.states[$scope.state.num].rivalScore += $scope.card.points;
		 audio = new Audio('media/wrong.mp3');
	 }
	 
	 Auth.setCurrentState($scope.state);
	 //show modal
	 modal.style.display = "block";	 
     
     //using $scope.card.id set the card in state with that id to disabled/completed
	 $scope.card.completed = "completed";
	 
	 Auth.setCurrentStateCard($scope.card);
	 audio.play();
	 setTimeout($scope.goBack, 650);
 };

 //Go back button
 $scope.goBack = function(){
		//ionicHistory has to be a parameter
		$ionicHistory.goBack();
	};
})
.controller('InstructionsCtrl', function($scope,$rootScope) {
	
})
.controller('AccountCtrl', function($scope,$rootScope, $state, Auth) {
	$scope.candidate = "Presidential Candidate";
	$scope.$on('$ionicView.beforeEnter', function(){
		if(Auth.hasWonPresidency()){
			var mark = document.getElementById('win-mark');
			mark.classList.add('ion-checkmark-round');
			mark.style.color = "#33cd5f";
			$scope.candidate = "President";
		}
	});
	//Reset the game
	$scope.reset = function(){
        $rootScope.getJson();
		Auth.reset();
		$state.go('270.start');
	}
});
