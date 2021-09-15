const { Schema, model } = require('mongoose');

const ChannelSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'group',
        require: true,
    },
    public: {
        type: Boolean,
        require: true,
        default: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: [],
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'message',
        default: [],
    }],
    channelType: {
        type: String,
        require: true,
    }
});

module.exports = model('channel', ChannelSchema);