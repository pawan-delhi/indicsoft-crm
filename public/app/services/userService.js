(function() {
    'use strict';

    indicsoft_erp.factory('userService', Service);

    function Service($http, $q) {
        var service = {};

        service.userDetails = userDetails;
        service.addLead = addLead;
        service.updateLead = updateLead;
        service.getLeadDetails = getLeadDetails;
        service.getLeadProfile = getLeadProfile;
        service.getNote = getNote;
        service.newNote = newNote;
        service.logout = logout;

        return service;

        function userDetails(data) {
            return $http.get('api/userDetails').then(handleSuccess, handleError);
        }

        function addLead(data) {
            return $http.post('api/addLead', data).then(handleSuccess, handleError);
        }

        function updateLead(data) {
            return $http.post('api/updateLead', data).then(handleSuccess, handleError);
        }


        function getLeadDetails() {
            return $http.get('api/getLeadDetails').then(handleSuccess, handleError);
        }

        function getNote(data) {
            return $http.get('api/getNote?id=' + data).then(handleSuccess, handleError);
        }

        function getLeadProfile(data) {
            return $http.get('api/leadProfile?id=' + data).then(handleSuccess, handleError);
        }

        function newNote(data) {
            return $http.post('api/newNote', data).then(handleSuccess, handleError);
        }

        function logout(data) {
            return $http.delete('api/logout').then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();