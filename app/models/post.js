var mongoose_lib = require('mongoose');

var soPostSchema = mongoose_lib.Schema({

    user_id: String,
    text: String,
    code: String,
    tag: String,
    content: String,
    accept_rate: String,
    vote: String,
    title: String,
    time: String,
    type: String,
    reputation: String

});

module.exports = mongoose_lib.model('so_post', soPostSchema);