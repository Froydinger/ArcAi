import React from 'react';
import { cn } from '../../utils/classNames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  ...props
}) => {
  const baseStyles = "rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-secondary hover:to-theme-accent text-white shadow-lg shadow-theme ring-1 ring-theme",
    secondary: "bg-theme-gradient hover:bg-theme-hover text-theme-secondary ring-1 ring-theme",
    ghost: "hover:bg-theme-hover text-theme-secondary"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-2"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </div>
      ) : children}
    </button>
  );
};
