(function() {
    'use strict';

    indicsoft_erp.factory('adminService', Service);

    function Service($http, $q) {
        var service = {};

        service.addUser = addUser;
        service.updateUser = updateUser;
        service.userList = userList;
        service.userDetails = userDetails;
        service.searchUser = searchUser;
        service.deleteUser = deleteUser;
        service.addDropdown = addDropdown;
        service.deleteDropdown = deleteDropdown;
        service.blockUser = blockUser;
        service.unblockUser = unblockUser;
        service.getManager = getManager;
        service.getManagerDepartment = getManagerDepartment;
        service.getDepartmentList = getDepartmentList;
        service.getDropdownList = getDropdownList;
        service.resetPassword = resetPassword;
        service.logout = logout;

        return service;

        function addUser(data) {
            return $http.post('api/addUser', data).then(handleSuccess, handleError);
        }

        function updateUser(data) {
            return $http.post('api/updateUser', data).then(handleSuccess, handleError);
        }

        function userList(data) {
            return $http.get('api/userList?page=' + data).then(handleSuccess, handleError);
        }

        function userDetails(data) {
            return $http.get('api/userDetails?id=' + data).then(handleSuccess, handleError);
        }

        function searchUser(data) {
            return $http.get('api/searchUser?search=' + data).then(handleSuccess, handleError);
        }

        function deleteUser(data) {
            return $http.delete('api/deleteUser?' + data).then(handleSuccess, handleError);
        }

        function addDropdown(data) {
            return $http.put('api/addDropdown', data).then(handleSuccess, handleError);
        }

        function deleteDropdown(data) {
            return $http.delete('api/deleteDropdown?' + data).then(handleSuccess, handleError);
        }

        function blockUser(data) {
            return $http.put('api/blockUser', data).then(handleSuccess, handleError);
        }

        function unblockUser(data) {
            return $http.put('api/unblockUser', data).then(handleSuccess, handleError);
        }

        function getManager(data) {
            return $http.get('api/getManager').then(handleSuccess, handleError);
        }

        function getManagerDepartment(data) {
            return $http.get('api/getManagerDepartment?id=' + data).then(handleSuccess, handleError);
        }

        function getDepartmentList() {
            return $http.get('api/getDepartmentList').then(handleSuccess, handleError);
        }

        function getDropdownList() {
            return $http.get('api/getDropdownList').then(handleSuccess, handleError);
        }

        function resetPassword(email, type) {
            return $http.get('api/resetPassword?email=' + email + '&type=' + type).then(handleSuccess, handleError);
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