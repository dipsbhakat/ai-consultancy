import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105",
        destructive: "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105",
        outline: "border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600",
        secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:shadow-xl hover:shadow-gray-500/25 hover:scale-105",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-lg",
        xl: "h-16 px-10 py-5 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
