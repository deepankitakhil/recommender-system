/*
 Referenced from :
 https://github.com/braitsch/node-login
 https://github.com/braitsch/node-login
 https://github.com/scotch-io/easy-node-authentication
 https://scotch.io/tutorials/easy-node-authentication-setup-and-local
 http://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript
 https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication
 http://jsfiddle.net/asimshahiddIT/jrjjzw18/
https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
 */
var SOPostModel = require('../app/models/post');

module.exports = function (application_root, passport_auth) {

    application_root.get('/', function (request, response) {
        response.redirect('/post/1');
    });

    application_root.get('/login', function (request, response) {
        response.render('login.ejs', {message: request.flash('login-message')});
    });

    application_root.get('/post/:page', function (request, response, next) {
        var perPage = 10;
        var page = request.params.page || 1;

        SOPostModel
            .find({"type": "\"question"})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (error, stack_overflow_post) {
                SOPostModel
                    .find({"type": "\"question"})
                    .count()
                    .exec(function (error, count) {
                        if (error) return next(error);
                        response.render('post.ejs', {
                            posts: stack_overflow_post,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        })
                    })
            })
    });

    application_root.post('/login', passport_auth.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    application_root.get('/sign-up', function (request, response) {
        response.render('sign-up.ejs', {message: request.flash('sign-up-message')});
    });

    application_root.post('/sign-up', passport_auth.authenticate('local-sign-up', {
        successRedirect: '/profile',
        failureRedirect: '/sign-up',
        failureFlash: true
    }));

    application_root.get('/profile', isUserLoggedIn, function (request, response) {
        response.render('profile.ejs', {
            user: request.user,
        });
    });

    application_root.get('/logout', function (request, response) {
        request.logout();
        response.redirect('/');
    });
};

function isUserLoggedIn(request, response, next) {
    if (request.isAuthenticated())
        return next();
    else
        response.redirect('/');

}