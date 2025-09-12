import mongoose from "mongoose";

const { model, Schema } = mongoose;

const movieSchema = new Schema({
    provider: {
        type: String,
        required: true,
        default: "omdb",
        index: true
    },
    imdbID: {
      type: String,
      required: true,
      trim: true,
      index: true
    }, 
    title: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      trim: true
    },
    poster: {
      type: String,
      trim: true
    },
})

movieSchema.index({ provider: 1, imdbID: 1 }, { unique: true })

const Movie = model("Movie", movieSchema)

export default Movie