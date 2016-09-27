// 270 - Ionic App
angular.module('270', ['ionic', '270.controllers', '270.services', '270.hideTabBar'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  //put the tab bar in the bottom
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
  
  //
  // setup an abstract state for the tabs directive
    .state('270', {
    url: '/270',
    abstract: true,
    templateUrl: 'templates/tabs.html',
	controller: '270Ctrl'
	  //on enter
	  /*
	  ,
	onEnter: function($state, Auth){
		//if first time
		if(!Auth.hasChosenParty()){
			//go to start screen
			$state.go('270.start');
		}
	}*/
  })

  // Each tab has its own nav history stack:
  //Start Screen - Where you choose a party
  .state('270.start', {
    url: '/start',
    views: {
      '270-states': {
        templateUrl: 'templates/270-start.html',
        controller: '270Ctrl'
      } 
    }
  })
  
   //States Screen - AKA State Picker
  .state('270.states', {
      url: '/states',
      views: {
        '270-states': {
          templateUrl: 'templates/270-states.html',
          controller: 'StatesCtrl',
		  swipeBackEnabled: 'false'
        }
      }
    })
  
  //State - Individual State
  .state('270.state', {
      url: '/states/:name',
      views: {
        '270-states': {
          templateUrl: 'templates/270-state.html',
          controller: 'StateCtrl',
		  swipeBackEnabled: 'true'
        }
      }
    })
  
  //Trivia - Trivia Screen
  .state('270.trivia', {
      url: '/states/:name/:id',
      views: {
        '270-states': {
          templateUrl: 'templates/270-trivia.html',
          controller: 'TriviaCtrl',
		  swipeBackEnabled: 'true'
        }
      }
    })
  
  //Instruction Screen
  .state('270.instructions', {
    url: '/instructions',
    views: {
      '270-instructions': {
        templateUrl: 'templates/270-instructions.html',
        controller: 'InstructionsCtrl'
      }
    }
  })
  
  //Acount Screen
  .state('270.account', {
      url: '/account',
      views: {
        '270-account': {
          templateUrl: 'templates/270-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('270/start');
})

.config(['$compileProvider', function ($compileProvider){
	$compileProvider.debugInfoEnabled(false);
}]);

