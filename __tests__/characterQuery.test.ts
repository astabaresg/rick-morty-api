import { Op } from "sequelize";
import redisClient from "../src/config/redis";
import Character from "../src/data/sequelize/models/character";
import { QueryResolvers } from "../src/infraestructure/resolvers/query";
import Location from "../src/data/sequelize/models/location";
import { getCharacters } from "../src/infraestructure/services/rickandmortyapi.service";
import { findOrCreateLocation } from "../src/infraestructure/services/location.service";

// Mock Redis methods
jest.mock("../src/config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock("../src/data/sequelize/models/character", () => ({
  findAll: jest.fn(),
  bulkCreate: jest.fn(),
}));

jest.mock("../src/infraestructure/services/rickandmortyapi.service", () => ({
  getCharacters: jest.fn(),
}));

jest.mock("../src/infraestructure/services/location.service", () => ({
  findOrCreateLocation: jest.fn(),
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
    const dbCharacters = [
      { name: "Morty", origin: { name: "Earth" }, location: { name: "Earth" } },
    ];
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Character.findAll as jest.Mock).mockResolvedValue(dbCharacters);
    (redisClient.set as jest.Mock).mockResolvedValue("OK");

    const resolver = new QueryResolvers();

    // Act
    const result = await resolver.characters(null, { name: "Morty" });

    // Assert
    expect(redisClient.get).toHaveBeenCalledWith('characters:{"name":"Morty"}');
    expect(Character.findAll).toHaveBeenCalledWith({
      where: { name: { [Op.iLike]: "%Morty%" } },
      include: [
        {
          model: Location,
          as: "origin",
          where: {},
        },
        { model: Location, as: "location" },
      ],
      order: [["id", "ASC"]],
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
        origin: {
          name: "Earth",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        location: {
          name: "Earth",
          url: "https://rickandmortyapi.com/api/location/1",
        },
      },
    ];
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (Character.findAll as jest.Mock).mockResolvedValue([]);
    (findOrCreateLocation as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Earth",
    });
    (getCharacters as jest.Mock).mockResolvedValue(apiCharacters);
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
      where: { name: { [Op.iLike]: "%Summer%" } },
      include: [
        {
          model: Location,
          as: "origin",
          where: {},
        },
        { model: Location, as: "location" },
      ],
      order: [["id", "ASC"]],
    });

    expect(getCharacters).toHaveBeenCalledTimes(1);
    expect(findOrCreateLocation).toHaveBeenCalledTimes(2);
    expect(Character.bulkCreate).toHaveBeenCalledWith([
      {
        original_id: 1,
        name: "Summer",
        status: "Alive",
        species: "Human",
        gender: "Female",
        originId: 1,
        locationId: 1,
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
    (getCharacters as jest.Mock).mockResolvedValue([]);

    const resolver = new QueryResolvers();

    // Act
    const result = await resolver.characters(null, { name: "NonExistentName" });

    // Assert
    expect(redisClient.get).toHaveBeenCalledWith(
      'characters:{"name":"NonExistentName"}'
    );
    expect(Character.findAll).toHaveBeenCalledWith({
      where: { name: { [Op.iLike]: "%NonExistentName%" } },
      include: [
        {
          model: Location,
          as: "origin",
          where: {},
        },
        { model: Location, as: "location" },
      ],
      order: [["id", "ASC"]],
    });
    expect(getCharacters).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
