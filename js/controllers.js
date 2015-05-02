angular.module('starter.controllers', [])

// we will need to define an exercise service
.service('ExercisesService', function() {
	// do it 
	return {
		getExercises: function () {
			var req = storage.getbyKey('exercises');
			if (req == 'invalid key') {
				// probably first run
				storage.setKey('exercises', "[]");
				storage.setKey('exercise_units', 'Pounds'); // default to pounds
				return false;
			}
			// if we get our exercises return them, req will simply be the list
			var exercises = angular.fromJson(req);
			// sort the exercises by date
			exercises = storage.sorbyDate(exercises, 'created');
			// now go through each and sort the workouts by date
			for (e of exercises) {
				storage.sorbyDate(e.workouts, 'date');
			}
			// now exercises is a nice list of date sorted objects
			return exercises;
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
		}, // end updateExercise method
		
		deleteExercise: function(exercise_id) {
			var exercises = this.getExercises();
			for (var i = 0; i < exercises.length; i++) {
				if (exercises[i].id == exercise_id) {
					exercises.remove(i);	
				}
			}
			this.updateExercises(exercises);
		} // end deleteExercise method
		
		
	}; // end return object
}) // end exercise service

.service('WorkoutService', function(ExercisesService, $location, DatetimeService) {
	var workouts = [];
	
	var addWorkout = function(exercise, workout) {
		var exercises = ExercisesService.getExercises();
		workout.date = DatetimeService.formatDate(new Date(workout.date + " " + workout.time));
		for (ex of exercises) {
			if (ex.id == exercise.id) {
				ex.workouts.push(workout);	
			}
		} 
		ExercisesService.updateExercises(exercises);
		window.history.back();
	} // end addWorkout method
	
	
	return {
		addWorkout: addWorkout,
		workouts: workouts
	};
}) // end workoutservice

.service('DatetimeService', function($filter){
	return {
		//Format our date into Apr-04-2014
		formatDate: function(in_date) {
			var date_proper = $filter('date')(new Date(in_date), 'MMM dd yyyy H:mm a');
			return date_proper;
		}
	};
})// end DateTimeService

.factory('Units', function() {
	return {
		lbtoKg: function(lbs) {
			return parseInt(lbs) * 0.454;
		}, // end lbtoKg method
		kgtoLbs: function(kg) {
			return parseInt(kg) * 2.2;
		}, // end kgtoLbs method
		
		printWeight: function(weight, units) {
			if (this.currentUnits() == 'Pounds') {
				// pounds 
				if (units == 'Pounds') 
					return weight; // nothing to be done
				else 
					return this.lbtoKg(weight);
			}
			else {
				// kilos	
				if (units == 'Kilograms')
					return weight; //nothing to be done
				else 
					return this.kgtoLbs(weight);
			}
		}, // end printWeight
	
		currentUnits: function() {
			return storage.getbyKey('exercise_units');
		} // end currentUnits method
	}
}) // end unit factory


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

.controller('ExercisesCtrl', function($scope, $ionicModal, $rootScope, ExercisesService) {
	//$scope.exercises = {};
	$scope.show_delete = false;
	
	$scope.getExercises = function() {
		$scope.exercises = ExercisesService.getExercises();
	}	// end getExercises function
	
	$scope.toggleDelete = function() {
		$scope.show_delete = ($scope.show_delete) ? false : true;
	} // end toggleDelete
	
	$scope.deleteExercise = function(exercise_id) {
		// remove the exercise from memory and localstorage by id
		ExercisesService.deleteExercise(exercise_id);
	}
	
	$rootScope.$on('$locationChangeSuccess', function () { // not my favorite but it works
		console.log('statechanged');
		$scope.exercises = ExercisesService.getExercises();
	})
	
}) // end Exercise cotnroller

