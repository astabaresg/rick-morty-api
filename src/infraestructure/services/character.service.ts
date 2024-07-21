import logger from "../../config/logger";
import redisClient from "../../config/redis";
import Character from "../../data/sequelize/models/character";
import { RickAndMortyCharacter } from "../../domain/interfaces/rick-morty-character";
import { fetchCharactersByIds } from "./rickandmortyapi.service";

/**
 * Updates characters in the database based on the latest data from the Rick and Morty API.
 * @returns A Promise that resolves to void.
 */
export const updateCharactersInDatabase = async (): Promise<void> => {
  logger.info("Running the character update job");

  try {
    const characters: Character[] = await Character.findAll();
    if (characters.length === 0) {
      logger.info("No characters to update");
      return;
    }

    const ids: number[] = characters.map((character) => character.original_id);
    const charactersUpdated: RickAndMortyCharacter[] =
      await fetchCharactersByIds(ids);

    for (const character of charactersUpdated) {
      const characterToUpdate = characters.find(
        (c) => c.original_id === character.id
      );
      if (!characterToUpdate) continue;

      const {
        name,
        status,
        species,
        gender,
        origin: { name: originName },
      } = character;

      // Update the character if any of the fields have changed
      if (
        characterToUpdate.name !== name ||
        characterToUpdate.status !== status ||
        characterToUpdate.species !== species ||
        characterToUpdate.gender !== gender
      ) {
        await Character.update(
          {
            name,
            status,
            species,
            gender,
          },
          { where: { original_id: character.id } }
        );
      }
    }

    // Clear the cache after updating the characters
    await redisClient.flushDb();

    logger.info("Character update job finished");
  } catch (error) {
    logger.error(`Error updating characters: ${error}`);
  }
};
