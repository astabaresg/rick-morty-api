import Character from "../../data/sequelize/models/character";
import { RickAndMortyCharacter } from "../../domain/interfaces/rick-morty-character";
import logger from "../../config/logger";
import { getCharacters } from "./rickandmortyapi.service";

const populateDatabase = async () => {
  const characterCount = await Character.count();

  if (characterCount > 0) {
    logger.info("Database already populated with characters");
    return;
  }

  // const characters = data.results.slice(0, 15);
  const characters: RickAndMortyCharacter[] = (await getCharacters({})).splice(
    0,
    15
  );

  await Character.bulkCreate(
    characters.map((character: RickAndMortyCharacter) => ({
      orginal_id: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      gender: character.gender,
      origin: character.origin.name,
    })),
    { ignoreDuplicates: true }
  );

  logger.info("Database populated with characters");
};

export default populateDatabase;