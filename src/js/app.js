
angular.module('app', [])
.controller('mainController', function($scope, $http, $sce) {
	var userLang = navigator.language || navigator.userLanguage; 
	
	$scope.setLang = function setLang(lang) {
		var userNormalizedLang = "en"
		isFr = (/fr-?/).test(lang)
		if (isFr) {
			userNormalizedLang = "fr"
		}
		console.log("change lang ! : ", userNormalizedLang)
		$scope.userNormalizedLang = userNormalizedLang
	}
	$scope.getData = function(){
		$http.get("assets/data.json")
		.then(function(response) {
			$scope.data = response.data;
			$scope.description = response.data.description.text;
			$scope.informations = response.data.info.text;
			$scope.contact = response.data.contact;
			$scope.tags = response.data.tags;
			formatProjet(response.data.projets);
		});
	}

	$scope.getData()
	$scope.setLang(userLang)

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
	}
})

.filter('to_trusted', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);