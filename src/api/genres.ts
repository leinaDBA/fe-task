export type GenresDTO = {
  id: number;
  name: string;
};

export const fetchGenres = async (): Promise<GenresDTO[]> => {
  const response = await fetch('./genres.json');
  return response.json();
};
