import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  size?: 'sm' | 'md';
  children: ReactNode;
  icon?: ReactNode;
}

const variantClasses = {
  primary: 'bg-accent text-white hover:bg-accent-light shadow-sm',
  secondary: 'bg-slate-600 text-white hover:bg-slate-700 shadow-sm',
  success: 'bg-success text-white hover:bg-emerald-700 shadow-sm',
  outline: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center gap-2 font-medium rounded-md
        transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
