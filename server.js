require('dotenv').config();
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

const TMDB_API_KEY = process.env.TMDB_API_KEY || '5c8f27038de81faa96a2b90bafe5c536';
const CACHE_TTL = 3600 * 1000; // 1 hour
const cache = new Map();

const manifest = {
    id: 'org.stremio.tmdbsimilar',
    version: '1.0.0',
    name: 'TMDb Similar Movies',
    description: 'Find similar movies powered by TMDb',
    resources: ['similar'],
    types: ['movie'],
    idPrefixes: ['tt'],
    catalogs: []
};

async function fetchFromTMDb(endpoint) {
    const cacheKey = endpoint;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3${endpoint}?api_key=${TMDB_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`TMDb API error: ${response.status}`);
        }

        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    } catch (error) {
        console.error('TMDb API error:', error);
        return null;
    }
}

async function getSimilarMovies(movieId) {
    const data = await fetchFromTMDb(`/movie/${movieId}/similar`);
    if (!data || !data.results) return [];

    return data.results.slice(0, 10).map(movie => ({
        id: `tt${movie.id}`,
        name: movie.title,
        type: 'movie',
        poster: movie.poster_path ? 
            `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    }));
}

const builder = new addonBuilder(manifest);

builder.defineSimilarHandler(async ({ type, id }) => {
    if (type !== 'movie') {
        return { similar: [] };
    }

    try {
        const movieId = id.replace('tt', '');
        const similar = await getSimilarMovies(movieId);

        return { similar };
    } catch (error) {
        console.error('Error in similar handler:', error);
        return { similar: [] };
    }
});

const port = process.env.PORT || 3000;
serveHTTP(builder.getInterface(), { port });