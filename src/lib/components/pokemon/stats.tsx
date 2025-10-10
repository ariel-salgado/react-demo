import type { HTMLAttributes } from 'react';

import { Pokemon } from '@/lib/api/pokemon';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface PokemonStatsRadarProps extends HTMLAttributes<HTMLDivElement> {
    pokemon: Pokemon;
}

function PokemonStatsRadar({ pokemon, className, ...rest }: PokemonStatsRadarProps) {
    const data = pokemon.stats.map(stat => ({
        stat: stat.stat.name,
        value: stat.base_stat
    }));

    return (
        <div className={cn("relative bg-foreground w-full rounded-2xl p-8", className)} {...rest}>
            <h2 className='absolute top-8 left-12 text-2xl font-semibold text-background'>Pokemon Stats</h2>
            <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={data}>
                    <PolarGrid className='stroke-2 stroke-muted-foreground/50' />
                    <PolarAngleAxis
                        dataKey="stat"
                        className='font-semibold'
                        tick={{ fill: 'hsl(var(--background))' }}
                    />
                    <PolarRadiusAxis
                        className='stroke-2 stroke-muted-foreground/50'
                        tick={{ fill: 'hsl(var(--background))' }}
                    />
                    <Radar
                        name="Stats"
                        dataKey="value"
                        className='fill-secondary/45 stroke-primary stroke-3'
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

interface PokemonStatsTableProps extends HTMLAttributes<HTMLTableElement> {
    pokemon: Pokemon;
}

function PokemonStatsTable({ pokemon, className, ...rest }: PokemonStatsTableProps) {
    return (
        <table className={cn("w-full table-fixed bg-foreground text-background text-lg rounded-2xl", className)} {...rest}>
            <thead>
                <tr>
                    {pokemon.stats.map((stat, index) => (
                        <th key={index} className="px-4 py-2 text-center font-semibold border border-background">
                            {stat.stat.name}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {pokemon.stats.map((stat, index) => (
                        <td key={index} className="px-4 py-2 text-center border border-background">
                            {stat.base_stat}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
}

export { PokemonStatsRadar, PokemonStatsTable };