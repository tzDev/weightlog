angular.module('starter.controllers', [])

// we will need to define an exercise service
.service('ExercisesService', function() {
	// do it 
	return {
		getExercises: function () {
			var req;
			req = angular.fromJson(storage.getbyKey('exercises'));
			if (req == 'invalid key') {
				// probably first run
				storage.setKey('exercises', null);
				return false;
			}
			// if we get our exercises return them, req will simply be the list
			return req;
		}, // end getExercises method
		
		getById: function (id) {
			var exercises = this.getExercises();
			for (ex of exercises) {
				if (ex.id == id)
					return ex;
				else {
					//return false;
				}
			} // end for
		}, // end getById method
		
		addExercise: function (exercise) {
			// generate an id for it
			exercise.id = storage.mkID(exercise.created_date + exercise.name);
			var exercises = this.getExercises() || [];
			exercises.push(exercise);
			console.log(storage.setKey('exercises', angular.toJson(exercises)));
		}, // end addExercise method
		
		updateExercises: function(exercises) {
			console.log(storage.setKey('exercises', angular.toJson(exercises)));
		}, // end updateExercises method
		
		updateExercise: function(exercise) {
			// take the exercise object and replace the corresponding object 
			// in the keystore with this new updated one
			console.log('updateExercise');
			console.log(exercise.id);
			var exercises = this.getExercises();
			for (ex of exercises) {
				if (ex.id == exercise.id)	{
					// we found the match, let's replace it
					//ex = exercise;
					angular.copy(exercise, ex);
				}
			}
			// now our exercises list should have the data we want
			// update the key 
			this.updateExercises(exercises);
		} // end updateExercise method
		
	}; // end return object
}) // end exercise service

.service('WorkoutService', function(ExercisesService, $location) {
	var workouts = [];
	
	var addWorkout = function(exercise, workout) {
		var exercises = ExercisesService.getExercises();
		for (ex of exercises) {
			if (ex.id == exercise.id) {
				ex.workouts.push(workout);	
			}
		} 
		ExercisesService.updateExercises(exercises);
		$location.url('/exercise/' + exercise.id);
	} // end addWorkout method
	
	
	return {
		addWorkout: addWorkout,
		workouts: workouts
	};
}) // end workoutservice


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

.controller('ExercisesCtrl', function($scope, $ionicModal, $rootScope, ExercisesService) {
	//$scope.exercises = {};
	$scope.getExercises = function() {
		$scope.exercises = ExercisesService.getExercises();
	}	// end getExercises function
	
	$rootScope.$on('$locationChangeSuccess', function () { // not my favorite but it works
		console.log('statechanged');
		$scope.exercises = ExercisesService.getExercises();
	})
	
}) // end Exercise cotnroller

.controller('ExerciseCtrl', function($scope, $ionicModal, $stateParams, $location, ExercisesService, WorkoutService) {
	//  some modal preloading
	$ionicModal.fromTemplateUrl('templates/workout_detail.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
	
	$ionicModal.fromTemplateUrl('templates/edit_set.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.edit_set = modal;
  });
	
	// now the two big m's, models and methods
	$scope.exercise = {};
	$scope.workout = {};
	$scope.loadExercise = function() {
		$scope.exercise = ExercisesService.getById($stateParams.exercise_id);
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
	
	// below method has a form, let's set some models
	$scope.form_exercise = {}; // not sure how I feel about this, kinda messy
	$scope.form_exercise.workouts = [{sets: [{}]}]; // init fix
	//$scope.form_exercise.id = ExercisesService.exercises.length + 1;
	$scope.addExercise = function() {
		// set some defaults
		$scope.form_exercise.created = new Date();
		$scope.form_exercise.workouts[0].date = new Date();
		// add to local storage
		ExercisesService.addExercise($scope.form_exercise);
		// lets clean this up since we are repeating ourselves
		$scope.form_exercise = {}; // not sure how I feel about this, kinda messy
		$scope.form_exercise.workouts = [{sets: [{}]}]; // init fix
		// redirect the user
		$location.url("/exercises");
	}; // end addExercise
	
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
		// we want a responsive chart
		Chart.defaults.global.responsive = true;
		// get chart el
		var ctx = document.getElementById("linechart").getContext("2d");
		// print it
		var chart = new Chart(ctx).Line(data, {});
		console.log('chart data');
		console.log(data);
	}; // end buildGraph method
	
	$scope.sets = [{
		weight: null, 
		reps: null, 
		duration: null
	}];
	
	$scope.addSet = function() {
		$scope.sets.push({
			weight: null, 
			reps: null, 
			duration: null
		});
	};
	
	$scope.showEditSet = function(set_id) {
		$scope.edit_set.show();
		var current_set = $scope.workout.sets[set_id];
		$scope.sets = [current_set];
	} // end showEdit method
	
	$scope.saveSet = function() {
		// update the current workout to include this set
		$scope.workout.sets = $scope.sets;
		//console.log('scope.exercise.workouts');
		//console.log($scope.exercise.workouts);
		//console.log('new exercise:');
		//console.log($scope.exercise);
		ExercisesService.updateExercise($scope.exercise);
	}; // end saveSet method
	
	$scope.form_workout = {};
	$scope.saveWorkout = function() {
		$scope.form_workout.sets = $scope.sets;
		// get the exercise
		var ex = ExercisesService.getById($stateParams.exercise_id);
		//ex.workouts.push($scope.form_workout);
		WorkoutService.addWorkout(ex, $scope.form_workout);
	}; // end saveWorkout method
	
}) // end exercise controller

	

	
	
	
	