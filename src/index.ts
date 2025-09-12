import express from 'express';
import connectDB from './config/db.js';
import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { context } from './graphql/context.js';

const app = express()

const schema = createSchema({
    typeDefs,
    resolvers
})

const yoga = createYoga({
    schema,
    context
})

app.use('/graphql', yoga)

connectDB(app);