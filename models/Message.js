const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
    time: {
        type: String,
        require: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'group',
        require: true,
    },
    channelId: {
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