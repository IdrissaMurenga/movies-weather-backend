export const typeDefs = `

# USER TYPE
    type User {
        id:ID!
        name:String!
        email:String!
        city:String!
    }

# MOVIES TYPE
    type Movie {
        id: ID!
        title: String!
        year: String!
        imdbID: String!
        type: String!
        poster: String
    }

# FAVORITE TYPE
    type Favorite {
        id: ID!
        movie: Movie!
    }

# PAYLOAD TYPE
    type AuthPayload {
        user: User
        token: String
    }
    
#SEARCH MOVIE TYPE
    type SearchResult {
        movies: [Movie!]!
        total: Int!
    }

# QEURY TYPE
    type Query {
        me: User!
        searchMovies(query: String!, page: Int = 1): SearchResult!
    }

# MUTATIONS TYPE
    type Mutation {
        signup(input: SignupInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        addFavorite(imdbID: String): Favorite!
        removeFavorite(imdbID: String): Boolean!
    }

#INPUTS
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