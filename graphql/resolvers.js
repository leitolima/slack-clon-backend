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
        addMember: async (_, { groupId, email }) => {
            console.log('Mutation => addMember');
            try {
                const user = await User.findOne({ email }, { id: 1, email: 1, });
                if(!user) throw new Error('This email is not registered.');
                let group = await Group.findById(groupId);
                const flag = group.members.includes(user.id);
                if(flag) throw new Error('This user is already added to this group.');
                group.members.push(user.id);
                await group.save();
                return user;
            } catch (error) {
                throw new Error(error);
            }
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