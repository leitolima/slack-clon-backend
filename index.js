const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typeDefs');
const cors = require('cors');
const http = require("http");

const app = express();

const corsOptions = {
    origin: process.env.NODE_ENV == 'production'
        ? process.env.APP_URL 
        : 'http://localhost:3000', 
    credentials: true, // <-- REQUIRED backend setting
};

//Middlewares
app.set('trust proxy', 1);
app.use(cors(corsOptions));

//Function to start server
let server = null;
const startServer = async () => {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => {
            const head = process.env.NODE_ENV == 'production'
            ? process.env.APP_URL
            : 'http://localhost:3000';
            res.setHeader('Access-Control-Allow-Origin', head);
            return { ...req, ...res }
        }
    });
    //For Apollo V3
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
}
startServer();

const httpServer = http.createServer(app);

httpServer.listen({port: process.env.PORT || 4000}, () => {
    console.log(`Server running on PORT ${process.env.PORT || 4000}`);
})