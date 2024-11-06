require('dotenv').config();

module.exports = {
    TMDB_API_KEY: process.env.TMDB_API_KEY || '5c8f27038de81faa96a2b90bafe5c536',
    PORT: process.env.PORT || 3000,
    CACHE_TTL: 3600 * 1000, // 1 hour
    TMDB_BASE_URL: 'https://api.themoviedb.org/3',
    TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500'
};