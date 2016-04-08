var app = angular.module('mainApp.results',['ui.bootstrap','datatables']);

//data table configuration
app.controller('WithOptionsCtrl', function(DTOptionsBuilder, DTColumnDefBuilder){
  var vm = this;
  vm.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('tr');
 })

app.controller('resultsController',function($scope, $uibModal){

  var cafe = localStorage.getItem('servedCafeObject');
  cafe = JSON.parse(cafe);

  $scope.cafeName = cafe.name;
  $scope.address = cafe.address;
  $scope.phone = cafe.phone;
  $scope.menu = cafe.menu;

  $scope.animationsEnabled = true;
  $scope.open = function(){
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'modalContent.html',
      controller: 'modalController'
    });

    modalInstance.result.then(function(newMenu){
      $scope.menu = newMenu;
    });
  };

  $scope.toggleAnimation = function() {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };
});

app.controller('modalController',function($scope, $uibModalInstance, addDrinkFactory){

  $scope.errorMessage = '';

  $scope.add = function(){
    addDrinkFactory.addDrink($scope.beverage, $scope.rating)
    .then(function(data){
      if(data){
        $uibModalInstance.close(data.menu);
      }
      else{
        $scope.errorMessage = 'Server error. Check back later!'
      }
    });
  };
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }
});

app.factory('addDrinkFactory',function($http, $location) {

  var getCafeName = function(){
    var cafe = localStorage.getItem('servedCafeObject');
    cafe = JSON.parse(cafe);
    return cafe.name;
  };

  var addDrink = function(beverage, rating){
    var newData = {};

    newData.menu = [];
    newData.menu.push({
      item: beverage,
      rating: rating
    });
    newData.cafe = {name: getCafeName()};

    return $http({
      method: 'POST',
      url: 'home/api/menu/add',
      data: newData
    })
    .then(function successCallback(response) {
      return response.data;
    }, function errorCallback(response){
      reject(response);
    });
  };
  return {
    addDrink: addDrink
  };
});
