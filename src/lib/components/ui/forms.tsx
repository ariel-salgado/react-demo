import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface FormGroupProps extends HTMLAttributes<HTMLDivElement> { };

function FormGroup({
  children,
  className,
  ...rest
}: FormGroupProps) {
  return (
    <div className={cn('space-y-1.5', className)} {...rest} >
      {children}
    </div>
  )
}

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> { };

function Label({
  children,
  className,
  ...rest
}: LabelProps) {
  return (
    <label className={cn('block font-medium text-lg text-primary whitespace-nowrap', className)} {...rest}>
      {children}
    </label>
  )
}

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  value: string
  onChange?: (value: string) => void
}

function Select({
  options,
  value,
  onChange,
  className,
  ...rest
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn('w-full h-10 px-4 py-2 border-2 border-muted rounded-md focus:outline-none focus-within:outline-none focus-within:ring-2 focus-within:ring-primary bg-white text-muted capitalize', className)}
      {...rest}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="capitalize">
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

function Input({ icon, iconPosition = 'left', className = '', ...rest }: InputProps) {
  const hasIcon = icon !== undefined;

  const paddingClass = hasIcon
    ? iconPosition === 'left'
      ? 'pl-12 pr-4'
      : 'pl-4 pr-12'
    : 'px-4';

  return (
    <div className="relative">
      {hasIcon && iconPosition === 'left' && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </div>
      )}
      <input
        className={cn("w-full h-10 border-2 border-muted rounded-md bg-white text-muted placeholder:text-muted/70 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary", paddingClass, className)}
        {...rest}
      />
      {hasIcon && iconPosition === 'right' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          {icon}
        </div>
      )}
    </div>
  );
}

export {
  FormGroup,
  Label,
  Select,
  Input
}