import Movie from "../models/Movie.js";
import Favorites from "../models/Favorite.js";
import { GraphQLError } from "graphql";
import { configEnv } from "../config/env.js";

const apikey = configEnv.OMDB_API_KEY
const provider = configEnv.MOVIE_PROVIDER
export const searchMovie = async (query: string, page: number = 1) => {
    try {
        
        const url = `${provider}?apikey=${apikey}&s=${encodeURIComponent(query)}&page=${page}`
        const res = await fetch(url)

        if (!res.ok) {
            throw new GraphQLError("Failed to fetch movies from OMDb");
        }
    
        const data = await res.json()

        if (data.Response === 'False') {
            if (data.Error === "Movie not Found") {
                return {
                    Search: [],
                    totalResults: 0,
                    page,hasMore: false
                }
            }
            throw new GraphQLError(data.Error || "OMDb search failed")
        }

        const movies = (data.Search || []).map((movie: any) => ({
            imdbID: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            type: movie.Type,
            poster: movie.Poster === "N/A"? movie.Poster : ""
        }))

        const total = Number(data.totalResult || 0);
        const hasMore = page * 10 < total


        return {movies, totalResult: total, page, hasMore}
    } catch (error: any) {
        throw new GraphQLError(error.message)
    }
}