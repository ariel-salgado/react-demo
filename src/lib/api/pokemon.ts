export interface Generation {
  name: string;
  url: string;
}

export interface PokemonSpecies {
  name: string;
  id: number;
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string | null;
}

interface GenerationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Generation[];
}

interface GenerationDetailsResponse {
  id: number;
  name: string;
  pokemon_species: {
    name: string;
    url: string;
  }[];
}

interface PokemonResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    back_default?: string | null;
    front_shiny?: string | null;
    back_shiny?: string | null;
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
}

const POKEMON_API_URL = 'https://pokeapi.co/api/v2';

class PokemonAPI {
  async getGenerations(limit: number = 8): Promise<Generation[]> {
    const response = await fetch(`${POKEMON_API_URL}/generation`);

    if (!response.ok) {
      throw new Error(`Failed to fetch generations: ${response.status}`);
    }

    const data: GenerationListResponse = await response.json();
    return data.results.slice(0, limit);
  }

  async getGenerationDetails(generationName: string): Promise<PokemonSpecies[]> {
    const response = await fetch(`${POKEMON_API_URL}/generation/${generationName}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch generation details: ${response.status}`);
    }

    const data: GenerationDetailsResponse = await response.json();
    
    return data.pokemon_species
      .map(s => {
        const idStr = s.url.split('/').filter(Boolean).pop();
        const id = idStr ? parseInt(idStr, 10) : NaN;
        return { name: s.name, id };
      })
      .filter((s): s is PokemonSpecies => !isNaN(s.id))
      .sort((a, b) => a.id - b.id);
  }

  async getPokemon(id: number): Promise<Pokemon> {
    const response = await fetch(`${POKEMON_API_URL}/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon ${id}: ${response.status}`);
    }

    const data: PokemonResponse = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default
    };
  }

  async getPokemonBatch(speciesList: PokemonSpecies[]): Promise<Pokemon[]> {
    return Promise.all(speciesList.map(s => this.getPokemon(s.id)));
  }
}

export const pokemonAPI = new PokemonAPI();