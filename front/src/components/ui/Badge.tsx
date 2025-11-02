import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'orange' | 'red' | 'yellow' | 'blue' | 'gray';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const variantClasses = {
    green: 'badge-green',
    orange: 'badge-orange',
    red: 'badge-red',
    yellow: 'badge-yellow',
    blue: 'badge-blue',
    gray: 'badge-gray',
  };

  return (
    <span className={`badge ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
