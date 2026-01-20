// Schema for users collection
// Stores user information as per project requirements
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
}, {
    versionKey: false,
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);