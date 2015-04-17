angular.module('starter.controllers', [])

// we will need to define an exercise service
.factory('ExercisesService', function() {
	var exercises = new Array();
	// we need fixtures
	var ex = {
		name: "Curls", 
		created: "2015-04-02 18:50:12", 
		category: "Free Weights",
		workouts: [{
			date: "2015-04-10 12:21:09",
			sets: [{
				weight: 55, 
				units: "pounds",
				reps: 12,
				duration: "0:58"
			}, {
				weight: 50, 
				units: "pounds",
				reps: 8,
				duration: "0:41"	
			}]
		}, {
			date: "2015-04-02 18:56:18",
			sets: [{
				weight: 45, 
				units: "pounds",
				reps: 8,
				duration: "0:35"
			}, {
				weight: 45, 
				units: "pounds",
				reps: 10,
				duration: "0:41"	
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

.controller('ExercisesCtrl', function($scope, $ionicModal, ExercisesService) {
	$scope.exercises = {};
	$scope.getExercises = function() {
		$scope.exercises = ExercisesService.exercises;
	}	// end getExercises function
}) // end Exercise cotnroller

.controller('ExerciseCtrl', function($scope, $ionicModal, $stateParams, ExercisesService) {
	$ionicModal.fromTemplateUrl('templates/workout_detail.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
	$scope.exercise = {};
	$scope.workout = {};
	$scope.loadExercise = function() {
		$scope.exercise = ExercisesService.exercises[$stateParams.exercise_id];
		console.log($scope.exercise);
		$scope.buildGraph();
	} // end loadWorkout method
	// modal control methods
	$scope.closeWorkout = function() {
    $scope.modal.hide();
  };
  // Open the workout modal
  $scope.showWorkout = function(w_id) {
		// set the workout so the workout can get at it
		$scope.workout = $scope.exercise.workouts[w_id];
    $scope.modal.show();
  };
	
	$scope.buildGraph = function() {
		// we gonn make da graf
		// build the dataset
		var data = {};
		data.labels = new Array();
		data.datasets = [{
			label: "Weight",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: []
		}, {
			label: "Reps",
			fillColor: "rgba(255,187,205,0.2)",
			strokeColor: "rgba(255,187,205,1)",
			pointColor: "rgba(255,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: []							
		}]
		//console.log(data);
		for (workout of $scope.exercise.workouts) {
			// first we need to set the label list name
			console.log(workout);
			data.labels.push(workout.date);
			// dataset 0 is weight, 1 is reps
			// for both sets we will want an average for that workout
			var weight = 0;
			var reps = 0;
			for (set of workout.sets) {
				weight += set.weight;
				reps += set.reps;
			}
			// get the averages
			weight = weight / workout.sets.length;
			reps = reps / workout.sets.length;
			// now we can append it to the dataset
			data.datasets[0].data.push(weight);
			data.datasets[1].data.push(reps);
		} // end workout iteration
		// reverse the array just because the fixtures are ordered wrong
		// remove when db is up
		data.datasets[0].data = data.datasets[0].data.reverse();
		data.datasets[1].data = data.datasets[1].data.reverse();
		console.log('data obj')
		console.log(data);
		// we want a responsive chart
		Chart.defaults.global.responsive = true;
		// get chart el
		var ctx = document.getElementById("linechart").getContext("2d");
		// print it
		var chart = new Chart(ctx).Line(data, {});
	}; // end buildGraph method
	
}) // end exercise controller

.controller('WorkoutCtrl', function($scope) {
	$scope.buildSetRow = function() {
		var container = document.getElementById('sets');
		
		
	} // end buildSetRow method
}) // end workout controller


	

	
	
	
	