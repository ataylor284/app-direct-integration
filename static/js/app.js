angular.module('appDirect',['ui.router','ngResource','appDirect.controllers','appDirect.services']);
angular.module('appDirect').config(function($stateProvider,$httpProvider) {
    $stateProvider.state('users', {
        url: '/user',
        templateUrl: 'template/users.html',
        controller: 'UserListController'
    }).state('viewUser', {
       url: '/user/:id',
       templateUrl: 'template/user.html',
       controller: 'UserViewController'
    });
}).run(function($state) {
   $state.go('users');
}).filter('escape', function() {
    return function(input) {
        if(input) {
            return window.encodeURIComponent(input); 
        }
        return "";
    }
});
