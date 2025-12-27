// TMDB genre IDs (as of Dec 2025)
const GENRE_IDS = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    SciFi: 878,
    TVMovie: 10770,
    Thriller: 53,
    War: 10752,
    Western: 37,
    Suspense: 53 // Suspense is usually mapped to Thriller (53)
}

export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: ' application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchMoviesByGenre = async (genre: keyof typeof GENRE_IDS) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${GENRE_IDS[genre]}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })
    if (!response.ok) {
        throw new Error('Failed to fetch movies by genre');
    }
    const data = await response.json();
    return data.results;
}

export const fetchTrendingMoviesOfMonth = async () => {
    // TMDB trending endpoint only supports day/week, so for month, use discover with sort by popularity and release date in last 30 days
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    const from = lastMonth.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];
    const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&primary_release_date.gte=${from}&primary_release_date.lte=${to}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })
    if (!response.ok) {
        throw new Error('Failed to fetch trending movies of the month');
    }
    const data = await response.json();
    return data.results;
}

export const fetchMovies = async ({ query }: { query: string }) => {
    const endpoint = query ?
    `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
    `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })

    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch movies', response.statusText);
    }

    const data = await response.json();
    console.log('Fetched movies:', data.results.length);
    return data.results;
}

export const fetchMovieDetails = async (id: string | number) => {
    const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${id}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })

    if (!response.ok) {
        // @ts-ignore
        throw new Error('Failed to fetch movie details', response.statusText);
    }

    const data = await response.json();
    return data;
}
