import type { Pokemon } from '@/lib/api/pokemon';

import { LoaderCircle } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

import { pokemonAPI } from '@/lib/api/pokemon'
import { useInfiniteScroll } from '@/lib/hooks';
import { PokemonInfoCard } from '@/lib/components/pokemon'
import { FormGroup, Label, Select } from '@/lib/components/ui'

export const Route = createFileRoute('/')({
  component: IndexRoute,
  loader: async () => {
    const generations = await pokemonAPI.getGenerations(9)
    return { generations }
  }
})

function IndexRoute() {
  const LIMIT = 20;

  const { generations } = Route.useLoaderData();

  const [loading, setLoading] = useState<boolean>(false);

  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<(Pokemon | null)[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<string>(generations[0].name);

  useEffect(() => {
    if (!selectedGeneration) {
      return;
    }

    setPokemon([]);
    setAllPokemon([]);

    const loadGeneration = async () => {
      setLoading(true);

      const pokemonData = await pokemonAPI.getPokemonByGeneration(selectedGeneration);
      const validPokemon = pokemonData.filter((p): p is Pokemon => p !== null);

      setAllPokemon(validPokemon);
      setPokemon(validPokemon.slice(0, LIMIT));

      setLoading(false);
    };

    loadGeneration();
  }, [selectedGeneration]);

  const loadMore = useCallback(() => {
    if (loading || pokemon.length >= allPokemon.length) {
      return;
    }

    const nextBatch = allPokemon.slice(pokemon.length, pokemon.length + LIMIT);

    setPokemon(prev => [...prev, ...nextBatch] as Pokemon[]);
  }, [loading, pokemon.length, allPokemon]);

  const lastPokemonRef = useInfiniteScroll({
    hasMore: pokemon.length < allPokemon.length,
    loading,
    onLoadMore: loadMore,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <FormGroup>
        <Label>Select Generation</Label>
        <Select
          value={selectedGeneration}
          onChange={(v) => setSelectedGeneration(v)}
          options={generations.map(gen => ({
            value: gen.name,
            label: gen.name.replace('-', ' ')
          }))}
        />
      </FormGroup>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemon.map((p, index) => (
          <PokemonInfoCard
            key={p.id}
            pokemon={p}
            ref={index === pokemon.length - 1 ? lastPokemonRef : undefined}
          />
        ))}
      </div>

      {loading && pokemon.length === 0 && (
        <div className="text-center py-12">
          <LoaderCircle className='animate-spin size-8 stroke-3 align-middle inline-block stroke-primary' />
          <p className="text-foreground">Loading Pokemon...</p>
        </div>
      )}

      {pokemon.length >= allPokemon.length && pokemon.length > 0 && (
        <p className="text-center py-12 text-muted-foreground">
          You've seen all Pokemon from this generation!
        </p>
      )}
    </div>
  )
}