import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-error text-brutal-white hover:bg-error/90",
    outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-brutal-black",
    secondary: "bg-brutal-gray text-brutal-white hover:bg-brutal-gray/80",
    ghost: "hover:bg-primary/10 text-primary",
    link: "text-primary underline-offset-4 hover:underline bg-transparent",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  }
  
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center font-brutal text-sm font-bold transition-all duration-150",
        "border-2 border-brutal-black disabled:pointer-events-none disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        // Variant styles
        variants[variant],
        // Size styles
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button }