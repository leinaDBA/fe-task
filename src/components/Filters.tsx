import { Dispatch, FC, SetStateAction, useCallback } from 'react';

import styles from '../styles.module.css';

type FilterProps = {
  genre: string;
  selected: boolean;
  handleChange: (genre: string, selected: boolean) => void;
};

const GenreCheckbox: FC<FilterProps> = ({ genre, selected, handleChange }) => {
  return (
    <div className={styles.filter}>
      <div>{genre}</div>
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => {
          handleChange(genre, e.target.checked);
        }}
      />
    </div>
  );
};

export type SelectedGenre = Record<string, boolean>;

type FiltersProps = {
  genres: SelectedGenre;
  updateSelectedGenres: Dispatch<SetStateAction<SelectedGenre>>;
  rating: number;
  updateRating: Dispatch<SetStateAction<number>>;
};

const Filters: FC<FiltersProps> = ({
  genres,
  updateSelectedGenres,
  rating,
  updateRating,
}) => {
  /**
   * apply only the new value of the checked genre
   *
   * this callback is only created once because it has no dependencies
   * this is a nice little optimization.
   *
   * 'updateSelectedGenres' is not a dependency that can be updated, react knows this.
   *
   * to deal with unnecessarily passing in the 'selectedGenres' every time it
   * is updated, I can just use the current state of the 'selectedGenres'
   * */
  const handleCheckboxChange = useCallback(
    (genre: string, selected: boolean) => {
      updateSelectedGenres((currentGenres) => {
        return { ...currentGenres, [genre]: selected };
      });
    },
    []
  );

  /**
   * apply the new filtered rating
   * */
  const handleRatingChange = useCallback((e) => {
    updateRating(+e.target.value);
  }, []);

  /**
   * reset all filtered genres and rating
   * */
  const handleReset = useCallback(() => {
    updateSelectedGenres((currentGenres) => {
      return Object.keys(currentGenres).reduce(
        (acc, next) => ({ ...acc, [next]: false }),
        {}
      );
    });

    updateRating(0);
  }, []);

  return (
    <>
      <div className={styles.filters}>
        {Object.entries(genres).map(([genre, selected], index) => (
          <GenreCheckbox
            genre={genre}
            selected={selected}
            key={index}
            handleChange={handleCheckboxChange}
          />
        ))}
      </div>
      <div className={styles.rating}>
        <div className={styles['rating-title']}>Minimum rating</div>
        <input
          type="number"
          min={0}
          max={10}
          step={0.5}
          value={rating}
          onChange={handleRatingChange}
        />
      </div>
      <button onClick={handleReset}>Reset all filters</button>
    </>
  );
};

export default Filters;
