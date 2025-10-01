
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-6 backdrop-blur-sm ${className}`}>
      <h3 className="text-xl font-semibold text-purple-300 mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
