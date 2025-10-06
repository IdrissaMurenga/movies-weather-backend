import DataLoader from 'dataloader';
import User from '../models/User.js';
import { GraphQLError } from 'graphql';
import Movie from '../models/Movie.js';
import Favorite from '../models/Favorite.js';
import type { YogaInitialContext } from 'graphql-yoga';
import { verifyToken } from '../services/authServices.js';

// ─── Define context type ──────────────────────────────────────────────
export type Context = {
  request: Request;
  user?: InstanceType<typeof User>;
  loaders: {
    movieLoader: DataLoader<string, any>;
    favoritesByUserLoader: DataLoader<string, any[]>;
  };
};

// ─── Batch functions ──────────────────────────────────────────────────

const batchMovies = async (ids: readonly string[]) => {
  const movies = await Movie.find({ _id: { $in: ids } });
  return ids.map((id) => movies.find((movie) => movie.id === id) || null);
};

const batchFavoritesByUser = async (userIds: readonly string[]) => {
  const favorites = await Favorite.find({ user: { $in: userIds } });
  return userIds.map((uid) => favorites.filter((favorite) => favorite.user.toString() === uid));
};

export const context = async (initialContext: YogaInitialContext): Promise<Context> => {
  //get the HTTP request object from YogaInitialContext.
  const request = initialContext.request;

  //get authorization header
  const authHeader = request.headers.get('authorization') || '';

  // set token with baerer authorization header
  const token = authHeader.replace('Bearer ', '').trim();

  let user;

  if (token) {
    try {
      const decoded = verifyToken(token); //JwtPayload

      const hasId = !!decoded && typeof decoded === 'object' && typeof decoded.id === 'string';
      if (hasId) {
        // Only access decoded.id if we KNOW it exists
        const findUser = await User.findById(decoded.id);

        if (!findUser) throw new GraphQLError('No user found');

        user = findUser;
      }
    } catch (err: any) {
      console.error('TOKEN_VERIFICATION_ERROR:', err.message);
    }
  }

  // Create new DataLoader instances per request
  const loaders = {
    movieLoader: new DataLoader(batchMovies),
    favoritesByUserLoader: new DataLoader(batchFavoritesByUser),
  };

  // return context request and user
  return { request, user, loaders };
};
