import jwt from 'jsonwebtoken';
import { configEnv } from '../config/env.js';
import { GraphQLError } from 'graphql';
export const generateToken = async (userId) => {
    try {
        return jwt.sign({ id: userId }, configEnv.JWT_SECRET, { expiresIn: '7d' });
    }
    catch (error) {
        throw new GraphQLError(error.message);
    }
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, configEnv.JWT_SECRET);
    }
    catch (error) {
        throw new GraphQLError(error.message);
    }
};
export const authCheck = (context) => {
    if (!context.user)
        throw new GraphQLError('user not authenticated');
};
