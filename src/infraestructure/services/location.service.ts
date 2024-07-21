import axios from "axios";
import Location from "../../data/sequelize/models/location";
import {
  RickAndMortyLocation,
  RickAndMortyLocationDTO,
} from "../../domain/interfaces/rick-morty-character";

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
