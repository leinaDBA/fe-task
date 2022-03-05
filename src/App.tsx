import { useEffect, useState } from 'react';

import { fetchGenres, fetchMovies, GenresConfig, MovieConfig } from './api'; // you may add functionality to these functions, but please use them
import Filters, { SelectedGenre } from './components/Filters';
import Movie from './components/Movie';
import styles from './styles.module.css';

const createGetGenreName = (genres: GenresConfig[]) => (genreId: number) =>
  genres.find(({ id }) => id === genreId)!['name'];

type Movies = (MovieConfig & { genreNames: string[] })[];

const App = () => {
  const [movies, setMovies] = useState<Movies>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movies>([]);
  const [selectedGenres, setSelectedGenres] = useState<SelectedGenre>({});
  const [rating, setRating] = useState(0);

  useEffect(() => {
    Promise.all([fetchMovies(), fetchGenres()]).then(([movies, genres]) => {
      const getGenreName = createGetGenreName(genres);
      const sortedMovies = movies
        .sort((a, b) => (a.popularity < b.popularity ? 1 : -1))
        .map((movie) => ({
          ...movie,
          genreNames: movie.genre_ids.map(getGenreName),
        }));
      setMovies(sortedMovies);

      const newGenres: SelectedGenre = {};
      sortedMovies.forEach((movie) => {
        movie.genreNames.forEach((genre) => {
          newGenres[genre] = false;
        });
      });
      setSelectedGenres(newGenres);
    });
  }, []);

  useEffect(() => {
    const hasFilters = Object.values(selectedGenres).some((value) => value);

    let genreFilteredMovies: Movies = movies;
    if (hasFilters) {
      genreFilteredMovies = Object.entries(selectedGenres).reduce<Movies>(
        (acc, [genre, selected]) => {
          if (!selected) {
            return acc;
          }
          return acc.filter((movie) => {
            return movie.genreNames.includes(genre);
          });
        },
        movies
      );
    }

    const ratingFilteredMovies = genreFilteredMovies.filter(
      ({ vote_average: movieRating }) => movieRating > rating
    );

    setFilteredMovies(ratingFilteredMovies);
  }, [selectedGenres, rating]);

  return (
    <div className={styles.container}>
      <h1 className={styles.full}>
        <span>
          <span role="img" aria-label="Popcorn emoji">
            🍿
          </span>{' '}
          Now playing
        </span>
      </h1>
      <Filters
        genres={selectedGenres}
        updateSelectedGenres={setSelectedGenres}
        rating={rating}
        updateRating={setRating}
      />
      <div className={styles.movies}>
        <div>
          Showing {filteredMovies.length} movie
          {filteredMovies.length !== 1 ? 's' : ''}
        </div>
        {filteredMovies.map((movie, index) => (
          <Movie
            key={index}
            title={movie.original_title}
            description={movie.overview}
            rating={movie.vote_average}
            popularity={movie.popularity}
            image={movie.poster_path}
            genres={movie.genreNames}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
