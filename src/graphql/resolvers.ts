import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { GraphQLError } from "graphql"
import type { Context } from "./context.js";
import { searchMovie, upsertMovie } from "../services/moviesService.js";
import { generateToken } from "../services/authServices.js";
import { authCheck, InputType } from "../services/authServices.js";
import { getCurrentWeather } from "../services/weatherServices.js";
import Favorite from "../models/Favorite.js";

export const resolvers = {
    Query: {
        //QUERY TO GET LOGGED IN USER DATA
        me: async (_: unknown, __: unknown, context: Context) => {
            
            //check if user is authenticated
            authCheck(context)

            try {
                //find if user exist with their id
                const user = await User.findById(context.user?.id )

                // if user doesn't exist show an error of user not found
                if (!user) throw new GraphQLError("no user found")

                // return user data if exist
                return user
            } catch (error) {
                throw new GraphQLError("error occured")
            }
        },
        // QUERY FOR SEARCHING MOVIES
        searchMovies: async (_: unknown, arg: { query: string, page: number }, context: Context) => {
            authCheck(context)

            //destruct movie params with query of movie and pages to be given
            const { query, page } = arg

            // calling search movie function to return searched movie in omdb API
            const movies = await searchMovie(query, page)

            // return movies
            return movies
        },
        getWeather: async (_: unknown, __: unknown, context: Context) => {
            authCheck(context)
            const user = await User.findById(context.user?.id)
            
            const city = user?.city; // string | undefined
            if (!city) return null

            return getCurrentWeather(city)
        }
    },
    User: {
        weather: async (parent: any) => {
            try {
                if (!parent.city) return null; // ← do not throw
                return await getCurrentWeather(parent.city);
            } catch (e) {
                console.error("weather resolver error:", e);
                return null; // ← swallow to avoid bubbling
            }
        },
    },
    Mutation: {
        //SIGNUP MUTATION
        signup: async (_: unknown, { input }: InputType) => {
            //destructure signup input object
            const { name, email, password, city } = input

            try {
                //find user by email in db
                const existingUser = await User.findOne({ email });

                //check if user exists throw error of existing user with same email
                if (existingUser) throw new GraphQLError("User already exists");

                //hash user's password to make it hard to hack it
                const hashedPassword = await bcrypt.hash(password, 10);

                // create a user with hashed password
                const user = new User({ name, email, password: hashedPassword, city })

                // generate token for the user with they id
                const token = generateToken(user.id)

                // save user to database
                await user.save()

                //return user object and user's token
                return { token, user }
            } catch (error) {
                console.error('Signup error')
            }
        },

        // LOGIN MUTATION
        login: async (_: unknown, { input }: InputType) => {

            //destructure login input object
            const { email, password } = input;

            try {
                // find user by email in db
                const user = await User.findOne({ email });
    
                // no user in databse throw a no user found error
                if (!user) throw new GraphQLError("User not found");
    
                // check if typed password match with the stored password
                const isMatch = await bcrypt.compare(password, user.password);
    
                // if paswword not throw error
                if (!isMatch) throw new GraphQLError("Incorrect Password");
    
                // generate token for the logged in user
                const token = generateToken(user.id);
    
                // return user object and user token
                return { token, user };
            } catch (error) {
                console.error("login error")
            }
        },
        addFavorite: async (_: unknown, { imdbID }: { imdbID: string }, context: Context) => {
            authCheck(context);
            const movie = await upsertMovie(imdbID);

          //upsert the Favorite
            const favorite = await Favorite.findOneAndUpdate(
                { user: context.user?.id, movie: movie._id },
                { $setOnInsert: { user: context.user?.id, movie: movie._id } },
                { upsert: true, new: true },
            ).populate("movie");

            return favorite!;
        }
    }
}