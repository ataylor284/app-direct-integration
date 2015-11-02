angular.module('appDirect.services',[])

.factory('User',function($resource) {
    return $resource('http:/user/:id', {id: '@_id'});
})

.service('popupService',function($window) {
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});
