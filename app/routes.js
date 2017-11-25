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
 https://stackoverflow.com/questions/42258116/dividing-a-page-into-two-vertical-and-indetical-sections-with-border
https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
 */
var SOPostModel = require('../app/models/post');
var UserProfileModel = require('../app/models/user_profile');
var nodeSuggestiveSearch = nss = require('../search/search.js').init(undefined);
const fs = require('fs');
var searchElements = [];
var tags = [];
var tagsInJSONFormat = [];
var searchResults = [];
var content_based_recommendation_posts = [];
var collaborative_based_recommendation_posts = [];
var osum_data = {};

function update_temporary_user_tags(request, searched_keyword) {
    UserProfileModel
        .find(
            {
                $and: [
                    {"local.username": request.user.local.username},
                    {"local.temporary_user_tags": {$elemMatch: {tags: searched_keyword}}},
                ]
            }
        )
        .exec(function (error, user_info) {
            if (error)
                throw error;
            else {
                var tags_clicked = [];
                var new_entry = {};
                if (user_info.length !== 0) {
                    tags_clicked = user_info[0].local.temporary_user_tags;
                    for (var index = 0; index < tags_clicked.length; index++) {
                        if (tags_clicked[index].tags === searched_keyword) {
                            new_entry = {tags: searched_keyword, count: tags_clicked[index].count + 1};
                            UserProfileModel
                                .update({"local.username": request.user.local.username},
                                    {
                                        "$pull": {"local.temporary_user_tags": {tags: searched_keyword}},
                                    })
                                .exec(function (error) {
                                    if (error)
                                        throw error;
                                });
                            break;
                        }
                    }
                } else
                    new_entry = {tags: searched_keyword, count: 1};

                UserProfileModel
                    .update({"local.username": request.user.local.username},
                        {
                            "$push": {"local.temporary_user_tags": new_entry},
                        })
                    .exec(function (error) {
                        if (error)
                            throw error;
                    });
            }
        });
}

function update_search_tags(request, searched_keyword) {
    UserProfileModel
        .find(
            {
                $and: [
                    {"local.username": request.user.local.username},
                    {"local.search": {$elemMatch: {tags: searched_keyword}}},
                ]
            }
        )
        .exec(function (error, user_info) {
            if (error)
                throw error;
            else {
                var tags_clicked = [];
                var new_entry = {};
                if (user_info.length !== 0) {
                    tags_clicked = user_info[0].local.search;
                    for (var index = 0; index < tags_clicked.length; index++) {
                        if (tags_clicked[index].tags === searched_keyword) {
                            new_entry = {tags: searched_keyword, count: tags_clicked[index].count + 1};
                            UserProfileModel
                                .update({"local.username": request.user.local.username},
                                    {
                                        "$pull": {"local.search": {tags: searched_keyword}},
                                    })
                                .exec(function (error) {
                                    if (error)
                                        throw error;
                                });
                            break;
                        }
                    }
                } else
                    new_entry = {tags: searched_keyword, count: 1};

                UserProfileModel
                    .update({"local.username": request.user.local.username},
                        {
                            "$push": {"local.search": new_entry},
                        })
                    .exec(function (error) {
                        if (error)
                            throw error;
                    });
            }
        });
}

function update_voted_up(request, searched_keyword) {
    UserProfileModel
        .find(
            {
                $and: [
                    {"local.username": request.user.local.username},
                    {"local.up_voted": {$elemMatch: {tags: searched_keyword}}},
                ]
            }
        )
        .exec(function (error, user_info) {
            if (error)
                throw error;
            else {
                var tags_clicked = [];
                var new_entry = {};
                if (user_info.length !== 0) {
                    tags_clicked = user_info[0].local.up_voted;
                    for (var index = 0; index < tags_clicked.length; index++) {
                        if (tags_clicked[index].tags === searched_keyword) {
                            new_entry = {tags: searched_keyword, count: tags_clicked[index].count + 1};
                            UserProfileModel
                                .update({"local.username": request.user.local.username},
                                    {
                                        "$pull": {"local.up_voted": {tags: searched_keyword}},
                                    })
                                .exec(function (error) {
                                    if (error)
                                        throw error;
                                });
                            break;
                        }
                    }
                } else
                    new_entry = {tags: searched_keyword, count: 1};

                UserProfileModel
                    .update({"local.username": request.user.local.username},
                        {
                            "$push": {"local.up_voted": new_entry},
                        })
                    .exec(function (error) {
                        if (error)
                            throw error;
                    });
            }
        });
}

