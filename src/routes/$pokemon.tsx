import { createFileRoute } from '@tanstack/react-router'

import { pokemonAPI } from '@/lib/api/pokemon'
import { PokemonSpriteCard } from '@/lib/components/pokemon';

export const Route = createFileRoute('/$pokemon')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const pokemon = await pokemonAPI.getPokemon(params.pokemon);

    if (!pokemon) {
      throw new Error('Pokémon not found')
    }

    return { pokemon }
  },
})

function RouteComponent() {
  const { pokemon } = Route.useLoaderData()

  return (
    <section className="p-6 flex flex-col items-center gap-6">
      <PokemonSpriteCard pokemon={pokemon} />
    </section>
  )
}
