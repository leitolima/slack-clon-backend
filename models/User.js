const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    position: {
        type: String,
        require: true,
    },
    telephone: {
        type: String,
        require: true,
    },
    status: {
        type: {
            emoji: {
                type: String,
                require: true,
            },
            description: {
                type: String,
                require: true,
            }
        },
        default: null,
    },
    imageUrl: {
        type: String,
        require: true,
    },
});

module.exports = model('user', UserSchema);