import React from 'react';

type BadgeColor = 'green' | 'orange' | 'red' | 'yellow' | 'blue' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeColor;
  color?: BadgeColor; // Альтернативное название для variant
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant, color, className = '' }) => {
  // Используем color если передан, иначе variant
  const activeColor = color || variant || 'gray';

  const colorClasses = {
    green: 'badge-green',
    orange: 'badge-orange',
    red: 'badge-red',
    yellow: 'badge-yellow',
    blue: 'badge-blue',
    gray: 'badge-gray',
  };

  return (
    <span className={`badge ${colorClasses[activeColor]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
