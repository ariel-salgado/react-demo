import type { ButtonHTMLAttributes, Ref } from 'react'

import { cn } from '@/lib/utils'

const baseStyles = 'cursor-pointer inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none rounded-md'

const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/80 focus-within:bg-primary/80 active:bg-primary/60',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-within:bg-secondary/80 active:bg-secondary/60',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/80 focus-within:bg-accent/80 active:bg-accent/60',
    muted: 'bg-muted-foreground text-muted hover:bg-muted-foreground/80 focus-within:bg-muted-foreground/80 active:bg-muted-foreground/60',
    ghost: 'bg-transparent text-foreground hover:bg-muted/10 focus-within:bg-muted/10 active:bg-muted/20'
}

const sizeStyles = {
    default: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    sm: 'px-3 py-1.5 text-sm',
    icon: 'size-10 p-1 aspect-square'
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: Ref<HTMLButtonElement>
    size?: keyof typeof sizeStyles;
    variant?: keyof typeof variantStyles;
}

function Button({ ref, children, variant = 'primary', size = 'default', className, ...rest }: ButtonProps) {
    return (
        <button ref={ref} className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)} {...rest}>
            {children}
        </button>
    )
}

export { Button }