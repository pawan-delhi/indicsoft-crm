indicsoft_erp.controller('adminController', function($scope, $http, adminService, toasty, $location, $interval) {
    var urlPath = $location.path();

    $scope.clock = { time: "", interval: 1000 };

    function tickClock() {
        $scope.clock.time = Date.now();
    }

    $interval(tickClock, $scope.clock.interval);

    $scope.logout = function() {
        adminService.logout()
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
});

indicsoft_erp.controller('addUserController', function($scope, adminService, $state, toasty) {
    $scope.user = {
        userImage: imageData
    };

    $scope.addUser = function(data) {
        $(".page-loading").removeClass("hidden");
        adminService.addUser(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                toasty.success({
                    title: 'User added!',
                    msg: 'User has been added!'
                });
                $state.go('adminDashboard.userList');

            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Sorry! couldn\'t register',
                    msg: 'This email is already linked with other account'
                });

            });
    };

    $scope.resetAddCutomerForm = function(data) {
        $scope.user = {};
        $scope.user = {
            userImage: imageData
        };
    };

    $scope.handleFileButtonClick = function(id) {
        document.getElementById(id).click();
    };

    $scope.myImage = '';
    $scope.myCroppedImage = '';

    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
            $scope.$apply(function($scope) {
                document.getElementById('cropModel').style.display = 'block';
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

    $scope.imageCroped = function(image) {
        $scope.user.userImage = image;
        document.getElementById('cropModel').style.display = 'none';
    };

    $scope.getRole = function(data) {
        if (data == "Executive") {
            $(".page-loading").removeClass("hidden");
            adminService.getManager()
                .then(function(response) {
                    $scope.managerList = response.result;
                    console.log()
                    $(".page-loading").addClass("hidden");
                })
                .catch(function(error) {
                    toasty.error({
                        title: 'Some error occured',
                        msg: 'Some error occured'
                    });
                    $(".page-loading").addClass("hidden");
                });
        } else if (data == "Manager") {
            $(".page-loading").removeClass("hidden");
            adminService.getDepartmentList()
                .then(function(response) {
                    $scope.departmentList = response.result;
                    $(".page-loading").addClass("hidden");
                })
                .catch(function(error) {
                    toasty.error({
                        title: 'Some error occured',
                        msg: 'Some error occured'
                    });
                    $(".page-loading").addClass("hidden");
                });
        }

    };

    $scope.getManagerDepartment = function(id) {
        $(".page-loading").removeClass("hidden");
        adminService.getManagerDepartment(id)
            .then(function(response) {
                $scope.departmentList = response.result;
                $(".page-loading").addClass("hidden");
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };
});

indicsoft_erp.controller('userProfileController', function($scope, userProfile, adminService, $state, toasty) {
    $scope.userProfileData = userProfile.data.result;

    $scope.updateUser = function(data) {
        $(".page-loading").removeClass("hidden");
        adminService.updateUser(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                toasty.success({
                    title: 'User updated!',
                    msg: 'User has been updated!'
                });
                $state.go('adminDashboard.userList');

            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Server error',
                    msg: 'Some error occured'
                });

            });
    };

    $scope.handleFileButtonClick = function(id) {
        document.getElementById(id).click();
    };

    $scope.myImage = '';
    $scope.myCroppedImage = '';

    var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
            $scope.$apply(function($scope) {
                document.getElementById('cropModel').style.display = 'block';
                $scope.myImage = evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

    $scope.imageCroped = function(image) {
        $scope.userProfileData.profileImage = image;
        document.getElementById('cropModel').style.display = 'none';
    };

    $scope.getRole = function(data) {
        if (data == "Executive") {
            $(".page-loading").removeClass("hidden");
            adminService.getManager()
                .then(function(response) {
                    $scope.managerList = response.result;
                    $(".page-loading").addClass("hidden");
                })
                .catch(function(error) {
                    toasty.error({
                        title: 'Some error occured',
                        msg: 'Some error occured'
                    });
                    $(".page-loading").addClass("hidden");
                });
        }
    };

    adminService.getDepartmentList()
        .then(function(response) {
            $scope.departmentList = response.result;
        })
        .catch(function(error) {
            toasty.error({
                title: 'Some error occured',
                msg: 'Some error occured'
            });
        });

    $scope.getManagerDepartment = function(id) {
        $(".page-loading").removeClass("hidden");
        adminService.getManagerDepartment(id)
            .then(function(response) {
                $scope.departmentList = response.result;
                $(".page-loading").addClass("hidden");
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };
});

indicsoft_erp.controller('dropdowncontroller', function($scope, adminService, $state, toasty) {
    var dropdownFunction = function() {
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
    };

    dropdownFunction();

    $scope.addDropdown = function(data) {
        $(".page-loading").removeClass("hidden");
        adminService.addDropdown(data)
            .then(function(response) {
                $(".page-loading").addClass("hidden");
                dropdownFunction();
            })
            .catch(function(error) {
                $(".page-loading").addClass("hidden");
                toasty.error({
                    title: 'Some error occured',
                    msg: 'Some error occured'
                });
            });
    };
    $scope.deleteDropdown = function(id) {
        $(".page-loading").removeClass("hidden");
        var deleteData = $.param({
            id: id
        });
        adminService.deleteDropdown(deleteData)
            .then(function(response) {
                dropdownFunction();
                $(".page-loading").addClass("hidden");
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };
});

indicsoft_erp.controller('userListController', function($scope, adminService, $state, toasty, $http) {
    $scope.viewby = 2;
    $scope.currentPage = 1;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 10;
    var paginateView = function() {
        $(".page-loading").removeClass("hidden");
        adminService.userList($scope.currentPage)
            .then(function(response) {
                $scope.userList = response.result;
                $scope.totalItems = response.total;

                $scope.viewby = 9;
                $scope.itemsPerPage = $scope.viewby;
                $(".page-loading").addClass("hidden");
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };
    if ($scope.currentPage == 1) {
        paginateView();
    }
    $scope.pageChanged = function() {
        paginateView();
    };
    $scope.deleteUser = function(id) {
        $(".page-loading").removeClass("hidden");
        var deleteData = $.param({
            id: id
        });
        adminService.deleteUser(deleteData)
            .then(function(response) {
                paginateView();
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };

    $scope.blockUser = function(id) {
        $(".page-loading").removeClass("hidden");
        var blockData = {
            id: id
        };
        adminService.blockUser(blockData)
            .then(function(response) {
                paginateView();
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
            });
    };
    $scope.unblockUser = function(id) {
        $(".page-loading").removeClass("hidden");
        var unblockData = {
            id: id
        };
        adminService.unblockUser(unblockData)
            .then(function(response) {
                paginateView();
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };

    $scope.searchUser = function(data) {
        $(".page-loading").removeClass("hidden");
        adminService.searchUser(data)
            .then(function(response) {
                $scope.userList = response.result;
                $(".page-loading").addClass("hidden");
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
                $(".page-loading").addClass("hidden");
            });
    };

    $scope.resetPassword = function(email, type) {
        adminService.resetPassword(email, type)
            .then(function(response) {
                toasty.success({
                    title: 'Requested accepted',
                    msg: 'Password reset link has sent to user\'s email'
                });
            })
            .catch(function(error) {
                toasty.error({
                    title: 'Sorry! Error occured',
                    msg: 'Some error occured'
                });
            });
    };
});