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
    type Favorite {
        id: ID!
        movie: Movie!
    }

    type AuthPayload {
        user: User
        token: String
    }
    
    type SearchResult {
        movies: [Movie!]!
        total: Int!
    }

    type Query {
        me: User!
        searchMovies(query: String!, page: Int = 1): SearchResult!
    }

    type Mutation {
        signup(input: SignupInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        addFavorite(imdbID: String): Favorite!
        removeFavorite(imdbID: String): Boolean!
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