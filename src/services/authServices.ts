import jwt from 'jsonwebtoken'
import { configEnv } from '../config/env.js'
import { GraphQLError } from 'graphql'
import type { Context } from '../graphql/context.js'

export interface InputType {
    input:{
        name: string
        email: string
        password: string
        city: string
    }
}

export const generateToken = async (userId: string) => {
    try {
        return jwt.sign({id:userId}, configEnv.JWT_SECRET as string, {expiresIn: "7d"} )
    } catch (error: any) {
        throw new GraphQLError(error.message)
    }
}

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, configEnv.JWT_SECRET as string)
    } catch (error: any) {
        throw new GraphQLError(error.message)
    }
}

export const authCheck = (context: Context) => {
    if(!context?.user) throw new GraphQLError("user not authenticated")
}