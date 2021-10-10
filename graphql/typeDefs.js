const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Group {
        id: ID
        name: String
        members: [User]
    }

    type User {
        id: ID
        name: String
        email: String
        username: String
        position: String
        telephone: String
        status: Status
        imageUrl: String
    }
    
    type Status {
        emoji: String
        description: String
    }

    type Message {
        id: ID
        time: String
        user: User
        text: String
        reactions: [String]
        channelId: ID
    }

    type Channel {
        id: ID
        name: String
        groupId: ID
        createdBy: User
        public: Boolean
        description: String
        members: [User]
        messages: [Message]
        channelType: ChannelType
    }

    enum ChannelType {
        Channel
        Direct
    }

    # -------------------- Inputs

    input GroupInput {
        id: ID
        name: String
    }

    input UserInput {
        id: ID
        name: String
        email: String
        username: String
        position: String
        telephone: String
    }

    input ChannelInput {
        id: ID
        createdBy: ID
        name: String
        groupId: ID
        public: Boolean
        description: String
        channelType: ChannelType
    }

    type Query {
        # --- getRandomUser is for get user who's not connected yet
        # --- This will be possible with a list of connected users by subscriptions
        getRandomUser: User
        getUser(id: ID): User
        getUsers(channelId: ID, groupId: ID): [User]

        # --- Groups
        getMyGroups(userId: ID): [Group]

        # --- Channels
        getDirectChannels(groupId: ID!): [User]
        getMyChannels(groupId: ID, userId: ID): [Channel]
        getChannel(channelId: ID, userId: ID): Channel

        # --- Messages
        getMessages(messageType: ChannelType): [Message]
    }

    type Mutation {
        # --- Group
        createGroup(input: GroupInput): Group
        addMemberToGroup(groupId: ID!, email: String!): User

        # --- User
        createUser(input: UserInput): User

        # --- Channels
        createChannel(input: ChannelInput): Channel
        addMemberToChannel(groupId: ID!, channelId: ID!, email: String!): User
    }
`;

module.exports = typeDefs;