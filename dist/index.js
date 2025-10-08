import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { createYoga, createSchema } from 'graphql-yoga';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { context } from './graphql/context.js';
import { configEnv } from './config/env.js';
const app = express();
// ---- CORS ----
const allowedOrigins = [
    configEnv.FRONTEND_URL,
    process.env.FRONTEND_URL_PREVIEW,
].filter(Boolean);
app.use(cors({
    origin(origin, cb) {
        // Allow same-origin/non-browser requests (e.g., curl, health checks)
        if (!origin)
            return cb(null, true);
        if (allowedOrigins.includes(origin))
            return cb(null, true);
        return cb(new Error(`CORS: Origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
}));
app.use(express.json());
// ---- GraphQL ----
const schema = createSchema({ typeDefs, resolvers });
const yoga = createYoga({
    schema,
    context,
    // Explicit endpoint for clarity
    graphqlEndpoint: '/graphql',
});
app.use('/graphql', yoga);
// ---- Health check (Koyeb) ----
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));
// ---- Startup ----
const PORT = Number(configEnv.PORT || 4000);
app.listen(PORT, '0.0.0.0', () => console.log(`API on :${PORT}`));
// ---- DB ----
connectDB(app);
