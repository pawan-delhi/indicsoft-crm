var path = require('path');
module.exports = function(app, router) {

    var adminController = require('./controllers/admin');
    var userController = require('./controllers/users');
    var commonController = require('./controllers/common');

    app.post('/login', commonController.login, commonController.updateLoginTime);
    app.get('/sessionCheck', commonController.sessionCheck);
    app.get('/userAccountActivate', commonController.userAccountActivate);
    app.post('/userAccountCreation', commonController.userAccountCreation, commonController.login);
    app.get('/getResetPassword', commonController.getResetPassword);
    app.put('/saveResetPassword', commonController.saveResetPassword);

    router.use(function(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.status(403).send('Error 403 Access Denied/Forbidden');
        }
    });
    router.post('/addUser', adminController.checkUser, adminController.addUser);
    router.post('/updateUser', adminController.updateUser);
    router.put('/addDropdown', adminController.addDropdown);
    router.get('/userList', adminController.userList);
    router.get('/userProfile', adminController.userProfile);
    router.get('/getManager', adminController.getManager);
    router.get('/getDepartmentList', adminController.getDepartmentList);
    router.get('/getDropdownList', adminController.getDropdownList);
    router.get('/getManagerDepartment', adminController.getManagerDepartment);
    router.get('/searchUser', adminController.searchUser);
    router.get('/resetPassword', adminController.resetPassword);
    router.put('/blockUser', adminController.blockUser);
    router.put('/unblockUser', adminController.unblockUser);
    router.delete('/deleteUser', adminController.deleteUser);
    router.delete('/deleteDropdown', adminController.deleteDropdown);

    router.get('/userDetails', userController.userDetails);
    router.post('/addLead', userController.addLead);
    router.get('/getLeadDetails', userController.getLeadDetails);
    router.get('/leadProfile', userController.leadProfile);
    router.get('/getNote', userController.getNote);
    router.post('/newNote', userController.newNote);

    router.delete('/logout', commonController.logout);
    app.use('/api', router);

    app.route('/*').get(function(req, res) {
        res.sendFile(path.resolve('public' + '/index.html'));
    });
};