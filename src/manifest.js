module.exports = {
    id: 'org.stremio.tmdbsimilar',
    version: '1.0.0',
    name: 'TMDb Movie Recommendations',
    description: 'Find similar movies powered by TMDb',
    resources: ['catalog', 'meta'],
    types: ['movie'],
    idPrefixes: ['tt'],
    catalogs: [{
        type: 'movie',
        id: 'tmdb.popular',
        name: 'TMDb Popular Movies',
        extra: [
            {
                name: 'skip',
                isRequired: false
            }
        ]
    }]
};