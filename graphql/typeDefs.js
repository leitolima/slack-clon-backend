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
    }

    type Channel {
        id: ID
        type: ChannelType
        name: String
        public: Boolean
        members: [User]
        messages: [Message]
    }

    enum ChannelType {
        Channel
        Direct
    }

    type Query {
        getUser: String
    }
`;

module.exports = typeDefs;