import { GraphQLError } from "graphql";
import { configEnv } from "../config/env.js";
import Movie from "../models/Movie.js";

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

    // 1) fetch movie detail from OMDb with id
    const url = `${provider}?apikey=${apikey}&i=${encodeURIComponent(imdbID)}`;
    const res = await fetch(url);

    if (!res.ok) throw new GraphQLError(`OMDb request failed (${res.status})`);

    const data = await res.json();

    if (!data || data.Response === "False") {
        throw new GraphQLError(data?.Error || "Movie not found on OMDb");
    }


    const poster = data.Poster && data.Poster !== "N/A" ? data.Poster : "";

    // 3) upsert the Movie (atomic)
    const movie = await Movie.findOneAndUpdate(
        { provider: "omdb", imdbID },
        {
            $setOnInsert: {
                provider: "omdb",
                imdbID: data.imdbID,
            },
            $set: {
                title: data.Title,
                year: data.Year,
                type: data.Type,
                poster
            },
        },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return movie
}