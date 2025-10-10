import { createFileRoute } from '@tanstack/react-router'

import { pokemonAPI } from '@/lib/api/pokemon'
import { PokemonFlavorTexts, PokemonSpriteCard, PokemonStatsRadar, PokemonStatsTable } from '@/lib/components/pokemon';

export const Route = createFileRoute('/$pokemon')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const pokemon = await pokemonAPI.getPokemon(params.pokemon);
    const pokemonEntries = await pokemonAPI.getPokemonFlavorTexts(params.pokemon);

    if (!pokemon) {
      throw new Error('Pokémon not found')
    }

    return { pokemon, pokemonEntries }
  },
})

function RouteComponent() {
  const { pokemon, pokemonEntries } = Route.useLoaderData()

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <div className="grid gap-8">
        <div className='flex gap-8'>
          <PokemonSpriteCard className='w-[45%]' pokemon={pokemon} />
          <PokemonFlavorTexts className='w-[55%]' entries={pokemonEntries} />
        </div>
        <PokemonStatsRadar pokemon={pokemon} />
        <PokemonStatsTable pokemon={pokemon} />
      </div>
    </div>
  )
}
