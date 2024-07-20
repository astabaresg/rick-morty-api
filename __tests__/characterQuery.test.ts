import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import redisClient from "../src/config/redis";
import Character from "../src/data/sequelize/models/character";
import { QueryResolvers } from "../src/infraestructure/resolvers/query";

const mock = new MockAdapter(axios);

// Mock Redis methods
jest.mock("../src/config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock("../src/data/sequelize/models/character", () => ({
  findAll: jest.fn(),
  bulkCreate: jest.fn(),
}));

describe("Character Search Query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return characters from cache if available", async () => {
    // Arrange
    const cachedCharacters = [{ name: "Rick" }];
    (redisClient.get as jest.Mock).mockResolvedValue(
      JSON.stringify(cachedCharacters)
    );

    const resolver = new QueryResolvers();

    // Act
    const result = await resolver.characters(null, { name: "Rick" });

    // Assert
    expect(redisClient.get).toHaveBeenCalledWith('characters:{"name":"Rick"}');
    expect(result).toEqual(cachedCharacters);
  });

  it("should return characters from the database if not in cache", async () => {
    // Arrange
    const dbCharacters = [{ name: "Morty" }];
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Character.findAll as jest.Mock).mockResolvedValue(dbCharacters);
    (redisClient.set as jest.Mock).mockResolvedValue("OK");

    const resolver = new QueryResolvers();

    // Act
    const result = await resolver.characters(null, { name: "Morty" });

    // Assert
    expect(redisClient.get).toHaveBeenCalledWith('characters:{"name":"Morty"}');
    expect(Character.findAll).toHaveBeenCalledWith({
      where: { name: "Morty" },
    });
    expect(redisClient.set).toHaveBeenCalledWith(
      'characters:{"name":"Morty"}',
      JSON.stringify(dbCharacters),
      { EX: 10 }
    );
    expect(result).toEqual(dbCharacters);
  });

  it("should return characters from the API if not in cache or database", async () => {
    // Arrange
    const apiCharacters = [
      {
        id: 1,
        name: "Summer",
        status: "Alive",
        species: "Human",
        gender: "Female",
        origin: { name: "Earth" },
      },
    ];
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Character.findAll as jest.Mock).mockResolvedValue([]);
    mock
      .onGet("https://rickandmortyapi.com/api/character", {
        params: { name: "Summer" },
      })
      .reply(200, { results: apiCharacters });
    (Character.bulkCreate as jest.Mock).mockResolvedValue(apiCharacters);
    (redisClient.set as jest.Mock).mockResolvedValue("OK");

    const resolver = new QueryResolvers();

    // Act
    const result = await resolver.characters(null, { name: "Summer" });

    // Assert
    expect(redisClient.get).toHaveBeenCalledWith(
      'characters:{"name":"Summer"}'
    );
    expect(Character.findAll).toHaveBeenCalledWith({
      where: { name: "Summer" },
    });
    expect(mock.history.get.length).toBe(1);
    expect(Character.bulkCreate).toHaveBeenCalledWith([
      {
        orginal_id: 1,
        name: "Summer",
        status: "Alive",
        species: "Human",
        gender: "Female",
        origin: "Earth",
      },
    ]);
    expect(redisClient.set).toHaveBeenCalledWith(
      'characters:{"name":"Summer"}',
      JSON.stringify(apiCharacters),
      { EX: 10 }
    );
    expect(result).toEqual(apiCharacters);
  });

  it("should return an empty array if no characters are found", async () => {
    // Arrange
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Character.findAll as jest.Mock).mockResolvedValue([]);
    mock
      .onGet("https://rickandmortyapi.com/api/character", {
        params: { name: "NonExistentName" },
      })
      .reply(200, { results: [] });

    const resolver = new QueryResolvers();

    // Act
    const result = await resolver.characters(null, { name: "NonExistentName" });

    // Assert
    expect(redisClient.get).toHaveBeenCalledWith(
      'characters:{"name":"NonExistentName"}'
    );
    expect(Character.findAll).toHaveBeenCalledWith({
      where: { name: "NonExistentName" },
    });
    expect(result).toEqual([]);
  });
});
