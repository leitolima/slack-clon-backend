const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'group',
        require: true,
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: 'channel',
        require: true,
    },
    reactions: {
        type: [String],
        default: [],
    },
});

module.exports = model('message', MessageSchema);