'use strict';

function PendingReservationsListCtrl(GloriaAPI, $scope) {

	
	
	//GloriaAPI.setCredentials(document.getElementById("user").value,document.getElementById("password").value);
	$scope.$watch('password', function () {
		GloriaAPI.setCredentials($scope.user,$scope.password);
	    console.log($scope.password); 
	    $scope.pending = [];
		$scope.loading = true;
		buildUIPendingTable($scope, 'table', 'pagination');
		loadPendingReservations($scope, GloriaAPI);
	});
	//console.log($scope.user2);
	//console.log($scope.password);
	
	/*$scope.pending = [];
	$scope.loading = true;
	buildUIPendingTable($scope, 'table', 'pagination');
	loadPendingReservations($scope, GloriaAPI);*/
}