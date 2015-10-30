angular.module('appDirect.services',[]).factory('User',function($resource) {
    return $resource('http:/user/:id', {id: '@_id'});
});
