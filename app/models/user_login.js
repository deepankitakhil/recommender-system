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

var userLoginSchema = mongoose_lib.Schema({

    local: {
        username: String,
        password: String
    }

});

userLoginSchema.methods.generateHash = function (password) {
    return encryption_lib.hashSync(password, encryption_lib.genSaltSync(10), null);
};

userLoginSchema.methods.validatePassword = function (password) {
    return encryption_lib.compareSync(password, this.local.password);
};

module.exports = mongoose_lib.model('user_login', userLoginSchema);

