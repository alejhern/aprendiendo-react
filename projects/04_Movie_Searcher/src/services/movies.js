const API_URL = 'http://www.omdbapi.com/?apikey=#API_KEY#&s=#SEARCH#'
const API_KEY = 'b940cbee'

export const searchMovies = async ({ search }) => {
    if (search === '') return null;
    console.log('Searching movies with name:', search);
    try {
        const response = await fetch(
            API_URL.replace('#API_KEY#', API_KEY).replace('#SEARCH#', encodeURIComponent(search))
        );
        const data = await response.json();
        const movies = data.Search;
        return movies?.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster
        }))
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw new Error('Failed to fetch movies');
    }
}
