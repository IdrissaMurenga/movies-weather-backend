import type { YogaInitialContext } from "graphql-yoga";
import { verifyToken } from "../services/authServices.js";
import User from "../models/User.js";
import { GraphQLError } from "graphql";

// define a context type with request and user object
export type Context = {
    request: Request
    user?: InstanceType<typeof User>;
}

export const context = async (initialContext: YogaInitialContext): Promise<Context> => {

    //get the HTTP request object from YogaInitialContext.
    const request = initialContext.request

    //get authorization header
    const authHeader = request.headers.get("authorization") || '';

    // set token with baerer authorization header
    const token = authHeader.replace("Bearer ", "").trim()

    // return request context when no token found
    if (!token) {
        return { request };
    }

    try {

        //extract user ID from jsonwebtoken
        const decoded = verifyToken(token);

        // if token invalid → return request context without user
        if (typeof decoded === 'string' || !('id' in decoded)) {
            return { request };
        }

        // fetch user from database
        const user = await User.findById(decoded.id);

        // if no user throw user not found
        if (!user) throw new GraphQLError('No user found');

        // return context request and user
        return { request, user };

    } catch (error: any) {
        
        // if the token is invalid, log the error and return request context object
        console.error('TOKEN_VERIFICATION_ERROR:', error.message);

        return { request };
    }
}