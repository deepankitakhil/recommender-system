/*
 Referenced from :
 https://github.com/braitsch/node-login
 https://github.com/braitsch/node-login
 https://github.com/scotch-io/easy-node-authentication
 https://scotch.io/tutorials/easy-node-authentication-setup-and-local
 http://www.thatsoftwaredude.com/content/6125/how-to-paginate-through-a-collection-in-javascript
 https://www.djamware.com/post/58eba06380aca72673af8500/node-express-mongoose-and-passportjs-rest-api-authentication
 http://jsfiddle.net/asimshahiddIT/jrjjzw18/

 */

var mongoose_lib = require('mongoose');
var encryption_lib = require('bcrypt-nodejs');

var userProfileSchema = mongoose_lib.Schema({

    local: {
        username: String,
        bio: String,
        user_tags: {type: Array, "default": []},
        following: {type: Array, "default": []},
        followers: {type: Array, "default": []},
        temporary_user_tags: {type: Array, "default": []}
    }

});

module.exports = mongoose_lib.model('user_profile', userProfileSchema);

