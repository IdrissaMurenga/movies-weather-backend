import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { GraphQLError } from "graphql"
import type { Context } from "./context.js";
import { searchMovie, upsertMovie } from "../services/moviesService.js";
import { generateToken } from "../services/authServices.js";
import { authCheck, InputType } from "../services/authServices.js";
import { getCurrentWeather } from "../services/weatherServices.js";
import Favorite from "../models/Favorite.js";
import Movie from "../models/Movie.js";

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
            
            const city = user?.city;
            if (!city) {
                throw new GraphQLError("City not set on user", { extensions: { code: "CITY_MISSING" } });
            }

            return getCurrentWeather(city)
        },
        favoriteMovies: async (_: unknown, __: unknown, context: Context) => {
            authCheck(context);
            const userId = context.user?.id;
            const fav = await Favorite.find({ user: userId }).populate("movie");
            return fav;
        },
    },
    User: {
        weather: async (parent: any) => {
            try {
                if (!parent.city) return null;
                return await getCurrentWeather(parent.city);
            } catch (e) {
                console.error("weather resolver error:", e);
                return null;
            }
        },
        favorites: async (parent: any) => {
            const favs = await Favorite.find({ user: parent.id }).populate("movie");
            return favs;
        }
    },
    Mutation: {
        //SIGNUP MUTATION
        signup: async (_: unknown, { input }: InputType) => {
            //destructure signup input object
            const { name, email, password, city } = input

            try {
                //find user by email in db
                const existUser = await User.findOne({ email });

                //check if user exists throw error of existing user with same email
                if (existUser) {
                    throw new GraphQLError("user already exist",{ extensions: { code: "USER_ALREADY_EXIST" }})
                }

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
                throw new GraphQLError("unexpected error")
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
                if (!user) {
                    throw new GraphQLError("User not found", { extensions: { code: "USER_NOT_FOUND" } })
                }
    
                // check if typed password match with the stored password
                const isMatch = await bcrypt.compare(password, user.password);
    
                // If password does not match, throw an error.
                if (!isMatch) {
                    throw new GraphQLError("incorrect password", {
                        extensions: { code: "INCORRECT_PASSWORD" },
                    });
                }
                
                // generate token for the logged in user
                const token = generateToken(user.id);
    
                // return user object and user token
                return { token, user };
            } catch (error) {
                throw new GraphQLError("unexpected error")
            }
        },
        addFavorite: async (_: unknown, { imdbID }: { imdbID: string }, context: Context) => {
            authCheck(context);
            const movie = await upsertMovie(imdbID);

            //upsert the Favorite
            const favorite = await Favorite.findOneAndUpdate(
                { user: context.user?.id, movie: movie.id },
                { $setOnInsert: { user: context.user?.id, movie: movie.id } },
                { upsert: true, new: true },
            ).populate("movie");

            return favorite!;
        },
        removeFavorite: async (_: unknown, { imdbID }: { imdbID: string }, context: Context) => {
            authCheck(context)
            if (!imdbID) throw new GraphQLError("imdbID is required", {
                extensions: { code: "IMDBID_IS_REQUIRED" },
            });

            // Find the favorited movie
            const movie = await Movie.findOne({ provider: "omdb", imdbID: imdbID })
            if (!movie) {
                return true
            }

            // Remove movie from the favorite
            await Favorite.deleteOne({ user: context.user?.id, movie: movie.id,});

            return true;
        }
    }
}