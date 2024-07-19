import axios from "axios";
import redisClient from "../config/redis";
import Character from "../models/character";
import { logExecutionTime } from "../decorators/log-execution-time.decorator";

const time: number = 10; // Time in seconds

export class QueryResolvers {
  @logExecutionTime
  async characters(_: any, args: any) {
    const cacheKey = `characters:${JSON.stringify(args)}`;
    const cachedCharacters = await redisClient.get(cacheKey);

    if (cachedCharacters) {
      return JSON.parse(cachedCharacters);
    }

    const characters = await Character.findAll({ where: args });

    if (characters.length > 0) {
      await redisClient.set(cacheKey, JSON.stringify(characters), {
        EX: time, // Expire time in seconds
      });
      return characters;
    }

    // Fetch from Rick and Morty API if not found in local DB
    const { data } = await axios.get(
      "https://rickandmortyapi.com/api/character",
      { params: args }
    );
    const apiCharacters = data.results;

    if (apiCharacters.length > 0) {
      const newCharacters = apiCharacters.map((character: any) => ({
        name: character.name,
        status: character.status,
        species: character.species,
        gender: character.gender,
        origin: character.origin.name,
      }));

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
