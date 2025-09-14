export const typeDefs = `

# USER TYPE
    type User {
        id:ID!
        name:String!
        email:String!
        city:String!
        weather: Weather!
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
        pressure: Int!
        humidity: Int!
        windSpeed: Float!
        windDeg: Int
        sunrise: Int
        sunset: Int
        dt: Int!
    }
# QEURY TYPE
    type Query {
        me: User!
        getWeather: Weather!
        searchMovies(query: String!, page: Int = 1): Search!
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
