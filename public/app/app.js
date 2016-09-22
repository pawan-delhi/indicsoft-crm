var indicsoft_erp = angular.module('indicsoft_erp', [
    'ui.router',
    'angular-toasty',
    'ui.bootstrap',
    'ngImgCrop',
    'ngCsv'
]);

indicsoft_erp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'loginController',
            resolve: {
                checkSession: function($q, $http) {
                    var deferred = $q.defer($http, $q);
                    $http({
                        method: 'get',
                        url: '/sessionCheck'
                    }).then(function successCallback(response) {
                        if (response.data.role == "Admin") {
                            deferred.reject({ session: true, role: 'Admin' });
                        } else {
                            deferred.reject({ session: true, role: 'User' });
                        }
                    }, function errorCallback() {
                        deferred.resolve();
                    });
                    return deferred.promise;
                }
            }
        })
        .state('adminDashboard', {
            url: '/admin-dashboard',
            abstract: true,
            templateUrl: 'partials/admin/dashboard_menu.html',
            controller: 'adminController',
            resolve: checkSessionAdmin
        })
        .state('adminDashboard.main', {
            url: '',
            templateUrl: 'partials/admin/dashboard.html',
            controller: 'adminController'
        })
        .state('adminDashboard.addUser', {
            url: '/add-user',
            templateUrl: 'partials/admin/add_user.html',
            controller: 'addUserController'
        })
        .state('adminDashboard.userList', {
            url: '/user-list',
            templateUrl: 'partials/admin/user_list.html',
            controller: 'userListController'
        })
        .state('adminDashboard.userProfile', {
            url: '/user-profile/:id',
            templateUrl: 'partials/admin/user_profile.html',
            resolve: {
                userProfile: function($http, $stateParams) {
                    return $http.get('api/userProfile?id=' + $stateParams.id).success(function(data) {});
                }
            },
            controller: 'userProfileController'
        })
        .state('adminDashboard.dropDownManager', {
            url: '/dropdown-manager',
            templateUrl: 'partials/admin/dropdown_manager.html',
            controller: 'dropdowncontroller'
        })
        .state('userDashboard', {
            url: '/user-dashboard',
            abstract: true,
            templateUrl: 'partials/user/dashboard_menu.html',
            controller: 'userController',
            resolve: checkSessionUser
        })
        .state('userDashboard.main', {
            url: '',
            templateUrl: 'partials/user/dashboard.html',
            controller: 'userController'
        })
        .state('userDashboard.leadsList', {
            url: '/lead-list',
            templateUrl: 'partials/user/lead_list.html',
            controller: 'leadListController'
        })
        .state('userDashboard.addLead', {
            url: '/add-user-lead',
            templateUrl: 'partials/user/add_lead.html',
            controller: 'userAddLeadController'
        })
        .state('userDashboard.leadProfile', {
            url: '/lead-profile/:id',
            templateUrl: 'partials/user/lead_profile.html',
            resolve: {
                leadProfile: function($http, $stateParams) {
                    return $http.get('api/leadProfile?id=' + $stateParams.id).success(function(data) {});
                }
            },
            controller: 'leadProfileController'
        })
        .state('userAccountActivate', {
            url: '/user-account-activate/:token',
            templateUrl: 'partials/complete_signup.html',
            resolve: {
                addData: function($http, $stateParams) {
                    return $http.get('userAccountActivate?token=' + $stateParams.token).success(function(data) {});
                }
            },
            controller: 'userAccountActivateController'
        })
        .state('userPasswordReset', {
            url: '/reset-password/:type/:token',
            templateUrl: 'partials/reset_password.html',
            resolve: {
                resetPassword: function($http, $stateParams) {
                    return $http.get('getResetPassword?token=' + $stateParams.token + '&type=' + $stateParams.type).success(function(data) {});
                }
            },
            controller: 'resetPasswordController'
        })
        .state('404', {
            url: '/page-not-found',
            templateUrl: 'partials/404error.html',
        })
    $urlRouterProvider.otherwise(function($injector, $location) {
        $injector.invoke(['$state', function($state) {
            $state.go('404');
        }]);
    });
});

indicsoft_erp.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        if (error.session === false) {
            $state.go('home');
        } else if (error.session === true && error.role == "Admin") {
            $state.go('adminDashboard.main');
        } else if (error.session === true && error.role == "User") {
            $state.go('userDashboard.main');
        }
        if (error.data !== undefined) {
            $state.go('home');
        }
    });

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            $(".page-loading").removeClass("hidden");
        });

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            $(".page-loading").addClass("hidden");
        });
}]);

var checkSessionAdmin = {
    checkSession: function($q, $http) {
        var deferred = $q.defer($http, $q);
        $http({
            method: 'get',
            url: '/sessionCheck'
        }).then(function successCallback(response) {
            if (response.data.role == "Admin") {
                deferred.resolve();
            } else {
                deferred.reject({ session: true, role: 'User' });
            }
        }, function errorCallback() {
            deferred.reject({ session: false });
        });
        return deferred.promise;
    }
}

var checkSessionUser = {
    checkSession: function($q, $http) {
        var deferred = $q.defer($http, $q);
        $http({
            method: 'get',
            url: '/sessionCheck'
        }).then(function successCallback(response) {
            if (response.data.role != "admin") {
                deferred.resolve();
            } else {
                deferred.reject({ session: true, role: 'Admin' });
            }
        }, function errorCallback() {
            deferred.reject({ session: false });
        });
        return deferred.promise;
    }
}