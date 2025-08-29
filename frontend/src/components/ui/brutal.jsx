import React from 'react';
import { cn } from '../../lib/utils';

// BrutalCard Component
export const BrutalCard = ({ 
  children, 
  className, 
  rotation = 0, 
  color = 'white',
  hover = true,
  ...props 
}) => {
  const colorClasses = {
    white: 'bg-brutal-white text-brutal-black',
    primary: 'bg-primary text-brutal-black',
    black: 'bg-brutal-black text-brutal-white',
    success: 'bg-success text-brutal-white',
    warning: 'bg-warning text-brutal-black',
    error: 'bg-error text-brutal-white',
    gray: 'bg-brutal-gray text-brutal-white'
  };
  
  return (
    <div 
      className={cn(
        'brutal-card',
        colorClasses[color],
        hover && 'brutal-hover',
        className
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      {...props}
    >
      <div style={{ transform: `rotate(${-rotation}deg)` }}>
        {children}
      </div>
    </div>
  );
};

// BrutalButton Component
export const BrutalButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-brutal-black border-brutal-black',
    secondary: 'bg-brutal-white text-brutal-black border-brutal-black',
    success: 'bg-success text-brutal-white border-brutal-black',
    warning: 'bg-warning text-brutal-black border-brutal-black',
    error: 'bg-error text-brutal-white border-brutal-black',
    black: 'bg-brutal-black text-brutal-white border-brutal-white'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl'
  };
  
  return (
    <button 
      className={cn(
        'brutal-button',
        variants[variant],
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
};

// BrutalInput Component
export const BrutalInput = ({ 
  className, 
  type = 'text',
  ...props 
}) => {
  return (
    <input
      type={type}
      className={cn('brutal-input w-full', className)}
      {...props}
    />
  );
};

// BrutalLabel Component
export const BrutalLabel = ({ children, className, ...props }) => {
  return (
    <label 
      className={cn('font-brutal text-sm mb-2 block', className)} 
      {...props}
    >
      {children}
    </label>
  );
};

// BrutalLogo Component
export const BrutalLogo = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };
  
  return (
    <div className={cn(
      sizes[size],
      'bg-primary border-4 border-brutal-black flex items-center justify-center brutal-rotate-2',
      className
    )}>
      <span className={cn('text-brutal-black font-brutal', textSizes[size])}>
        S
      </span>
    </div>
  );
};

// BrutalChart Wrapper
export const BrutalChart = ({ 
  children, 
  title, 
  color = 'white',
  className,
  ...props 
}) => {
  return (
    <BrutalCard color={color} className={cn('h-full p-6', className)} {...props}>
      <div className="h-full flex flex-col">
        {title && (
          <h3 className="font-brutal text-lg mb-4 uppercase">
            {title}
          </h3>
        )}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </BrutalCard>
  );
};

// BrutalMetric Component
export const BrutalMetric = ({ 
  label, 
  value, 
  change, 
  icon: Icon,
  color = 'white',
  className 
}) => {
  return (
    <BrutalCard color={color} className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-mono-brutal text-sm mb-2 opacity-80">
            {label}
          </p>
          <p className="font-brutal text-3xl mb-2">
            {value}
          </p>
          {change && (
            <div className="flex items-center">
              <div className={cn(
                'px-2 py-1 border-2 border-brutal-black text-xs font-brutal',
                change.startsWith('+') ? 'bg-success text-brutal-white' : 'bg-error text-brutal-white'
              )}>
                {change}
              </div>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-brutal-black border-2 border-brutal-black">
            <Icon className="h-6 w-6 text-brutal-white" />
          </div>
        )}
      </div>
    </BrutalCard>
  );
};

// BrutalList Component
export const BrutalList = ({ 
  items, 
  title,
  renderItem,
  className,
  maxHeight = '300px'
}) => {
  return (
    <BrutalCard className={cn('p-4 h-full flex flex-col', className)}>
      {title && (
        <h4 className="font-brutal text-sm mb-4 uppercase">
          {title}
        </h4>
      )}
      <div 
        className="flex-1 overflow-y-auto space-y-2"
        style={{ maxHeight }}
      >
        {items.map((item, index) => (
          <div key={index} className="p-3 border-2 border-brutal-black bg-brutal-white hover:bg-primary hover:text-brutal-black transition-colors">
            {renderItem ? renderItem(item, index) : (
              <div className="font-mono-brutal text-sm">
                {typeof item === 'string' ? item : JSON.stringify(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    </BrutalCard>
  );
};

// BrutalNavItem Component
export const BrutalNavItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 border-4 font-brutal text-left transition-all duration-150',
        active 
          ? 'bg-primary border-brutal-white text-brutal-black shadow-brutal-sm' 
          : 'bg-brutal-black border-brutal-gray text-brutal-gray hover:border-primary hover:text-primary',
        className
      )}
    >
      <div className="flex items-center">
        {Icon && <Icon className="mr-3" size={20} />}
        <span className="text-sm">{label}</span>
      </div>
    </button>
  );
};

// BrutalContainer Component
export const BrutalContainer = ({ children, className }) => {
  return (
    <div className={cn('brutal-bg min-h-screen', className)}>
      {children}
    </div>
  );
};