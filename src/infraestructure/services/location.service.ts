import axios from "axios";
import Location from "../../data/sequelize/models/location";
import {
  RickAndMortyLocation,
  RickAndMortyLocationDTO,
} from "../../domain/interfaces/rick-morty-character";

/**
 * Seeds the locations with an unknown location if it doesn't exist already.
 */
export const seedLocations = async () => {
  const unknownLocation = {
    original_id: null,
    name: "unknown",
    type: "unknown",
    dimension: "unknown",
  };

  await Location.findOrCreate({
    where: { name: unknownLocation.name },
    defaults: unknownLocation,
  });
};

/**
 * Finds or creates a location based on the provided RickAndMortyLocation object.
 * @param location - The RickAndMortyLocation object containing the location details.
 * @returns A Promise that resolves to the created or existing Location object, or null if no location is found.
 */
export const findOrCreateLocation = async (
  location: RickAndMortyLocation
): Promise<Location | null> => {
  if (!location.url) {
    return Location.findOne({
      where: { name: "unknown" },
    });
  }

  let existingLocation: Location | null = await Location.findOne({
    where: { name: location.name },
  });
  if (existingLocation) {
    return existingLocation;
  }

  const locationResponse = await axios.get<RickAndMortyLocationDTO>(
    location.url
  );
  const apiLocation: RickAndMortyLocationDTO = locationResponse.data;

  existingLocation = await Location.create({
    original_id: apiLocation.id,
    name: apiLocation.name,
    type: apiLocation.type,
    dimension: apiLocation.dimension,
  });

  return existingLocation;
};
