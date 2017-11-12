var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../app/models/user_login');

module.exports = function (passport) {
    passport.serializeUser(function (user, on_result) {
        on_result(null, user.id);
    });

    passport.deserializeUser(function (user_id, on_result) {
        UserModel.findById(user_id, function (error_message, user_id) {
            on_result(error_message, user_id);
        });
    });

    passport.use('local-sign-up', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (request, username, password, on_result) {
            UserModel.findOne({'local.username': username}, function (error, user_id) {
                if (error)
                    return on_result(error);
                if (user_id) {
                    return on_result(null, false, request.flash('sign-up-message',
                        'This username is already taken.Please register with another username'));
                } else {
                    var newUser = new UserModel();
                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function (error) {
                        if (error)
                            throw error;
                        return on_result(null, newUser);
                    });
                }

            });

        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (request, username, password, on_result) {

            UserModel.findOne({'local.username': username}, function (error, user_id) {
                if (error)
                    return on_result(error);
                if (!user_id)
                    return on_result(null, false, request.flash('login-message', 'No user found.'));
                if (!user_id.validatePassword(password))
                    return on_result(null, false, request.flash('login-message', 'Wrong password entered.'));
                console.log("found user");
                console.log(username);
                return on_result(null, user_id);
            });
        }));
};