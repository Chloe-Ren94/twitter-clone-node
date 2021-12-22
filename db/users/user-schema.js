const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    profilePic: String,
    headerPic: String,
    bio: String
}, {collection: 'users', timestamps: true});
module.exports = userSchema;