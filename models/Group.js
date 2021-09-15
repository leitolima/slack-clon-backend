const { Schema, model } = require('mongoose');

const GroupSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: [],
    }]
});

module.exports = model('group', GroupSchema);