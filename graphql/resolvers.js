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
        },
        createUser: async (_, { input }) => {
            console.log('Mutation => createUser');
            try {
                const { name, email, position, telephone } = input;
                const userFound = await User.findOne({ email });
                if(userFound) throw new Error('This email is already registered.');
                const newUser = new User({
                    name, email, username: name, position, telephone
                });
                await newUser.save();
                return newUser;
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

module.exports = resolvers;