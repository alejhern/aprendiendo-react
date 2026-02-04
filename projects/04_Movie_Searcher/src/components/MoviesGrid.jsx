import './styles/MoviesGrid.css'

export function MoviesGrid({ movies }) {
  const hasMovies = movies?.length > 0

  return (
    <main>
      {
        hasMovies ? (
          <section className="results">
            {movies.map(movie => (
              <article key={movie.id} className="movie">
                <img src={movie.poster} alt={`Poster of ${movie.title}`} />
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
              </article>
            ))}
          </section>
        ) : (
          <section className="no-results">
            {movies 
              ? <p>No movies found. Try another search.</p>
              : <p>Search for movies to see results.</p>
            }
          </section>
        )
      }
    </main>
  )
}
