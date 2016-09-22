(function() {
    'use strict';

    indicsoft_erp.factory('loginService', Service);

    function Service($http, $q) {
        var service = {};

        service.login = login;
        service.userAccountCreation = userAccountCreation;
        service.saveResetPassword = saveResetPassword;

        return service;

        function login(data) {
            return $http.post('/login', data).then(handleSuccess, handleError);
        }

        function userAccountCreation(data) {
            return $http.post('/userAccountCreation', data).then(handleSuccess, handleError);
        }

        function saveResetPassword(data) {
            return $http.put('/saveResetPassword', data).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();