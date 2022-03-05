import { useEffect, useState } from 'react';

import { fetchGenres, fetchMovies, GenresDTO, MovieDTO } from './api'; // you may add functionality to these functions, but please use them
import Filters, { SelectedGenre } from './components/Filters';
import Movie from './components/Movie';
import styles from './styles.module.css';


const marshallMovies = (movies: MovieDTO[], genres: GenresDTO[]) => {
  return movies
    .sort((a, b) => (a.popularity < b.popularity ? 1 : -1)) // sort by popularity
    .map((movie) => ({ // add genre names to the DTO
      ...movie,
      genreNames: movie.genre_ids.map((genreId: number) =>
        genres.find(({ id }) => id === genreId)!['name']), // get genre names from the genreDTO
    }))
};

type Movies = (MovieDTO & { genreNames: string[] })[];

const App = () => {
  const [movies, setMovies] = useState<Movies>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movies>([]);
  const [selectedGenres, setSelectedGenres] = useState<SelectedGenre>({});
  const [rating, setRating] = useState(0);

  useEffect(() => {
    Promise.all([fetchMovies(), fetchGenres()]).then(([movies, genres]) => {
      const newMovies = marshallMovies(movies, genres)
      setMovies(newMovies);

      const newGenres: SelectedGenre = {};
      newMovies.forEach((movie) => {
        movie.genreNames.forEach((genre) => {
          // assign only genres which are available in the movies
          newGenres[genre] = false;
        });
      });
      setSelectedGenres(newGenres);
    });
  }, []);

  useEffect(() => {
    let genreFilteredMovies: Movies = movies;

    /**
     * only apply filters if there is at least one applied
     * */
    const hasFilters = Object.values(selectedGenres).some((value) => value);
    if (hasFilters) {
      /**
       * for each genre I am reducing the movies
       *
       * 1. iterate over all genres
       *    this could have been replaced with two steps
       *    a. filter for only selected genres
       *    b. iterate over the filtered genres
       * 2. if the genre has not been selected, return all (accumulated) movies
       * 3. if the genre is selected, filter the accumulated movies for the genre
       * 4. repeat until all genres have been checked
       * 5. return filtered movies
       * */
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

    /**
     * further filter the movie list by rating
     * */
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
