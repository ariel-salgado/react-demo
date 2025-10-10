import { TYPE_COLORS } from '@/lib/constants';

interface PokemonTypeBadgeProps {
    type: keyof typeof TYPE_COLORS;
}

function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
    const backgroundColor = TYPE_COLORS[type] || '#777';

    return (
        <span
            className="px-4 py-1 rounded-md text-white text-base font-bold capitalize inline-block border-2 border-secondary-foreground/40"
            style={{ backgroundColor }}
        >
            {type}
        </span>
    );
}

export { PokemonTypeBadge };