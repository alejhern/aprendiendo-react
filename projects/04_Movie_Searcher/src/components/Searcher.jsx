import './styles/Searcher.css'

export function Searcher({ handleSubmit, sort, handlerSearchChange }) {
  return (
    <form className="form movie-search" onSubmit={handleSubmit}>
      <label htmlFor="search">SEARCH MOVIE</label>
      <input type="text" name="search" id="search" onChange={handlerSearchChange} placeholder="Star Wars, The Matrix, Inception..." />
      <label htmlFor="sort">sort by title</label>
      <input type="checkbox" name="sort" id="sort" onChange={sort} />
      <button type="submit">Search</button>
    </form>
  )
}
