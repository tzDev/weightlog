angular.module('starter.controllers', [])

// we will need to define an exercise service
.factory('ExercisesService', function() {
	var exercises = new Array();

	var ex = {
		name: "Curls", 
		created: "2015-04-02 18:50:12", 
		category: "Free Weights",
		workouts: [{
			date: "2015-04-02 18:56:18",
			sets: [{
				weight: 45, 
				units: "pounds",
				reps: 8,
				duration: "0:35"
			}]
		}]
	}; // end exercise fixture
	var ex1 = {
		name: "Shrugs", 
		created: "2015-04-02 19:01:12", 
		category: "Free Weights",
		workouts: [{
			date: "2015-04-02 19:05:18",
			sets: [{
				weight: 55, 
				units: "pounds",
				reps: 12,
				duration: "0:47"
			}]
		}]
	}; // end exercise fixture
	exercises[0] = ex;
	exercises[1] = ex1;
	
	return {
		exercises: exercises
	}
}) // end exercise service


// now some controllers
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}) // end AppCtrl

.controller('SettingsCtrl', function($scope) {

}) // end Settings controller

.controller('ExerciseCtrl', function($scope, $ionicModal, ExercisesService) {
	$scope.exercises = {};
	$scope.getExercises = function() {
		$scope.exercises = ExercisesService.exercises;
	}	// end getExercises function
}) // end Exercise cotnroller

.controller('WorkoutCtrl', function($scope, $ionicModal, $stateParams, ExercisesService) {
	$ionicModal.fromTemplateUrl('templates/workout_detail.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
	$scope.exercise = {};
	$scope.loadWorkout = function() {
		$scope.exercise = ExercisesService.exercises[$stateParams.workout_id];
		console.log($scope.exercise);
		$scope.buildGraph();
	} // end loadWorkout method
	// modal control methods
	$scope.closeWorkout = function() {
    $scope.modal.hide();
  };
  // Open the workout modal
  $scope.showWorkout = function() {
    $scope.modal.show();
  };
	
	
	
}) // end workout controller



	

	
	
	
	