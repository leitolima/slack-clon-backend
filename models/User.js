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
        default: '',
    },
    telephone: {
        type: String,
        require: true,
        default: '',
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
        default: 'https://res.cloudinary.com/dspswtipv/image/upload/v1608780067/cihpcvkxc20fmniyltnq.png',
    },
});

module.exports = model('user', UserSchema);