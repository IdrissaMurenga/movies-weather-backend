export const userType = `
    type User {
        id:ID!
        name:String!
        email:String!
        city:String!
    }
    type Query {
        me: User!
    }
    type AuthPayload {
        user: User
        token: String
    }
    type Mutation {
        signup(input: SignupInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
    }
    input SignupInput {
        name: String!
        email: String!
        password: String!
        city: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
`

