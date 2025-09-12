import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import User from "../models/User.js";
import { generateToken } from "../services/authServices.js";
import type { Context } from "./context.js";
import { checkMovie, searchMovie } from "../services/moviesService.js";
import Favorites from "../models/Favorite.js";
import Movie from "../models/Movie.js";

export const resolvers = {
    Query: {
        me: async (_: any, __: any, context:Context) => {
            if(!context.user) throw new GraphQLError("user not authenticated")
            const user = await User.findOne({ user: context.user.id })
            if (!user) throw new GraphQLError("no user found")
            return user
        },
        searchMovies: async (_: any, arg: { query: string, page: number }, context: Context) => {
            if(!context.user) throw new GraphQLError("user not authenticated")
            const { query, page } = arg
            return await searchMovie(query, page);
        }
    },
    Mutation: {
        //SIGNUP MUTATION
        signup: async (_: any, { input }: any) => {
            //destructure input
            const { name, email, password, city } = input

            // find user by email in db
            const existingUser = await User.findOne({ email });

            //check if user exists
            if (existingUser) throw new GraphQLError("User already exists");

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // create new user
            const user = new User({ name, email, password: hashedPassword, city })

            const token = generateToken(user.id)

            // save new user to db
            await user.save()

            return { token, user }
        },

        // LOGIN MUTATION
        login: async (_: any, { input }: any) => {
            const { email, password } = input

            // find user by email in db
            const user = await User.findOne({ email })
            if (!user) throw new GraphQLError("User not found")
            
            // check if password matches
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) throw new GraphQLError("Invalid credentials")
            
            const token = generateToken(user.id)
            
            return { token, user }
        },
        addFavorite: async (_: any, { imdbID }: { imdbID: string }, context: Context) => {
            if (!context.user) throw new GraphQLError("user not authenticated")
            const movie = await checkMovie(imdbID)
            
            const favoriteMovie = await Favorites.findOneAndUpdate(
                { user: context.user.id, movie: movie.id },
                { $setOnInsert: { user: context.user.id, movie: movie.id } },
                { upsert: true, new: true }
            )
            return {
                id: favoriteMovie.id,
                movie: favoriteMovie.movie
            }
        },
        removeFavorite: async (_: any, { imdbID }: { imdbID: string }, context: Context) => {
            if (!context.user) throw new GraphQLError("user not authenticated")
            const movie = await Movie.findOne({ provider: "omdb", imdbID });
            if (!movie) return false;
            const deleteMovie = await Favorites.deleteOne({ user: context.user._id, movie: movie._id });
                
            return deleteMovie.deletedCount === 1;
        },
    }
}