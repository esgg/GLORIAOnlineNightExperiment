'use strict';

/* App Module */
var gloria_test = angular.module('gloria_test', []);

gloria_test.factory('GloriaAPI', function() {
	var api = new GloriaApiHandler();
	return api;
});

function GloriaApiHandler() {
	
	/* User authentication */
	this.setCredentials = function(username, password) {
		console.log("User:"+username);
		console.log("Password:"+password);
	};

	this.clearCredentials = function() {
	};

	this.authenticate = function(success, error) {

	};

	/* Experiment reservations management */
	this.getPendingReservations = function(success, error) {

	};
	
	this.getActiveReservations = function(success, error) {

	
	};
	
	this.getAvailableReservations = function(experiment, telescopes, date,
			success, error) {
	
	};

	this.makeReservation = function(experiment, telescopes, begin, end,
			success, error) {
	
	};

	this.applyForOffline = function(experiment, success, error) {
	};

	/* Experiment context management */
	this.getParameterValue = function(cid, name, success, error) {
		if (name.equals("fw")){
			
		}
	};
	
	this.getParameterTreeValue = function(cid, name, tree, success, error) {
	};

	this.setParameterValue = function(cid, name, value, success, error) {
	};
	
	this.setParameterTreeValue = function(cid, name, tree, value, success, error) {
	};
	
	this.executeOperation = function(cid, name, success, error) {
	};
}

