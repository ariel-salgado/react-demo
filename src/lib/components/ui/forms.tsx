import { cn } from '@/lib/utils'
import { HTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes } from 'react'

interface FormGroupProps extends HTMLAttributes<HTMLDivElement> { };

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> { };

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  value: string
  onChange?: (value: string) => void
}

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
      className={cn('w-full md:w-68 px-4 py-2 border-2 border-primary rounded-md focus:outline-none focus:border-primary bg-white text-muted capitalize', className)}
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

export {
  FormGroup,
  Label,
  Select,
}