angular.module('home', ['ngDragDrop'])
.controller('homeController', ['$scope', '$http', '$q', function($scope, $http, $q){
	
	$scope.init = function(){
		
		$http.get('/game')
		.then(function(response){
			
			$scope.game = response.data;
			
			if(!($scope.game || {}).complete && $scope.game!=null)
				toastr.success("Welcome!", "Resume from where you left the game");
			else{
				toastr.info("There is no previously incomplete game");
				toastr.info("Creating new game")
				$scope.createNewGame()
			}
			
			}, function(response){
			
				toastr.error("Something went wrong");
		})
	}
	
	$scope.createNewGame = function(){
		
		$http.post('/game')
		.then(function(response){
			
			toastr.success("New game created")
			$scope.init()
			
		}, function(response){
				console.error(response);
				toastr.error("Something went wrong");
		})
		
	}
	
	$scope.save = function(){
		$http.put('/game', $scope.game)
		.then(function(response){
			console.log("Saved");
		}, function(response){
			console.error('Error', response.data)
		})
	}
		
	$scope.check = function(){		
		if(!($scope.game || {}).houses)	return;
		Object.keys(($scope.game).houses).forEach(function(key){
			
			$scope.game.houses[key].forEach(function(card, index){
				$scope.remove(card);
				if(card.house!=key){
					$scope.game.houses[key].splice(index, 1);
					
				}
			})
			
		})		
		
	}
	
	$scope.startCallback = function(event, ui, card){
		$scope.selected = card;
	}
	
	$scope.beforeDrop = function(event, ui, value) {
        
		var deferred = $q.defer();
		
          if ($scope.selected.house == value) {
                  deferred.resolve();
			  $scope.remove($scope.selected)
			  setTimeout(function(){
			  	$scope.save()
			  }, 100)

			  if($scope.game.cards.length==0)
				  $scope.completeGame();
          } else{
			  toastr.error("Wrong suite")
           	deferred.reject();
		  }

          return deferred.promise;
	};
	
	$scope.remove = function(data){
		console.log("removing")
		$scope.game.cards.forEach((e, index)=>{
			if(e.house === data.house && e.number === data.number)
				$scope.game.cards.splice(index, 1)
		})
	}
	
	$scope.completeGame = function(){
		$scope.game.complete = true;
		$scope.save();
		$scope.restart = true;
	}
	
	$scope.init()
	
}]);