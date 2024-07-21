import Character from "../../data/sequelize/models/character";
import Location from "../../data/sequelize/models/location";
import { RickAndMortyCharacter } from "../../domain/interfaces/rick-morty-character";
import logger from "../../config/logger";
import { getCharacters } from "./rickandmortyapi.service";
import axios from "axios";
import { findOrCreateLocation } from "./location.service";

const populateDatabase = async () => {
  const characterCount = await Character.count();

  if (characterCount > 0) {
    logger.info("Database already populated with characters");
    return;
  }

  const characters: RickAndMortyCharacter[] = (await getCharacters({})).splice(
    0,
    15
  );

  for (const character of characters) {
    const origin = await findOrCreateLocation(character.origin);
    const location = await findOrCreateLocation(character.location);

    await Character.create(
      {
        original_id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
        gender: character.gender,
        originId: origin?.id ?? null,
        locationId: location?.id ?? null,
      },
      { ignoreDuplicates: true }
    );
  }

  logger.info("Database populated with characters");
};

export default populateDatabase;
