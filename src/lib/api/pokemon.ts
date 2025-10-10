import { PokemonType } from '../constants'

export interface Stat {
  base_stat: number
  effort: number
  stat: { name: string }
}

export interface Type {
  slot: number
  type: { name: PokemonType }
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  cries: {
    latest: string;
    legacy: string;
  };
  sprites: {
    back_default: string
    front_default: string
    back_shiny: string
    front_shiny: string
  }
  stats: Stat[]
  types: Type[]
}

export interface Generation {
  url: string;
  name: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
}

export interface FlavorTextEntry {
  flavor_text: string
  version: string
}

const POKEMON_API_URL = 'https://pokeapi.co/api/v2';

class PokemonAPI {
  async getGenerations(limit: number = 9): Promise<Generation[]> {
    const response = await fetch(`${POKEMON_API_URL}/generation/?limit=${limit}`);

    if (!response.ok) {
      console.error(`Failed to fetch generations: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.results as Generation[];
  }

  async getPokemonListByGeneration(generation: string | number): Promise<PokemonSpecies[]> {
    const response = await fetch(`${POKEMON_API_URL}/generation/${generation}`);

    if (!response.ok) {
      console.error(`Failed to fetch generations: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    return (data.pokemon_species as Generation[])
      .map(({ name, url }) => {
        const id = Number(url.split('/').filter(Boolean).pop());
        return { name, id };
      })
      .filter((species): species is PokemonSpecies => !isNaN(species.id))
      .sort((prev, next) => prev.id - next.id) as PokemonSpecies[];
  }

  async getPokemon(id: string | number): Promise<Pokemon | null> {
    const response = await fetch(`${POKEMON_API_URL}/pokemon/${id}`);

    if (!response.ok) {
      console.error(`Failed to fetch ${id} data: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      cries: {
        latest: data.cries.latest,
      },
      sprites: {
        back_default: data.sprites.back_default,
        front_default: data.sprites.front_default,
        back_shiny: data.sprites.back_shiny,
        front_shiny: data.sprites.front_shiny,
      },
      stats: data.stats,
      types: data.types,
    } as Pokemon;
  }

  async getPokemonByGeneration(generation: string | number): Promise<(Pokemon | null)[]> {
    const pokemon_list = await this.getPokemonListByGeneration(generation);
    return Promise.all(pokemon_list.map(({ name }) => this.getPokemon(name)))
  }

  async getPokemonFlavorTexts(pokemon: string | number): Promise<FlavorTextEntry[]> {
    const response = await fetch(`${POKEMON_API_URL}/pokemon-species/${pokemon}`)

    if (!response.ok) {
      console.error(`Failed to fetch species data for ${pokemon}: ${response.status}`)
      return []
    }

    const data = await response.json()

    const entries: FlavorTextEntry[] = data.flavor_text_entries
      .filter((entry: any) => entry.language.name === 'en')
      .map((entry: any) => ({
        flavor_text: entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim(),
        version: (entry.version.name as string).replaceAll('-', ' '),
      }))

    const unique_entries = Array.from(
      new Map(entries.map((e) => [e.flavor_text + e.version, e])).values()
    )

    return unique_entries
  }
}

export const pokemonAPI = new PokemonAPI();