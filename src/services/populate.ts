import axios from "axios";
import Character from "../models/character";

const populateDatabase = async () => {
  const characterCount = await Character.count();

  if (characterCount > 0) {
    console.log("Database already populated with characters");
    return;
  }

  const { data } = await axios.get("https://rickandmortyapi.com/api/character");
  const characters = data.results.slice(0, 15);

  await Character.bulkCreate(
    characters.map((character: any) => ({
      name: character.name,
      status: character.status,
      species: character.species,
      gender: character.gender,
      origin: character.origin.name,
    })),
    { ignoreDuplicates: true }
  );

  console.log("Database populated with initial characters");
};

export default populateDatabase;
