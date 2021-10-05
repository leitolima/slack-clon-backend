const mongoose = require('mongoose');
const User = require('../models/User');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const Message = require('../models/Message');

const resolvers = {
    Query: {
        getRandomUser: async () => {
            console.log('Query => getRandomUser');
            try {
                // For now this function will return user with
                // id = 6143c711c3c546fda5799577
                const user = await User.findById('6143c711c3c546fda5799577');
                return user;
            } catch (error) {
                throw new Error(error);
            }
        },
        getUser: async (_, { id }) => {
            console.log('Query => getUser');
            try {
                const user = await User.findById(id);
                return user;
            } catch (error) {
                throw new Error(error);
            }
        },
        getUsers: async (_, { channelId, groupId }) => {
            console.log('Query => getUsers');
            try {
                const users = await User.find();
                return users;
            } catch (error) {
                throw new Error(error);
            }
        },
        getMyGroups: async (_, { userId }) => {
            console.log('Query => getMyGroups');
            try {
                const groups = await Group.aggregate([
                    {
                        $addFields: {
                            id: { 
                                $toObjectId: '$_id' 
                            }
                        }
                    },
                    {
                        $match: {
                            'members': mongoose.Types.ObjectId(userId) // It works like includes()
                        }
                    }
                ]);
                return groups;
            } catch (error) {
                throw new Error(error);
            }
        },
        getMyChannels: async (_, { groupId, userId }) => {
            console.log('Query => getMyChannels');
            try {
                const channels = await Channel.aggregate([
                    {
                        $addFields: {
                            id: { 
                                $toObjectId: '$_id' 
                            }
                        }
                    },
                    {
                        $match: {
                            'groupId': mongoose.Types.ObjectId(groupId),
                            'members': mongoose.Types.ObjectId(userId) // It works like includes()
                        }
                    }
                ]);
                return channels;
            } catch (error) {
                throw new Error(error);
            }
        }
    },
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
        addMemberToGroup: async (_, { groupId, email }) => {
            console.log('Mutation => addMemberToGroup');
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
        },
        createChannel: async (_, { input }) => {
            console.log('Mutation => createChannel');
            try {
                const { createdBy } = input;
                input.members = [createdBy];
                const newChannel = new Channel(input);
                await newChannel.save();
                return newChannel;
            } catch (error) {
                throw new Error(error);
            }
        },
        addMemberToChannel: async (_, { channelId, email }) => {
            console.log('Mutation => addMemberToChannel');
            try {
                const user = await User.findOne({ email }, { id: 1, email: 1, });
                if(!user) throw new Error('This email is not registered.');
                let channel = await Channel.findById(channelId);
                const flag = channel.members.includes(user.id);
                if(flag) throw new Error('This user is already added to this group.');
                channel.members.push(user.id);
                await channel.save();
                return user;º
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

module.exports = resolvers;