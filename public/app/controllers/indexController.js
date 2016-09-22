indicsoft_erp.controller('loginController', function($scope, $http, loginService, $location, $timeout) {
    $scope.login = function(data) {
        $(".page-loading").removeClass("hidden");
        $scope.loginError = false;
        loginService.login(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                if (response.role == "Admin") {
                    $location.path('/admin-dashboard');
                } else {
                    $location.path('/user-dashboard');
                }
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                $scope.loginMessage = error.message;
                $scope.loginError = true;
                $timeout(function() {
                    $scope.loginError = false;
                }, 6000);
            });
    };
});

indicsoft_erp.controller('userAccountActivateController', function($scope, addData, loginService, $location, toasty) {
    $scope.addData = addData.data;
    $scope.userAccountCreation = function(data) {
        $(".page-loading").removeClass("hidden");
        $scope.loginError = false;
        loginService.userAccountCreation(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                if (response.role == "Admin") {
                    $location.path('/admin-dashboard');
                } else {
                    $location.path('/user-dashboard');
                }

            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                $scope.loginError = true;
            });
    };
});

indicsoft_erp.controller('resetPasswordController', function($scope, resetPassword, $location, toasty, loginService) {
    $scope.resetJson = resetPassword.data.result;
    $scope.resetJson.type = resetPassword.data.type;
    $scope.saveResetPassword = function(data) {
        $(".page-loading").removeClass("hidden");
        $scope.loginError = false;
        loginService.saveResetPassword(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                $location.path('/');
                toasty.success({
                    title: 'Successfully Reset!',
                    msg: 'Your password has been successfully reset'
                });
            })
            .catch(function(error) {
                $scope.loginError = true;
                $(".page-loading").addClass("hidden");
            });
    };
});