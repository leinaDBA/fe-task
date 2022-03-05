import { FC } from 'react';

import styles from '../styles.module.css';

type MovieProps = {
  title: string;
  description: string;
  rating: number;
  popularity: number;
  image: string;
  genres: string[];
};

const Movie: FC<MovieProps> = ({
  image,
  title,
  description,
  rating,
  popularity,
  genres,
}) => {
  const currentGenres = [...genres];
  const lastGenre = currentGenres.pop();
  const genresText = `${currentGenres.join(', ')} and ${lastGenre}`;

  return (
    <div className={styles.movie}>
      <h2 className={styles['movie-title']}>{title}</h2>
      <p className={styles['movie-content']}>{description}</p>
      <div className={styles['movie-meta']}>
        <p>Rating: {rating}/10</p>
        <p>Popularity: {popularity}</p>
        <p>Genres: {genresText}</p>
      </div>
      <img
        className={styles['movie-image']}
        src={`https://image.tmdb.org/t/p/w500${image}`}
        alt={title}
      />
    </div>
  );
};

export default Movie;
