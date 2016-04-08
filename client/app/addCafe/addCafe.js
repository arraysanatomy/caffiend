var app = angular.module('mainApp.addCafe', []);

app.controller('addCafeController', function($scope,
  $location, $window, addCafeFactory){
  $scope.cafe = {};

  $scope.getInput = function(){
    var url = window.location.hash;
    var arr = url.split('/');
    var cafeName = arr[arr.length - 1];
    $scope.cafe.name = decodeURIComponent(cafeName);
  };

  $scope.addCafe = function(){

    addCafeFactory.addCafe($scope.cafe)
      .then(function(data){
        // TODO require to test add cafe name here. waiting for server.
        $window.localStorage.setItem('servedCafeObject', JSON.stringify(data));
        $location.path('/results');
      });
  };

  $scope.getInput();
});

app.factory('addCafeFactory', function($http){

  var addCafe = function(newCafe){
    var data = {};
    data.cafe = newCafe;
    return $http({
      method: 'POST',
      url: 'home/api/cafe/add',
      data: data
    })
    .then(function successCallback(response){
      return response.data;
    }, function errorCallback(response){
      return response;
    });
  };

  return {
    addCafe: addCafe
  };
});
