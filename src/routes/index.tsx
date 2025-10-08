import type { Pokemon, PokemonSpecies } from '@/lib/api/pokemon'

import { LoaderCircle } from 'lucide-react';
import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'

import { pokemonAPI } from '@/lib/api/pokemon'
import { useInfiniteScroll } from '@/lib/hooks';
import { PokemonCard } from '@/lib/components/pokemon'
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

  const [offset, setOffset] = useState<number>(0);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<string>(generations[0].name);

  const loadingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!selectedGeneration) {
      return;
    }

    setOffset(0);
    setPokemon([]);
    setHasMore(true);
    setPokemonSpecies([]);

    const loadGeneration = async () => {
      const species = await pokemonAPI.getGenerationDetails(selectedGeneration);
      setPokemonSpecies(species);
    };

    loadGeneration();
  }, [selectedGeneration]);

  const loadPokemonBatch = useCallback(async (species: PokemonSpecies[], off: number) => {
    if (loadingRef.current) {
      return
    }

    setLoading(true)
    loadingRef.current = true

    const batch = species.slice(off, off + LIMIT)

    if (batch.length === 0) {
      setHasMore(false)
      setLoading(false)
      loadingRef.current = false
      return
    }

    const results = await pokemonAPI.getPokemonBatch(batch)

    setPokemon(prev => off === 0 ? results : [...prev, ...results])
    setHasMore(off + LIMIT < species.length)

    setLoading(false)
    loadingRef.current = false
  }, [])

  useEffect(() => {
    if (pokemonSpecies.length > 0) {
      loadPokemonBatch(pokemonSpecies, 0)
    }
  }, [pokemonSpecies, loadPokemonBatch])

  const lastPokemonRef = useInfiniteScroll({
    hasMore,
    loading: loadingRef.current,
    onLoadMore: () => {
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      loadPokemonBatch(pokemonSpecies, newOffset);
    },
  });

  return (
    <div className="px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold text-center text-primary">
          Pokedex App
        </h1>

        <FormGroup>
          <Label>Select Generation</Label>
          <Select
            value={selectedGeneration}
            onChange={(v) => setSelectedGeneration(v)}
            options={generations.map(gen => {
              return {
                value: gen.name,
                label: gen.name.replace('-', ' ')
              }
            })}
          />
        </FormGroup>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemon.map((p, index) => (
            <PokemonCard
              key={index}
              pokemon={p}
              ref={index === pokemon.length - 1 ? lastPokemonRef : undefined} />
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <LoaderCircle className='animate-spin size-8 stroke-3 align-middle inline-block' />
            <p className="text-foreground">Loading Pokemon...</p>
          </div>
        )}

        {!hasMore && pokemon.length > 0 && (
          <p className="text-center py-12 text-muted-foreground">
            You've seen all Pokemon from this generation!
          </p>
        )}
      </div>
    </div>
  )
}