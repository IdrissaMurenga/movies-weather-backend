import type { YogaInitialContext } from "graphql-yoga";
import { verifyToken } from "../services/authServices.js";
import User from "../models/User.js";
import { GraphQLError } from "graphql";


export type Context = {
    request: Request
    user?: typeof User
}

export const context = async (initialContext: YogaInitialContext): Promise<Context> => {
    
    const request = initialContext.request

    const authHeader = request.headers.get("authorization") || '';
    const token = authHeader.replace("Bearer ", "").trim()

    const decoded = verifyToken(token);

    // if token invalid → return context without user
    if (typeof decoded === 'string' || !('id' in decoded)) {
        return { request };
    }

    // fetch user from DB
    const user = await User.find(decoded.id);

    if (!user) throw new GraphQLError('No user found');

    return { request };
}