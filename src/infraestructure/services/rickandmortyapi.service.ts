import axios from "axios";
import { RickAndMortyCharacter } from "../../domain/interfaces/rick-morty-character";
import logger from "../../config/logger";

const baseUrl: string = "https://rickandmortyapi.com/api/character";

/**
 * Retrieves a list of Rick and Morty characters based on the provided arguments.
 *
 * @param args - The arguments to be passed to the API request.
 * @returns A promise that resolves to an array of RickAndMortyCharacter objects.
 */
export const getCharacters = async (
  args: any
): Promise<RickAndMortyCharacter[]> => {
  const { data } = await axios.get<{ results: RickAndMortyCharacter[] }>(
    baseUrl,
    { params: args }
  );

  return data.results;
};

/**
 * Fetches characters by their IDs from the Rick and Morty API.
 * @param ids - An array of character IDs.
 * @returns A promise that resolves to an array of RickAndMortyCharacter objects.
 */
export const fetchCharactersByIds = async (
  ids: number[]
): Promise<RickAndMortyCharacter[]> => {
  const batches = [];
  for (let i = 0; i < ids.length; i += 20) {
    batches.push(ids.slice(i, i + 20));
  }

  const characters: RickAndMortyCharacter[] = [];

  for (const batch of batches) {
    try {
      const { data } = await axios.get<RickAndMortyCharacter[]>(
        `${baseUrl}/${batch.join(",")}`
      );
      characters.push(...data);
    } catch (e) {
      logger.error("Error fetching characters by ids", e);
    }
  }

  return characters;
};
