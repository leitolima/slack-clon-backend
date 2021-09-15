const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID
    }

    type Query {
        getUser: String
    }
`;

module.exports = typeDefs;