import React from 'react';
import { DATA_SCHEMA } from '../constants';

interface InputSectionProps {
  values: { [key: string]: number | string };
  onChange: (key: string, value: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ values, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      {DATA_SCHEMA.map((group, idx) => {
        // Generate color based on index to match original HSL logic: (idx * 25) % 360
        const hue = (idx * 25) % 360;
        const borderColor = `hsl(${hue}, 70%, 50%)`;
        const titleColor = `hsl(${hue}, 80%, 30%)`;

        return (
          <div 
            key={group.category}
            className="bg-white rounded-md p-3 border border-slate-200 shadow-sm"
            style={{ borderTop: `3px solid ${borderColor}` }}
          >
            <div 
              className="text-sm font-bold mb-3 pb-1 border-b border-dashed border-slate-200"
              style={{ color: titleColor }}
            >
              {group.category}
            </div>
            <div className="space-y-1.5">
              {group.fields.map((field) => (
                <div key={field.k} className="flex justify-between items-center">
                  <label 
                    title={field.n}
                    className="text-xs text-slate-500 mr-2"
                  >
                    {field.n}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={values[field.k] || ''}
                    onChange={(e) => onChange(field.k, e.target.value)}
                    className="w-20 px-1 py-1 text-right text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InputSection;