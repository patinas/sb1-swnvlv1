const fetch = require('node-fetch');
const config = require('./config');

const cache = new Map();

async function fetchFromTMDb(endpoint) {
    const cacheKey = endpoint;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < config.CACHE_TTL) {
        return cached.data;
    }

    try {
        const response = await fetch(
            `${config.TMDB_BASE_URL}${endpoint}?api_key=${config.TMDB_API_KEY}`
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

async function getMovieRecommendations(movieId) {
    const data = await fetchFromTMDb(`/movie/${movieId}/recommendations`);
    if (!data || !data.results) return [];

    return data.results.slice(0, 10).map(movie => ({
        id: `tt${movie.id}`,
        type: 'movie',
        name: movie.title,
        poster: movie.poster_path ? 
            `${config.TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        description: movie.overview,
        releaseInfo: movie.release_date?.split('-')[0] || '',
        imdbRating: movie.vote_average
    }));
}

async function getPopularMovies(skip = 0) {
    const data = await fetchFromTMDb(`/movie/popular`);
    if (!data || !data.results) return [];

    return data.results.slice(skip, skip + 10).map(movie => ({
        id: `tt${movie.id}`,
        type: 'movie',
        name: movie.title,
        poster: movie.poster_path ? 
            `${config.TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        description: movie.overview,
        releaseInfo: movie.release_date?.split('-')[0] || '',
        imdbRating: movie.vote_average
    }));
}

module.exports = {
    getMovieRecommendations,
    getPopularMovies
};