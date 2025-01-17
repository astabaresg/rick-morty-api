import redisClient from "../../config/redis";
import Character from "../../data/sequelize/models/character";
import { logExecutionTime } from "../../utils/decorators/log-execution-time.decorator";
import { RickAndMortyCharacter } from "../../domain/interfaces/rick-morty-character";
import Location from "../../data/sequelize/models/location";
import { Op } from "sequelize";
import { findOrCreateLocation } from "../services/location.service";
import { getCharacters } from "../services/rickandmortyapi.service";

const time: number = 10; // Time in seconds

/**
 * Resolver class for handling queries related to characters.
 */
export class QueryResolvers {
  /**
   * Retrieves characters based on the provided arguments.
   * @param _ The parent object, which is not used in this resolver.
   * @param args The arguments passed to the resolver, including filters for name, status, species, gender, and origin.
   * @returns A promise that resolves to an array of characters matching the provided filters.
   */
  @logExecutionTime
  async characters(_: any, args: any): Promise<Character[]> {
    const cacheKey = `characters:${JSON.stringify(args)}`;
    const cachedCharacters = await redisClient.get(cacheKey);

    const { name, status, species, gender, origin } = args;

    // Return cached characters if found
    if (cachedCharacters) {
      return JSON.parse(cachedCharacters);
    }

    // Build the where clause for the character query
    const characterWhereClause: any = {};
    const locationWhereClause: any = {};

    if (name) {
      characterWhereClause.name = { [Op.iLike]: `%${name}%` };
    }
    if (status) {
      characterWhereClause.status = status;
    }
    if (species) {
      characterWhereClause.species = species;
    }
    if (gender) {
      characterWhereClause.gender = gender;
    }
    if (origin) {
      locationWhereClause.name = { [Op.iLike]: `%${origin}%` };
    }

    // Find characters in the local DB
    const characters = await Character.findAll({
      where: characterWhereClause,
      include: [
        {
          model: Location,
          as: "origin",
          where: locationWhereClause,
        },
        { model: Location, as: "location" },
      ],
      order: [["id", "ASC"]],
    });

    // Return characters if found in local DB
    if (characters.length > 0) {
      // Cache the characters
      await redisClient.set(cacheKey, JSON.stringify(characters), {
        EX: time, // Expire time in seconds
      });
      return characters;
    }

    // Fetch from Rick and Morty API if not found in local DB
    const apiCharacters: RickAndMortyCharacter[] = await getCharacters(args);
    if (apiCharacters.length > 0) {
      // Create new characters in the local DB
      const newCharacters = await Promise.all(
        apiCharacters.map(async (character: RickAndMortyCharacter) => {
          const origin = await findOrCreateLocation(character.origin);
          const location = await findOrCreateLocation(character.location);

          return {
            original_id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            gender: character.gender,
            originId: origin?.id ?? null,
            locationId: location?.id ?? null,
          };
        })
      );

      // Bulk create the new characters
      const charactersToReturn = await Character.bulkCreate(newCharacters);

      await redisClient.set(cacheKey, JSON.stringify(charactersToReturn), {
        EX: time, // Expire time in seconds
      });

      return charactersToReturn;
    }

    return [];
  }
}

export const resolvers = {
  Query: new QueryResolvers(),
};
