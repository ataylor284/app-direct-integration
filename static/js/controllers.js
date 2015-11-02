angular.module('appDirect.controllers',[])

.controller('UserListController',function($scope,$state,popupService,$window,User) {
    $scope.users = User.query();

    $scope.deleteUser=function(user){
        if(popupService.showPopup('Are you sure?')){
            user.$delete(function() {
                $window.location.href='';
            });
        }
    }

})

.controller('UserViewController',function($scope,$stateParams,User) {
    $scope.user = User.get({id:$stateParams.id});
});
