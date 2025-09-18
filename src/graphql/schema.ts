export const typeDefs = `

# USER TYPE
    type User {
        id:ID!
        name:String!
        email:String!
        city:String
        weather: Weather
        favorites: [Favorite!]!
    }

# MOVIES TYPE
    type Movie {
        id: ID!
        provider: String!
        imdbID: String!
        title: String!
        year: String!
        type: String!
        poster: String
    }

# FAVORITE TYPE
    type Favorite {
        id: ID!
        user: ID!
        movie: Movie!
    }

# PAYLOAD TYPE
    type AuthPayload {
        user: User
        token: String
    }
    
#SEARCH MOVIE TYPE
    type Search {
        movies: [Movie!]!
        total: Int!
    }
# WEATHER TYPE
    type Weather {
        city: String!
        country: String
        description: String!
        icon: String!
        iconUrl: String!
        temp: Float!
        feelsLike: Float!
        humidity: Int!
        windSpeed: Float!
        
    }
# QEURY TYPE
    type Query {
        me: User!
        getWeather: Weather!
        searchMovies(query: String!, page: Int = 1): Search!
        favoriteMovies: [Favorite!]!
    }

# MUTATIONS TYPE
    type Mutation {
        signup(input: SignupInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        addFavorite(imdbID: String!): Favorite!
        removeFavorite(imdbID: String!): Boolean!
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
`;
