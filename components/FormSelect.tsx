import React from 'react';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface FormSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative flex flex-col p-4 border rounded-xl text-left transition-all duration-200
              ${value === option.value 
                ? 'bg-primary-600/20 border-primary-500 ring-1 ring-primary-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'}
            `}
            type="button"
          >
            <div className="flex items-center gap-3 mb-1">
              {option.icon && (
                <span className={`${value === option.value ? 'text-primary-400' : 'text-gray-400'}`}>
                  {option.icon}
                </span>
              )}
              <span className={`font-semibold ${value === option.value ? 'text-white' : 'text-gray-200'}`}>
                {option.label}
              </span>
            </div>
            {option.description && (
              <span className="text-xs text-gray-400 ml-0 sm:ml-9">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};