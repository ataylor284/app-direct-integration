angular.module('appDirect.controllers',[])

.controller('UserListController',function($scope,$state,$window,User) {
    $scope.users = User.query();
})

.controller('UserViewController',function($scope,$stateParams,User) {
    $scope.user = User.get({id:$stateParams.id});
});
