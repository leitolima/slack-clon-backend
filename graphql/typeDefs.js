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
        public: Boolean
        members: [User]
        messages: [Message]
        channelType: ChannelType
    }

    enum ChannelType {
        Channel
        Direct
    }

    type Query {
        getUser(id: ID): User
        getUsers(channelId: ID, groupId: ID): [User]
        getChannels(groupId: ID): [Channel]
        getMessages(messageType: ChannelType): [Message]
    }
`;

module.exports = typeDefs;