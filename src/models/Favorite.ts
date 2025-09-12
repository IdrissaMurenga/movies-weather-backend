import mongoose from "mongoose";

const { model, Schema } = mongoose

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
})

// Prevent duplicate favorites for a user
favoriteSchema.index({ user: 1, movie: 1 }, { unique: true });

const Favorites = model('favorite', favoriteSchema)

export default Favorites