function update_voted_down(request, searched_keyword) {
    UserProfileModel
        .find(
            {
                $and: [
                    {"local.username": request.user.local.username},
                    {"local.down_voted": {$elemMatch: {tags: searched_keyword}}},
                ]
            }
        )
        .exec(function (error, user_info) {
            if (error)
                throw error;
            else {
                var tags_clicked = [];
                var new_entry = {};
                if (user_info.length !== 0) {
                    tags_clicked = user_info[0].local.down_voted;
                    for (var index = 0; index < tags_clicked.length; index++) {
                        if (tags_clicked[index].tags === searched_keyword) {
                            new_entry = {tags: searched_keyword, count: tags_clicked[index].count + 1};
                            UserProfileModel
                                .update({"local.username": request.user.local.username},
                                    {
                                        "$pull": {"local.down_voted": {tags: searched_keyword}},
                                    })
                                .exec(function (error) {
                                    if (error)
                                        throw error;
                                });
                            break;
                        }
                    }
                } else
                    new_entry = {tags: searched_keyword, count: 1};

                UserProfileModel
                    .update({"local.username": request.user.local.username},
                        {
                            "$push": {"local.down_voted": new_entry},
                        })
                    .exec(function (error) {
                        if (error)
                            throw error;
                    });
            }
        });
}


