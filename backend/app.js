// ES6 format
// import express from 'express';
// import { ApolloServer, gql } from 'apollo-server-express';
// import config, { app as _app } from './config';
// import mongoose from './db.js';

const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./app/config')
const authRouter = require('./app/routers/auth')
const userRouter = require('./app/routers/user')

// write temporary records for testing purposes
require('./app/assets/seeder')

// graphql related
const typeDefs = require('./app/graphql/typeDefs')
const resolvers = require('./app/graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers ,
    context: ({req, res}) => ({
        token: req.headers['token'],
      }),
});

const app = express();

app.use(cors())
app.use(bodyParser.json())

app.use(authRouter)
app.use(userRouter)

server.applyMiddleware({ app, path: config.app.graphqlPath });

app.get('/', (req, res) => {
    res.send(config.app.title)
})

app.listen({ port: config.app.port }, () => {
    const { app: { port } } = config
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
});