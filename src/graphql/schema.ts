export const typeDefs = `

    type User {
        id:ID!
        name:String!
        email:String!
        city:String!
    }

    type Movie {
        id: ID!
        title: String!
        year: String!
        imdbID: String!
        type: String!
        poster: String
    }

    type AuthPayload {
        user: User
        token: String
    }

    type Query {
        me: User!
        searchMovies(query: String!, page: Int = 1): [Movie]!
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