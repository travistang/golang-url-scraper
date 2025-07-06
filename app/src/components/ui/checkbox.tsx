"use client"

import { cn } from "@/lib/utils"
import { Check, Minus } from "lucide-react"
import * as React from "react"

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    checked?: boolean | 'indeterminate'
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
        const isIndeterminate = checked === 'indeterminate'
        const isChecked = checked === true

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newChecked = event.target.checked
            onCheckedChange?.(newChecked)
            onChange?.(event)
        }

        React.useEffect(() => {
            if (ref && typeof ref === 'object' && ref.current) {
                ref.current.indeterminate = isIndeterminate
            }
        }, [isIndeterminate, ref])

        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    className={cn(
                        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                        "checked:bg-primary checked:text-primary-foreground",
                        isIndeterminate && "bg-primary",
                        className
                    )}
                    checked={isChecked}
                    onChange={handleChange}
                    {...props}
                />
                {isChecked && (
                    <Check className="absolute h-4 w-4 text-primary-foreground pointer-events-none" />
                )}
                {isIndeterminate && (
                    <Minus className="absolute h-4 w-4 text-primary-foreground pointer-events-none" />
                )}
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
