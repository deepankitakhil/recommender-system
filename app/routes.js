/*
 Referenced from :
 https://github.com/braitsch/node-login
 https://github.com/braitsch/node-login
 https://github.com/scotch-io/easy-node-authentication
 https://scotch.io/tutorials/easy-node-authentication-setup-and-local
 http://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript
 https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication
 http://jsfiddle.net/asimshahiddIT/jrjjzw18/
 https://github.com/ivanvaladares/Node-Suggestive-Search
https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
 */
var SOPostModel = require('../app/models/post');
var nodeSuggestiveSearch = nss = require('../search/search.js').init(undefined);
const fs = require('fs');
var searchElements = [];
var tags = [];
var tagsInJSONFormat = [];
var searchResults = [];
module.exports = function (application_root, passport_auth) {

    application_root.get('/', function (request, response) {

        var rawdata = fs.readFileSync('../Recommender-System/search/post_title.json');
        searchElements = JSON.parse(rawdata);
        response.redirect('/post/1');
    });

    application_root.get('/login', function (request, response) {
        response.render('login.ejs', {message: request.flash('login-message')});
    });

    application_root.get('/tag_search', function (request, response) {
        if (tags === undefined || tags.length === 0) {
            var rawData = fs.readFileSync('../Recommender-System/search/tag_search/tags.json');
            tagsInJSONFormat = JSON.parse(rawData);
            for (var index = 0; index < tagsInJSONFormat.length; index++) {
                tags.push(tagsInJSONFormat[index].tag);
            }
        }
        response.render('sign-up.ejs', {
            available_tags: JSON.stringify(tags),
            message: request.flash('sign-up-message')
        });
    });

    application_root.get('/search/:keyword', function (request, response, next) {
        var keyword = request.params.keyword || 'java';
        var item_length;
        var searched_post = [];
        nodeSuggestiveSearch.loadJson('../Recommender-System/search/post_title.json')
            .then(() => {
                nodeSuggestiveSearch.query(keyword).then((data) => {
                        var items = data.itemsId;
                        item_length = items.length;
                        for (var index = 0; index < item_length; index++) {
                            if (searchElements[items[index]] !== undefined) {
                                let queryText = buildQueryText(searchElements[items[index]].itemName);
                                searched_post.push(queryText);
                            }
                        }

                        SOPostModel
                            .find({
                                $and: [
                                    {"title": {$in: searched_post}},
                                    {"type": "\"question"}
                                ]
                            })
                            .exec(function (error, stack_overflow_post) {
                                if (error)
                                    response.render('error.ejs', {
                                        posts: [],
                                    });
                                searchResults = stack_overflow_post;
                                response.redirect('search_results/1');
                            })
                    },
                    error => {
                        response.render('error.ejs', {
                            posts: [],
                        });
                    }
                )
            });
    });

    application_root.get('/personalized_search/:keyword', isUserLoggedIn, function (request, response, next) {
        var keyword = request.params.keyword || 'java';
        var item_length;
        var searched_post = [];
        nodeSuggestiveSearch.loadJson('../Recommender-System/search/post_title.json')
            .then(() => {
                nodeSuggestiveSearch.query(keyword).then((data) => {
                        var items = data.itemsId;
                        item_length = items.length;
                        for (var index = 0; index < item_length; index++) {
                            if (searchElements[items[index]] !== undefined) {
                                let queryText = buildQueryText(searchElements[items[index]].itemName);
                                searched_post.push(queryText);
                            }
                        }

                        SOPostModel
                            .find({
                                $and: [
                                    {"title": {$in: searched_post}},
                                    {"type": "\"question"}
                                ]
                            })
                            .exec(function (error, stack_overflow_post) {
                                if (error)
                                    response.render('error.ejs', {
                                        posts: [],
                                    });
                                searchResults = stack_overflow_post;
                                response.redirect('personalized_search_results/1');
                            })
                    },
                    error => {
                        response.render('error.ejs', {
                            posts: [],
                        });
                    }
                )
            });
    });

    application_root.get('/personalized_search_results/:page', isUserLoggedIn, function (request, response) {
        var page = parseInt(request.params.page || 1);
        var perPage = 10;
        var currentPageContent = paginate(searchResults, page, perPage);
        response.render('personalized_search_results.ejs', {
            posts: currentPageContent.pageData,
            current: currentPageContent.nextPage - 1,
            pages: currentPageContent.totalCount
        })
    });

    application_root.get('/search_results/:page', function (request, response) {
        var page = parseInt(request.params.page || 1);
        var perPage = 10;
        var currentPageContent = paginate(searchResults, page, perPage);
        response.render('search_results.ejs', {
            posts: currentPageContent.pageData,
            current: currentPageContent.nextPage - 1,
            pages: currentPageContent.totalCount
        })
    });

    application_root.get('/personalized_post/:page', isUserLoggedIn, function (request, response, next) {
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
                        if (error)
                            response.render('error.ejs', {
                                posts: [],
                            });
                        response.render('personalized_post.ejs', {
                            posts: stack_overflow_post,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        })
                    })
            })
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
                        if (error)
                            response.render('error.ejs', {
                                posts: [],
                            });
                        response.render('post.ejs', {
                            posts: stack_overflow_post,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        })
                    })
            })
    });


    application_root.get('/fetch_personalized_post/:title', isUserLoggedIn, function (request, response, next) {
        var title = request.params.title;
        if (title === undefined)
            response.render('answers.ejs', {
                posts: [],
            });
        else
            title = buildRegex(title);

        SOPostModel
            .find({"title": {'$regex': title}})
            .exec(function (error, stack_overflow_post) {
                if (error)
                    response.render('error.ejs', {
                        posts: [],
                    });
                if (stack_overflow_post !== undefined && stack_overflow_post.length > 0) {
                    response.render('personalized_answers.ejs', {
                        posts: stack_overflow_post,
                    })
                }
                else {
                    response.render('error.ejs', {
                        posts: stack_overflow_post,
                    })
                }

            });
    });


    application_root.get('/fetch_post/:title', function (request, response, next) {
        var title = request.params.title;
        if (title === undefined)
            response.render('answers.ejs', {
                posts: [],
            });
        else
            title = buildRegex(title);

        SOPostModel
            .find({"title": {'$regex': title}})
            .exec(function (error, stack_overflow_post) {
                if (error)
                    response.render('error.ejs', {
                        posts: [],
                    });
                if (stack_overflow_post !== undefined && stack_overflow_post.length > 0) {
                    response.render('answers.ejs', {
                        posts: stack_overflow_post,
                    })
                }
                else {
                    response.render('error.ejs', {
                        posts: stack_overflow_post,
                    })
                }

            });
    });

    application_root.post('/login', passport_auth.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    application_root.get('/sign-up', function (request, response) {
        response.redirect('/tag_search');
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

function buildQueryText(input) {
    var slash = "\\";
    var double_quotes = "\"";
    input = slash + double_quotes + stripEndQuotes(input) + slash + double_quotes;
    return input;
}

function buildRegex(input) {
    input = input.replace(/^\s+|\s+$/g, "");
    var wild_card = ".*";
    input = escapeHtml(input);
    input = wild_card + stripEndQuotes(input) + wild_card;
    return input;
}

function escapeHtml(input) {
    var map = {

        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '.': '',
        "_": '/'
    };

    return input.replace(/[<>"'_]/g, function (key) {
        return map[key];
    });
}

function stripEndQuotes(input) {
    var input_length = input.length;
    if (input.charAt(0) === '"') input = input.substring(1, input_length--);
    if (input.charAt(--input_length) === '"') input = input.substring(0, input_length);
    return input;
}

function paginate(searchList, page, perPage) {
    var totalCount = searchList.length;
    var lastPage = Math.floor(totalCount / perPage);
    var sliceBegin = page * perPage;
    var sliceEnd = sliceBegin + perPage;
    var pageList = searchList.slice(sliceBegin, sliceEnd);
    return {
        pageData: pageList,
        nextPage: page < lastPage ? page + 1 : null,
        totalCount: lastPage
    }
}