const User = require('../models/User');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const Message = require('../models/Message');

const resolvers = {
    Query: { },
    Mutation: {
        createGroup: async (_, { input }) => {
            console.log('Mutation => createGroup');
            const { name } = input;
            const newGroup = new Group({
                name
            });
            await newGroup.save();
            return newGroup;
        }
    }
}

module.exports = resolvers;