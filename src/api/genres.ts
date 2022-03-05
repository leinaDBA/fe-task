export type GenresConfig = {
  id: number;
  name: string;
};

export const fetchGenres = async (): Promise<GenresConfig[]> => {
  const response = await fetch('./genres.json');
  return response.json();
};
