export interface RickAndMortyCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: RickAndMortyLocation;
  location: RickAndMortyLocation;
  image: string;
  episode: string[];
  url: string;
  created: Date;
}

export interface RickAndMortyLocation {
  name: string;
  url: string;
}

export interface RickAndMortyLocationDTO {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: Date;
}
