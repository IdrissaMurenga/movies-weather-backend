import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { context } from './graphql/context.js';
import { configEnv } from './config/env.js';

const app = express();

app.use(cors({
  origin: configEnv.FRONTEND_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



// ---- GraphQL ----
const schema = createSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  context,
});

app.use('/graphql', yoga);

// ---- DB ----
connectDB(app);