module.exports = function (application_root, passport_auth) {

    application_root.get('/', function (request, response) {

        var rawdata = fs.readFileSync('../Recommender-System/search/post_title.json');
        searchElements = JSON.parse(rawdata);
        response.redirect('/post/1');
    });

    application_root.get('/login', function (request, response) {
        response.render('login.ejs', {message: request.flash('login-message')});
    });

    application_root.get('/dashboard', function (request, response, next) {
        if (!request.isAuthenticated())
            response.redirect('/post/1');

        UserProfileModel
            .find({"local.username": request.user.local.username})
            .exec(function (error, user_info) {
                if (error)
                    response.render('error.ejs', {
                        posts: [],
                    });
                else {
                    buildOSUM(request.user.local.username);
                    response.render('dashboard.ejs', {
                        name: request.user.local.username,
                        user_bio: user_info[0].local.bio,
                        user_temporary_user_tags: user_info[0].local.temporary_user_tags,
                        user_search: user_info[0].local.search,
                        user_favorites: user_info[0].local.favorites,
                        user_up_voted: user_info[0].local.up_voted,
                        user_down_voted: user_info[0].local.down_voted,
                        user_user_tags: user_info[0].local.user_tags,
                        users_temporary_user_tags: osum_data.users_temporary_user_tags,
                        users_up_voted: osum_data.users_up_voted,
                        users_down_voted: osum_data.users_down_voted
                    })
                }
            })
    });

    application_root.get('/search/:keyword', function (request, response, next) {
        var keyword = request.params.keyword || 'java';
        var item_length;
        var searched_post = [];

        if (request.isAuthenticated())
            response.redirect('/personalized_search/' + keyword);

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

    application_root.get('/tag_search/:keyword', function (request, response, next) {
        var keyword = request.params.keyword || 'java';

        if (request.isAuthenticated())
            response.redirect('/personalized_tag_search/' + keyword);

        SOPostModel
            .find({
                $and: [
                    {"type": "\"question"},
                    {"tag": {$regex: keyword.toString().replace(/[,]/g, "|")}},
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
    });

    application_root.get('/personalized_tag_search/:keyword', function (request, response, next) {
        let searched_keyword = request.params.keyword;

        let default_search_keyword = 'java';
        var keyword = searched_keyword || default_search_keyword;

        if (!request.isAuthenticated())
            response.redirect('/tag_search/' + keyword);

        if (searched_keyword !== undefined && searched_keyword.length > 0)
            update_temporary_user_tags(request, searched_keyword);

        SOPostModel
            .find({
                $and: [
                    {"type": "\"question"},
                    {"tag": {$regex: searched_keyword.toString().replace(/[,]/g, "|")}},
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
    });

    application_root.get('/personalized_search/:keyword', function (request, response, next) {
        let searched_keyword = request.params.keyword;

        let default_search_keyword = 'java';
        var keyword = searched_keyword || default_search_keyword;
        var item_length;
        var searched_post = [];

        if (!request.isAuthenticated())
            response.redirect('/search/' + keyword);

        if (searched_keyword !== undefined && searched_keyword.length > 0)
            update_search_tags(request, searched_keyword);

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

    application_root.get('/personalized_search_results/:page', function (request, response) {
        var page = parseInt(request.params.page || 1);
        var perPage = 10;

        if (!request.isAuthenticated())
            response.redirect('/search_results/' + page);

        var currentPageContent = paginate(searchResults, page, perPage);
        response.render('personalized_search_results.ejs', {
            posts: currentPageContent.pageData,
            current: currentPageContent.nextPage - 1,
            pages: currentPageContent.totalCount
        })
    });

    application_root.get('/search_results/:page', function (request, response) {
        var page = parseInt(request.params.page || 1);
        if (request.isAuthenticated())
            response.redirect('/personalized_search_results/' + page);
        var perPage = 10;
        var currentPageContent = paginate(searchResults, page, perPage);
        response.render('search_results.ejs', {
            posts: currentPageContent.pageData,
            current: currentPageContent.nextPage - 1,
            pages: currentPageContent.totalCount
        })
    });

    application_root.get('/add_to_favorite/:title', function (request) {
        var title = request.params.title || '';
        if (request.isAuthenticated()) {
            if (title !== undefined && title.length > 0)
                UserProfileModel
                    .update({"local.username": request.user.local.username},
                        {
                            "$addToSet": {"local.favorites": title}
                        })
                    .exec(function (error) {
                        if (error)
                            throw error;
                    });
        }
    });


    application_root.get('/remove_from_favorite/:title', function (request) {
        var title = request.params.title || '';
        if (request.isAuthenticated()) {
            if (title !== undefined && title.length > 0)
                UserProfileModel
                    .update({"local.username": request.user.local.username},
                        {
                            "$pull": {"local.favorites": title}
                        })
                    .exec(function (error) {
                        if (error)
                            throw error;
                    });
        }
    });

    application_root.get('/vote_up/:title', function (request) {
        var title = request.params.title || '';
        if (request.isAuthenticated()) {
            if (title !== undefined && title.length > 0) {
                title = buildRegex(title);
                SOPostModel
                    .find({
                        $and: [
                            {"type": "\"question"},
                            {"title": {'$regex': title}}
                        ]
                    })
                    .exec(function (error, so_post) {
                        if (error)
                            throw error;
                        else {
                            SOPostModel
                                .update({"title": {'$regex': title}},
                                    {
                                        "$set": {"vote": so_post[0].vote + 1}
                                    })
                                .exec(function (error) {
                                    if (error)
                                        throw error;
                                    else {
                                        var tags = so_post[0].tag.toString().split(" ");
                                        for (var index = 0; index < tags.length - 1; index++) {
                                            if (tags[index] !== "java" && tags[index].length > 0)
                                                update_voted_up(request, tags[index]);
                                        }
                                    }
                                });
                        }
                    })
            }
        }
    });


    application_root.get('/vote_down/:title', function (request) {
        var title = request.params.title || '';
        if (request.isAuthenticated()) {
            if (title !== undefined && title.length > 0)
                title = buildRegex(title);

            SOPostModel
                .find({
                    $and: [
                        {"type": "\"question"},
                        {"title": {'$regex': title}}
                    ]
                })
                .exec(function (error, so_post) {
                    if (error)
                        throw error;
                    else {
                        SOPostModel
                            .update({"title": {'$regex': title}},
                                {
                                    "$set": {"vote": so_post[0].vote - 1}
                                })
                            .exec(function (error) {
                                if (error)
                                    throw error;

                                else {
                                    var tags = so_post[0].tag.toString().split(" ");
                                    for (var index = 0; index < tags.length - 1; index++) {
                                        if (tags[index] !== "java" && tags[index].length > 0)
                                            update_voted_down(request, tags[index]);
                                    }
                                }
                            });
                    }
                })
        }
    });

    application_root.get('/personalized_post/:page', function (request, response, next) {
        var perPage = 10;
        var page = request.params.page || 1;

        if (!request.isAuthenticated())
            response.redirect('/post/' + page);

        UserProfileModel
            .find({"local.username": request.user.local.username})
            .exec(function (error, user_info) {
                if (error)
                    throw error;

                SOPostModel
                    .find({
                        $and: [
                            {"type": "\"question"},
                            {"tag": {$regex: user_info[0].local.user_tags.toString().replace(/[,]/g, "|")}},
                        ]
                    })
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .exec(function (error, stack_overflow_post) {
                        SOPostModel
                            .find({
                                $and: [
                                    {"type": "\"question"},
                                    {"tag": {$regex: user_info[0].local.user_tags.toString().replace(/[,]/g, "|")}},
                                ]
                            })
                            .count()
                            .exec(function (error, count) {
                                if (error)
                                    response.render('error.ejs', {
                                        posts: [],
                                    });
                                response.render('personalized_post.ejs', {
                                    posts: stack_overflow_post,
                                    content_based_recommendation_posts: content_based_recommendation_posts,
                                    collaborative_based_recommendation_posts: collaborative_based_recommendation_posts,
                                    current: page,
                                    pages: Math.ceil(count / perPage)
                                })
                            })
                    })
            });
    });

    application_root.get('/post/:page', function (request, response, next) {
        var perPage = 10;
        var page = request.params.page || 1;

        if (request.isAuthenticated())
            response.redirect('/personalized_post/' + page);

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


    application_root.get('/fetch_personalized_post/:title', function (request, response, next) {
        var title = request.params.title;

        if (!request.isAuthenticated())
            response.redirect('/fetch_post/' + title);

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

        if (request.isAuthenticated())
            response.redirect('/fetch_personalized_post/' + title);

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

    application_root.post('/sign-up', passport_auth.authenticate('local-sign-up', {
        successRedirect: '/profile',
        failureRedirect: '/sign-up',
        failureFlash: true
    }));

    application_root.get('/profile', isUserLoggedIn, function (request, response) {
        retrieveContentBasedRecommendationPost(request.user.local.username);
        retrieveCollaborationBasedRecommendationPost(request.user.local.username);
        response.render('profile.ejs', {
            user: request.user,
        });
    });

    application_root.get('/logout', function (request, response) {
        searchResults = [];
        content_based_recommendation_posts = [];
        collaborative_based_recommendation_posts = [];
        osum_data = {};
        request.logout();
        response.redirect('/');
    });
}
;

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

function retrieveContentBasedRecommendationPost(user_name) {
    UserProfileModel
        .find({"local.username": user_name})
        .exec(function (error, user_info) {
                var tags = user_info[0].local.temporary_user_tags;
                var regex = "";
                for (var index = 0; index < tags.length; index++) {
                    regex = regex + tags[index].tags + "|";
                }
                SOPostModel
                    .find({
                        $and: [
                            {"type": "\"question"},
                            {"tag": {$regex: regex}},
                        ]
                    })
                    .limit(10)
                    .exec(function (error, content_based_stack_overflow_posts) {
                        if (error)
                            throw error;
                        content_based_recommendation_posts = content_based_stack_overflow_posts;
                    })
            }
        )
}

function retrieveCollaborationBasedRecommendationPost(user_name) {
    UserProfileModel.find({'local.username': {$nin: [user_name]}}, function (error, all_users) {
        if (error)
            console.log(error);
        else {
            buildCollaborationBasedRecommendationPost(all_users);
        }
    }).select('-_id');
}

function buildCollaborationBasedRecommendationPost(users) {
    var user_tags = [];
    for (var index = 0; index < users.length; index++) {
        for (var tag_index = 0; tag_index < users[index].local.user_tags.length; tag_index++)
            user_tags.push(users[index].local.user_tags[tag_index]);
    }

    SOPostModel
        .find({
            $and: [
                {"type": "\"question"},
                {"tag": {$regex: user_tags.toString().replace(/[,]/g, "|")}},
            ]
        })
        .sort({"vote": "desc"})
        .limit(10)
        .exec(function (error, collaboration_based_post) {
            if (error)
                throw error;
            collaborative_based_recommendation_posts = collaboration_based_post;
        })
}


function buildOSUM(user_name) {
    UserProfileModel.find({'local.username': {$nin: [user_name]}}, function (error, all_users) {
        if (error)
            console.log(error);
        else {
            osum_data = buildDataNeededForOSUM(all_users);
            console.log(osum_data);
        }
    }).select('-_id');
}

function buildDataNeededForOSUM(user_info) {
    var data = {
        users_temporary_user_tags: [],
        users_search: [],
        users_up_voted: [],
        users_down_voted: [],
        users_favorites: [],
        users_user_tags: []
    };

    for (var index = 0; index < user_info.length; index++) {
        appendUserData(data, 'users_temporary_user_tags', user_info[index].local.temporary_user_tags, true);
        appendUserData(data, 'users_search', user_info[index].local.search, true);
        appendUserData(data, 'users_up_voted', user_info[index].local.up_voted, true);
        appendUserData(data, 'users_down_voted', user_info[index].local.down_voted, true);
        appendUserData(data, 'users_favorites', user_info[index].local.user_tags, false);
        appendUserData(data, 'users_user_tags', user_info[index].local.favorites, false);
    }

    return data;
}

function appendUserData(data, type, entry, is_tags_present) {
    for (var index = 0; index < entry.length; index++) {
        var found = false;
        if (is_tags_present) {
            for (var j = 0; j < data[type].length; j++) {
                if (data[type][j].tags === entry[index].tags) {
                    data[type][j].count += entry[index].count;
                    found = true;
                }
            }
            if (!found)
                data[type].push({tags: entry[index].tags, count: entry[index].count})

        } else {
            data[type].push(entry[index]);
        }
    }

}