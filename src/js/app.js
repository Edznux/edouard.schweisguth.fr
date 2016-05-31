
angular.module('app', [])
.controller('mainController', function($scope, $http, $sce) {

	$http.get("assets/data.json")
	.then(function(response) {
		$scope.data = response.data;
		$scope.description = $sce.trustAsHtml(response.data.description.text);
		$scope.informations = $sce.trustAsHtml(response.data.info.text);
		$scope.contact = response.data.contact;
		formatProjet(response.data.projets);
	});

	function formatProjet(projets){
		projetLeft = [];
		projetRight = [];

		for(var i = 0; i < projets.length; i++){

			if(i < projets.length / 2){
				projetLeft.push(projets[i]);
			}else{
				projetRight.push(projets[i]);
			}
		}
		$scope.projetRight = projetRight;
		$scope.projetLeft = projetLeft;
		console.log($scope)

	}
})
.filter('to_trusted', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);