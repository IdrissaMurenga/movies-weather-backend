import user from "./user.js";

export const resolvers = {
    Query: {
        ...user.Query
    },
    Mutation: {
        ...user.Mutation
    }
}