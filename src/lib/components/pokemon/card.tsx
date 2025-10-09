import type { Pokemon } from '@/lib/api/pokemon'

import { cn } from '@/lib/utils'
import { Play, RotateCcw, Sparkles } from 'lucide-react'
import { useState, type HTMLAttributes } from 'react'
import { Button } from '../ui'

interface PokemonInfoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    pokemon: Pokemon
    ref?: (node: HTMLDivElement | null) => void
}

function PokemonInfoCard({ pokemon, ref, className, ...rest }: PokemonInfoCardProps) {
    return (
        <div
            ref={ref}
            className={cn("bg-foreground rounded-md shadow-md p-6", className)}
            {...rest}
        >
            <div className="aspect-square flex items-center justify-center">
                {pokemon.sprites.front_default ? (
                    <img
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        className="size-full object-contain"
                    />
                ) : (
                    <div className="size-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-semibold text-4xl">No image</span>
                    </div>
                )}
            </div>

            <div className='flex flex-col gap-y-0.5 justify-center items-center'>
                <a
                    className="whitespace-nowrap font-semibold text-2xl capitalize text-background hover:underline focus-within:underline underline-offset-2 decoration-2 cursor-pointer"
                    referrerPolicy='no-referrer'
                    href={`/${pokemon.name}`}
                >
                    {pokemon.name}
                </a>
                <p className="text-center text-lg text-muted font-medium">
                    #{pokemon.id}
                </p>
            </div>
        </div>
    )
}

interface PokemonSpriteCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    pokemon: Pokemon
}

function PokemonSpriteCard({ pokemon, ...rest }: PokemonSpriteCardProps) {
    const [is_back, set_is_back] = useState(false)
    const [is_shiny, set_is_shiny] = useState(false)
    const [is_playing, set_is_playing] = useState(false)

    const sprite_key = `${is_back ? 'back' : 'front'}_${is_shiny ? 'shiny' : 'default'}` as const
    const sprite_url = pokemon.sprites[sprite_key]

    const playCry = () => {
        if (is_playing) return

        const audio = new Audio(pokemon.cries.latest)
        audio.volume = 0.15
        set_is_playing(true)

        audio.play()
        audio.onended = () => set_is_playing(false)
        audio.onerror = () => set_is_playing(false)
    }


    return (
        <div className="p-8 bg-foreground rounded-2xl" {...rest}>
            <hgroup>
                <h2 className="text-3xl font-bold capitalize text-center text-background">{pokemon.name}</h2>
                <p className='text-muted text-lg text-center font-medium'>#{pokemon.id}</p>
            </hgroup>
            <div className="size-80 aspect-square overflow-hidden">
                <img
                    src={sprite_url}
                    alt={`${pokemon.name} sprite`}
                    className="size-full object-contain"
                />
            </div>
            <div className="flex justify-center gap-x-2">
                <Button
                    size='icon'
                    variant='primary'
                    onClick={() => set_is_back(prev => !prev)}
                    title="Flip sprite"
                >
                    <RotateCcw className="size-6 stroke-2 align-middle inline-block stroke-primary-foreground" />
                </Button>
                <Button
                    size='icon'
                    variant='accent'
                    onClick={() => set_is_shiny(prev => !prev)}
                    title="Toggle shiny"
                >
                    <Sparkles className="size-6 stroke-2 align-middle inline-block stroke-accent-foreground" />
                </Button>
                <Button
                    size='icon'
                    variant='muted'
                    onClick={playCry}
                    disabled={is_playing}
                    title="Play cry"
                >
                    <Play className="size-6 stroke-2 align-middle inline-block stroke-muted" />
                </Button>
            </div>
        </div>
    )
}

export {
    PokemonInfoCard,
    PokemonSpriteCard,
}