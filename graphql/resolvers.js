const mongoose = require('mongoose');
const User = require('../models/User');
const Group = require('../models/Group');
const Channel = require('../models/Channel');
const Message = require('../models/Message');

const formatDate = () => {
    const date = new Date();
    const formatedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    const formatedTime = `${date.getHours()}:${date.getMinutes()}`;
    return {
        date: formatedDate,
        time: formatedTime,
    }
}

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
        getDirectChannels: async (_, { groupId }) => {
            console.log('Query => getDirectChannels');
            try {
                const group = await Group.aggregate([
                    { $match: {
                        '_id': mongoose.Types.ObjectId(groupId)
                    }},
                    { $lookup: {
                        from: 'users',
                        let: { members_arr: '$members' },
                        pipeline: [
                            { $addFields: { id: { $toObjectId: '$_id' } } },
                            { $match: { $expr: { $in: ['$id', '$$members_arr'] } } },
                            { $project: { '_id': 0, id: 1, username: 1, imageUrl: 1 } }
                        ],
                        as: 'members'
                    }}
                ]);
                if (!group || !group.length) throw new Error('This group not exists.');
                const users = group[0].members;
                return users;
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
        },
        getChannel: async (_, { channelId, userId }) => {
            console.log('Query => getChannel');
            try {
                if(!channelId) throw new Error('ChannelId is required');
                const channel = await Channel.aggregate([
                    { $addFields: {
                        id: { 
                            $toObjectId: '$_id' 
                        }
                    }},
                    { $match: {
                        id: mongoose.Types.ObjectId(channelId),
                        'members': mongoose.Types.ObjectId(userId) // It works like includes()
                    }},
                    { $lookup: {
                        from: 'users',
                        let: { members_arr: '$members' },
                        pipeline: [
                            { $addFields: { id: { $toObjectId: '$_id' } } },
                            { $match: { $expr: { $in: ['$id', '$$members_arr'] } } },
                            { $project: { '_id': 0, id: 1, name: 1, username: 1, imageUrl: 1, position: 1 } }
                        ],
                        as: 'members',
                    }}
                ])
                if(!channel.length) throw new Error('This channel not exists or you are not a member');
                return channel[0];
            } catch (error) {
                throw new Error(error);
            }
        },
        getMessages: async (_, { channelId }) => {
            console.log('Query => getMessages');
            try {
                const messages = await Message.aggregate([
                    { $addFields: {
                        id: {
                            $toObjectId: '$_id',
                        }
                    }},
                    { $match: {
                        channel: mongoose.Types.ObjectId(channelId),
                    }},
                    { $project: {
                        _id: 0, id: 1, text: 1, date: 1, time: 1, reactions: 1, user: 1,
                    }},
                    { $sort: { 'date': 1, 'time': 1 } },
                    // { $limit: 3 },
                    {
                        $lookup: {
                            from: 'users',
                            let: { user_id: '$user' },
                            pipeline: [
                                { $addFields: { id: { $toObjectId: '$_id' } } },
                                { $match: { $expr: { $eq: ['$id', '$$user_id'] } } },
                                { $project: { _id: 0, id: 1, username: 1, imageUrl: 1 } }
                            ],
                            as: 'userarr'
                        }
                    },
                    { $project: {
                        id: 1, text: 1, date: 1, time: 1, reactions: 1, user: '$userarr'
                    }},
                    { $unwind: '$user' }
                ]);
                console.log(messages)
                return messages;
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
                if(!group) throw new Error('This group not exists.');
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
        addMemberToChannel: async (_, { groupId, channelId, email }) => {
            console.log('Mutation => addMemberToChannel');
            try {
                const user = await User.findOne({ email }, { id: 1, email: 1, });
                if(!user) throw new Error('This email is not registered.');
                // Validate Group
                const group = await Group.findById(groupId);
                const groupFlag = group.members.includes(user.id);
                if(!groupFlag) throw new Error('This user is not added to this group.');
                // Validate Channel
                let channel = await Channel.findById(channelId);
                if(!channel) throw new Error('This channel not exists.');
                if(channel.groupId !== groupId) throw new Error('This channel is not created in this group.');
                const flag = channel.members.includes(user.id);
                if(flag) throw new Error('This user is already added to this group.');
                // Add User
                channel.members.push(user.id);
                await channel.save();
                return user;
            } catch (error) {
                throw new Error(error);
            }
        },
        sendMessage: async (_, { input }) => {
            console.log('Mutation => sendMessage');
            try {
                const { channel: channelId, user: userId } = input;
                const channel = await Channel.findById(channelId);
                const flag = channel.members.includes(userId);
                if(!flag) throw new Error('This user is not added to this group.');
                const { date, time } = formatDate();
                const message = new Message({ ...input, date, time });
                await message.save();
                await Message.populate(message, 'user');
                return message
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

module.exports = resolvers;