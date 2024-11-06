const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const manifest = require('./manifest');
const { getMovieRecommendations, getPopularMovies } = require('./tmdb');
const config = require('./config');

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(async ({ type, id, extra }) => {
    if (type !== 'movie' || id !== 'tmdb.popular') {
        return { metas: [] };
    }

    try {
        const skip = extra.skip ? parseInt(extra.skip) : 0;
        const metas = await getPopularMovies(skip);
        return { metas };
    } catch (error) {
        console.error('Error in catalog handler:', error);
        return { metas: [] };
    }
});

builder.defineMetaHandler(async ({ type, id }) => {
    if (type !== 'movie') {
        return { meta: null };
    }

    try {
        const movieId = id.replace('tt', '');
        const recommendations = await getMovieRecommendations(movieId);
        
        return {
            meta: {
                id,
                type,
                recommendations
            }
        };
    } catch (error) {
        console.error('Error in meta handler:', error);
        return { meta: null };
    }
});

serveHTTP(builder.getInterface(), { port: config.PORT });