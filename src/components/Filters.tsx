import { Dispatch, FC, SetStateAction, useCallback } from 'react';

import styles from '../styles.module.css';

type FilterProps = {
  genre: string;
  selected: boolean;
  handleChange: (genre: string, selected: boolean) => void;
};

const Filter: FC<FilterProps> = ({ genre, selected, handleChange }) => {
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
  const handleCheckBoxChange = useCallback(
    (genre: string, selected: boolean) => {
      updateSelectedGenres((currentGenres) => {
        return { ...currentGenres, [genre]: selected };
      });
    },
    []
  );

  const handleRatingChange = useCallback((e) => {
    updateRating(+e.target.value);
  }, []);

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
          <Filter
            genre={genre}
            selected={selected}
            key={index}
            handleChange={handleCheckBoxChange}
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
