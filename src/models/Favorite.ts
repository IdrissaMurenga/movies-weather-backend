import mongoose from "mongoose";
import { ref } from "process";

const { Schema, model } = mongoose

const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    }
}, { timestamps: true })

favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });

const Favorite = model("Favorite", favoriteSchema)

export default Favorite