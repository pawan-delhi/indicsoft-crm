indicsoft_erp.controller('userController', function($scope, $http, Socket, userService, toasty, $location, $interval) {
    Socket.connect();
    $scope.$on('$statesChangeStart', function(event) {
        Socket.disconnect(true);
    });

    Socket.emit('user-entered', {});

    userService.userDetails()
        .then(function(response) {
            $scope.userData = response.result;
            $scope.lead = {
                assignName: response.result.firstName + ' ' + response.result.lastName,
                assignId: response.result._id
            };
        })
        .catch(function(error) {
            toasty.error({
                title: 'Sorry! Error occured',
                msg: 'Some error occured'
            });
        });

    $scope.clock = { time: "", interval: 1000 };

    $interval(function() {
            $scope.clock.time = Date.now();
        },
        $scope.clock.interval);

    $scope.logout = function() {
        userService.logout()
            .then(function(response) {
                $location.path('/');
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
            });
    };

    $scope.labels = ['sdfsdf', 'skldfjksldfjdkl', 'lasdjfkdlsj', 'sadfdf', 'sadfsdfsdfd', 'sdfsdfsdfds', 'sdfsdf', 'sdfsdfdfs', 'wefsdfsdf', 'dsfsdfd', 'werwer'];
    $scope.data = [
        [3, 4, 8, 2, 1, 10, 5, 13, 6, 15, 12]
    ];
});

indicsoft_erp.controller('leadListController', function($scope, $http, userService, adminService, toasty, $location, $interval) {
    $scope.viewby = 2;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 10;
    var getLeadDetails = function() {
        userService.getLeadDetails()
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                $scope.leadList = response.result;
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };
    getLeadDetails();
});

indicsoft_erp.controller('userAddLeadController', function($scope, $http, userService, adminService, toasty, $state, $location, $interval) {
    $(".page-loading").removeClass("hidden");
    adminService.getDropdownList()
        .then(function(response) {
            $(".page-loading").addClass("hidden");
            $scope.dropdownList = response.result;
        })
        .catch(function(error) {
            $(".page-loading").addClass("hidden");
            toasty.error({
                title: 'Some error occured',
                msg: 'Some error occured'
            });
        });

    $scope.addLead = function(data) {
        userService.addLead(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                $state.go('userDashboard.leadsList');
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };
});

indicsoft_erp.controller('leadProfileController', function($scope, $http, Socket, leadProfile, userService, adminService, toasty, $state, $location, $interval) {
    $(".page-loading").removeClass("hidden");
    adminService.getDropdownList()
        .then(function(response) {
            $(".page-loading").addClass("hidden");
            $scope.dropdownList = response.result;
        })
        .catch(function(error) {
            $(".page-loading").addClass("hidden");
            toasty.error({
                title: 'Some error occured',
                msg: 'Some error occured'
            });
        });
    $scope.leadData = leadProfile.data.result;
    var getNoteFunction = function() {
        userService.getNote($scope.leadData._id)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                $scope.noteList = response.result;
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };

    getNoteFunction();

    var getLeadProfile = function() {
        userService.getLeadProfile($scope.leadData._id)
            .then(function(response) {
                $scope.leadData = response.result;
                $(".page-loading").addClass("hidden");
                toasty.success({
                    title: 'User updateLead',
                    msg: 'User has been updated'
                });
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };

    $scope.newNote = function(noteData, leadId) {
        var leadData = {
            addingNote: noteData,
            leadId: leadId
        };
        $(".page-loading").removeClass("hidden");
        userService.newNote(leadData)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                $scope.addNote = false;
                $scope.noteData = null;
                getNoteFunction();
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };

    $scope.updateLead = function(data) {
        userService.updateLead(data)
            .then(function(response) {
                getLeadProfile();
                getNoteFunction();
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };

});