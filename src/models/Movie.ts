import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const movieSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imdbID: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

movieSchema.index({ provider: 1, imdbID: 1 }, { unique: true });

const Movie = model('Movie', movieSchema);

export default Movie;
