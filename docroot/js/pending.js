'use strict';

function loadPendingReservations(scope, api) {

	scope.pending = [];
	scope.loading = true;

	api.getPendingReservations(function(data) {
		var reservations = [];
		data.forEach(function(element) {
			reservations.push({
				experiment : element.experiment,
				reservationId : element.reservationId,
				begin : element.timeSlot.begin,
				end : element.timeSlot.end,
				telescopes : element.telescopes
			});
		});
	
		scope.pending = reservations;
		
		console.log(reservations);
		
		scope.npages = Math.ceil(reservations.length / 10);
		scope.pagesArray = new Array(scope.npages);

		if (scope.table != undefined) {
			scope.table.set('recordset', scope.pending.slice(0, 10));
			scope.pagination.set('total', scope.npages);
			scope.table.render();
			scope.pagination.render();
		}
		
		scope.loading = false;
		
	}, function(data) {
		console.log('error', data, status);
		scope.loading = false;
		(data);

	});
}

function buildUIPendingTable(scope, elementName, paginationName) {
	YUI()
			.use(
					'aui-datatable',
					'aui-pagination',
					function(Y) {

						scope.table = new Y.DataTable({
							boundingBox : '#' + elementName,
							columns : [ {
								key : 'reservationId',
								sortable : true,
								label : '#'
							}, {
								key : 'experiment',
								label : 'Experiment'
							}, {
								key : 'begin',
								label : 'Begin',
								sortable : 'true',
								formatter : function(o) {
									return new Date(o.value).toUTCString();
								}

							}, {
								key : 'end',
								label : 'End',
								sortable : 'true',
								formatter : function(o) {
									o.rowClass = 'rowBack';
									o.value = new Date(o.value).toUTCString();
								}

							}, {
								key : 'telescopes',
								label : 'Telescopes'
							} ],
							recordset : scope.pending.slice(0, 10)
						});						
						
						scope.pagination = new Y.Pagination(
								{
									contentBox : '#' + paginationName
											+ ' .aui-pagination-content',
									page : 1,
									total : scope.npages,
									on : {
										changeRequest : function(event) {

											if (event.state.page <= scope.npages) {

												var fromIndex = ((event.state.page - 1) * 10);
												var toIndex = ((event.state.page - 1) * 10) + 10;

												scope.table.set('recordset',
														scope.pending.slice(
																fromIndex,
																toIndex));
											}
										}
									}
								});
																		
					});
}

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
