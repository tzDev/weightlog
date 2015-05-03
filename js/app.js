// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
	
	
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.exercises', {
    url: "/exercises",
    views: {
      'menuContent': {
        templateUrl: "templates/exercises.html",
				controller: 'ExercisesCtrl'
      }
    }
  })
	
	.state('app.settings', {
		url: "/settings",
		views: {
			'menuContent': {
				templateUrl: "templates/settings.html",
				controller: 'SettingsCtrl'
			}
		}
	})
	
	.state('app.exercise', {
		url: "/exercise/:exercise_id",
		views: {
			'menuContent': {
				templateUrl: "templates/exercise.html",
				controller: 'ExerciseCtrl'
			}
		}
	})
	
	.state('app.add-exercise', {
		url: "/exercises/add",
		views: {
			'menuContent': {
				templateUrl: "templates/add_exercise.html",
				controller: 'ExerciseCtrl'
			}
		}
	})
	
	.state('app.add-workout', {
		url: "/workouts/add/:exercise_id", // exercise is its parent
		views: {
			'menuContent': {
				templateUrl: "templates/add_workout.html",
				controller: 'ExerciseCtrl'
			}
		}
	})
	
	.state('app.add-set', {
		url: "/sets/add/:workout_id", // workout is its parent
		views: {
			'menuContent': {
				templateUrl: "templates/add_set.html",
				controller: 'ExerciseCtrl'
			}
		}
	})
	

	;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/exercises');
	


});