.controller('ExerciseCtrl', function($scope, $ionicModal, $stateParams, $location, ExercisesService, WorkoutService, DatetimeService, Units) {
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
	
	$ionicModal.fromTemplateUrl('templates/add_set.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.add_set = modal;
  });
	
	// now the two big m's, models and methods
	$scope.exercise = {};
	$scope.workout = {};
	$scope.uf = Units; // scope the units factory
	$scope.loadExercise = function() {
		$scope.ds = DatetimeService; // need that
		$scope.exercise = ExercisesService.getById($stateParams.exercise_id);
		console.log('got scope.exercise');
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
	
	// below method has a form, let's set some models
	$scope.form_exercise = {}; // not sure how I feel about this, kinda messy
	$scope.form_exercise.workouts = [{units: Units.currentUnits(), sets: [{}]}]; // init fix
	//$scope.form_exercise.id = ExercisesService.exercises.length + 1;
	$scope.addExercise = function() {
		// set some defaults
		$scope.form_exercise.created = new Date();
		$scope.form_exercise.workouts[0].date = DatetimeService.formatDate(new Date());
		// give it an id
		$scope.form_exercise.workouts[0].id = storage.mkID($scope.form_exercise.workouts[0].date);
		// add to local storage
		ExercisesService.addExercise($scope.form_exercise);
		// lets clean this up since we are repeating ourselves
		$scope.form_exercise = {}; // not sure how I feel about this, kinda messy
		$scope.form_exercise.workouts = [{units: Units.currentUnits(), sets: [{}]}]; // init fix
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
		$scope.exercise.workouts.reverse(); // graph needs first dates to be first
		for (workout of $scope.exercise.workouts) {
			// first we need to set the label list name
			data.labels.push(workout.date);
			// dataset 0 is weight, 1 is reps
			// for both sets we will want an average for that workout
			var weight = 0;
			var reps = 0;
			for (set of workout.sets) {
				weight += parseInt(Units.printWeight(set.weight, workout.units));
				reps += parseInt(set.reps);
			}
			// get the averages
			weight = weight / workout.sets.length;
			reps = reps / workout.sets.length;
			// now we can append it to the dataset
			data.datasets[0].data.push(weight);
			data.datasets[1].data.push(reps);
		} // end workout iteration
		// remove when db is up
		// we want a responsive chart
		Chart.defaults.global.responsive = true;
		// get chart el
		var ctx = document.getElementById("linechart").getContext("2d");
		// print it
		var chart = new Chart(ctx).Line(data, {});
		console.log('chart data');
		console.log(data);
		$scope.exercise.workouts.reverse();
	}; // end buildGraph method
	
	$scope.sets = [{
		weight: null, 
		reps: null
	}];
	
	$scope.addSet = function() {
		$scope.sets.push({
			weight: null, 
			reps: null
		});
	};
	
	$scope.showEditSet = function(set_id) {
		$scope.edit_set.show();
		var current_set = $scope.workout.sets[set_id];
		$scope.sets = [current_set];
	} // end showEdit method
	
	$scope.saveSet = function(workout_id) {
		// update the current workout to include this set
		if (workout_id) {
			// it's an addset, push $scope.sets[0] to current workout scope
			for (workout of $scope.exercise.workouts) {
				if (workout.id == workout_id) {
					//workout.sets.push($scope.sets[0])
					for (set of $scope.sets) {
						workout.sets.push(set);	
					} // end append sets
				} 
			} // end find matching workout, this needs to be a findByID method
		}
		ExercisesService.updateExercise($scope.exercise);
		// clear scope set 
		$scope.sets = [{
			weight: null, 
			reps: null
		}];
	}; // end saveSet method
	
	$scope.form_workout = {};
	$scope.saveWorkout = function() {
		// let's give it an id
		$scope.form_workout.id = storage.mkID($scope.form_workout.date + $scope.form_workout.time);
		$scope.form_workout.sets = $scope.sets;
		// set the units 
		$scope.form_workout.units = Units.currentUnits();
		// get the exercise
		var ex = ExercisesService.getById($stateParams.exercise_id);
		//ex.workouts.push($scope.form_workout);
		//ex.date = $scope.form_workout.date + " " + $scope.form_workout.time;
		WorkoutService.addWorkout(ex, $scope.form_workout); 
	}; // end saveWorkout method
	
}) // end exercise controller

.controller('SettingsCtrl', function($scope, Units) {
	$scope.preferences = {};
	$scope.preferences.units = Units.currentUnits(); // init dropdown setting
	
	$scope.setUnits = function() {
		var units = $scope.preferences.units;
		storage.setKey('exercise_units', units)
	} 
	
}) // end settingsController

	

	
	
	
	