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
            id: movie.imdbID,
            imdbID: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            type: movie.Type,
            poster: movie.Poster !== "N/A" ? movie.Poster : "",
        }))

        const total = Number(data.totalResults || 0);
        const hasMore = page * 10 < total

        return {movies, total, page, hasMore}
        
    } catch (error: any) {
        throw new GraphQLError(error.message)
    }
}

export const upsertMovie = async (imdbID: string) => {
    if (!imdbID) throw new GraphQLError("imdbID is required")
    if (!apikey) throw new GraphQLError("omdb key is missing")
    
    const movieExist = await Movie.findOne({ provider: "omdb", $or: [{ imdbId: imdbID }, { omdbId: imdbID }] })
    if (movieExist) return movieExist

    const url = `${provider}?apikey=${apikey}&i=${encodeURIComponent(imdbID)}`;

    const res = await fetch(url)
    if (!res.ok) throw new GraphQLError(`OMDb request failed (${res.status})`);
    const data = await res.json()

    const movie = await Movie.findOneAndUpdate(
        { provider: "omdb", omdbId: imdbID },
        {
            $setOnInsert: {
                provider: "omdb",
                imdbId: data.imdbID,
                omdbId: data.imdbID,
                title: data.Title,
                year: data.Year,
                type: data.Type,
                poster: data.Poster && data.Poster !== "N/A" ? data.Poster : ""
            }
        },
        { upsert: true, new: true, runValidators: true }
    )

    return movie
}