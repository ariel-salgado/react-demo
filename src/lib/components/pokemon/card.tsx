import type { Pokemon } from '@/lib/api/pokemon'

interface PokemonCardProps {
    pokemon: Pokemon
    ref?: (node: HTMLDivElement | null) => void
}

function PokemonCard({ pokemon, ref }: PokemonCardProps) {
    return (
        <div
            ref={ref}
            className="bg-foreground rounded-md shadow-md p-6"
        >
            <div className="aspect-square flex items-center justify-center">
                {pokemon.sprite ? (
                    <img
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        className="size-full object-contain"
                    />
                ) : (
                    <div className="size-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-semibold text-4xl">No image</span>
                    </div>
                )}
            </div>

            <hgroup className='space-y-0.5'>
                <h3 className="text-center font-semibold text-2xl capitalize text-background">
                    {pokemon.name}
                </h3>
                <p className="text-center text-lg text-muted font-medium">
                    #{pokemon.id}
                </p>
            </hgroup>
        </div>
    )
}

export { PokemonCard }