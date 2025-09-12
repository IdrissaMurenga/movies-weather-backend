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


export const checkMovie = async (imdbID: string) => {

    // find user in databse
    const findMovie = await Movie.findOne({ provider: "omdb", imdbID });

    if (findMovie) return findMovie;

    // check if theres an omdb api key
    if (!apikey) throw new GraphQLError("OMDb API key missing");

    // fetch movies from omdb provider
    const res = await fetch(`${provider}?apikey=${apikey}&i=${encodeURIComponent(imdbID)}`);

    if (!res.ok) throw new GraphQLError(`OMDb detail request failed (${res.status})`);

    const data = await res.json();

    if (data.Response === "False") throw new GraphQLError(data.Error || "Movie not found on OMDb");

  // 3) Upsert movie
    const existMovie = await Movie.findOneAndUpdate(
        { provider: "omdb", imdbID },
        {
            $setOnInsert: {
                provider: "omdb",
                imdbID: data.imdbID,
                title:  data.Title,
                year:   data.Year,
                type:   data.Type,
                poster: data.Poster !== "N/A" ? "" : data.Poster,
            },
        },
        { upsert: true, new: true }
    );

    return existMovie!;
}