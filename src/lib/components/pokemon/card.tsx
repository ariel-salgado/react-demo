import type { HTMLAttributes } from 'react'
import type { FlavorTextEntry, Pokemon } from '@/lib/api/pokemon'

import { cn } from '@/lib/utils'
import { Play, RotateCcw, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui'
import { PokemonTypeBadge } from './badge'
import { Link } from '@tanstack/react-router'

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
                <Link
                    className="whitespace-nowrap font-semibold text-2xl capitalize text-background hover:underline focus-within:underline underline-offset-2 decoration-2 cursor-pointer"
                    referrerPolicy='no-referrer'
                    to={'/$pokemon'}
                    params={{ pokemon: pokemon.name }}
                >
                    {pokemon.name}
                </Link>
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

function PokemonSpriteCard({ pokemon, className, ...rest }: PokemonSpriteCardProps) {
    const [is_back, set_is_back] = useState(false)
    const [is_shiny, set_is_shiny] = useState(false)
    const [is_playing, set_is_playing] = useState(false)

    const sprite_key = `${is_back ? 'back' : 'front'}_${is_shiny ? 'shiny' : 'default'}` as const
    const sprite_url = pokemon.sprites[sprite_key]

    const playCry = () => {
        if (is_playing) return

        const audio = new Audio(pokemon.cries.latest)
        audio.volume = 0.2
        set_is_playing(true)

        audio.play()
        audio.onended = () => set_is_playing(false)
        audio.onerror = () => set_is_playing(false)
    }


    return (
        <div className={cn("relative p-8 bg-foreground rounded-2xl w-128", className)} {...rest}>
            <div className='flex flex-col justify-between gap-y-6 items-center'>
                <hgroup>
                    <h2 className="text-4xl font-bold capitalize text-center text-background">{pokemon.name}</h2>
                    <p className='text-muted text-2xl text-center'>#{pokemon.id}</p>
                </hgroup>

                <div className="size-80 aspect-square overflow-hidden">
                    <img
                        src={sprite_url}
                        alt={`${pokemon.name} sprite`}
                        className="size-full object-contain"
                    />
                </div>

                <div className='flex gap-x-2 items-center justify-center'>
                    {pokemon.types.map(({ type }, key) => (
                        <PokemonTypeBadge type={type.name} key={key} />
                    ))}
                </div>
            </div>

            <div className=" absolute top-8 left-8 flex flex-col justify-center gap-2">
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

interface PokemonFlavorTextsProps extends HTMLAttributes<HTMLDivElement> {
    entries: FlavorTextEntry[]
}

export default function PokemonFlavorTexts({ entries, className, ...rest }: PokemonFlavorTextsProps) {
    return (
        <div className={cn("p-8 bg-foreground rounded-2xl space-y-6", className)} {...rest}>
            <h2 className="text-2xl font-semibold text-background">Pokédex Entries ({entries.length})</h2>

            <div className="max-h-96 overflow-y-auto space-y-6 pr-3">
                {entries.map((entry, key) => (
                    <div
                        key={key}
                        className='bg-secondary/10 border-2 border-secondary p-6 rounded-2xl'
                    >
                        <p className="text-lg font-semibold text-background mb-1">
                            <span className="capitalize">#{key + 1} - Pokemon {entry.version}</span>
                        </p>
                        <p className="text-sm text-background font-medium italic leading-snug">
                            “{entry.flavor_text}”
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export {
    PokemonInfoCard,
    PokemonSpriteCard,
    PokemonFlavorTexts
}