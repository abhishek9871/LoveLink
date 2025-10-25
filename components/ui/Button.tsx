
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full flex items-center justify-center font-bold py-3 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-red-500 focus:ring-primary',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-red-50 focus:ring-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
