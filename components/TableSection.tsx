import React from 'react';
import { DATA_SCHEMA } from '../constants';
import { DataEntry } from '../types';

interface TableSectionProps {
  data: DataEntry[]; // Expected to be sorted Descending
  onDeleteColumn: (id: number) => void;
  onExport: () => void;
}

const TableSection: React.FC<TableSectionProps> = ({ data, onDeleteColumn, onExport }) => {
  return (
    <div>
      <div className="text-right mb-2">
        <button 
          onClick={onExport}
          className="text-blue-600 hover:text-blue-800 underline text-sm font-medium bg-transparent border-none cursor-pointer"
        >
          📤 导出Excel
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto custom-scrollbar relative">
        <table className="w-full border-collapse text-sm min-w-max">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 bg-blue-50 border border-slate-200 p-2 text-left min-w-[180px] font-semibold text-slate-700 border-r-2 border-r-slate-300 h-[45px]">
                指标名称
              </th>
              {data.map((item) => (
                <th key={item.id} className="sticky top-0 z-20 bg-slate-50 border border-slate-200 p-2 text-center font-normal min-w-[120px] group h-[45px]">
                  <div className="relative px-2">
                    {item.date}
                    <button
                      onClick={() => onDeleteColumn(item.id)}
                      className="hidden group-hover:block absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs leading-none cursor-pointer"
                      title="删除"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DATA_SCHEMA.map((group) => (
              <React.Fragment key={group.category}>
                <tr className="bg-slate-100">
                  <td 
                    colSpan={data.length + 1} 
                    className="sticky left-0 z-10 bg-slate-100 border border-slate-200 p-2 text-left font-bold text-slate-700"
                  >
                    ▼ {group.category}
                  </td>
                </tr>
                {group.fields.map((field) => (
                  <tr key={field.k} className="hover:bg-slate-50">
                    <td className="sticky left-0 z-10 bg-white border border-slate-200 border-r-2 border-r-slate-300 p-2 text-left text-slate-600">
                      {field.n}
                    </td>
                    {data.map((item, idx) => {
                      const curVal = Number(item[field.k]) || 0;
                      const prevItem = data[idx + 1];
                      let badge = <span className="invisible text-xs px-1 rounded bg-slate-100 text-slate-400">-</span>;

                      if (prevItem) {
                        const prevVal = Number(prevItem[field.k]) || 0;
                        if (prevVal !== 0) {
                          const rate = ((curVal - prevVal) / prevVal) * 100;
                          const absRate = Math.abs(rate).toFixed(1);
                          
                          let colorClass = "text-slate-400 bg-transparent"; // flat
                          let arrow = "";

                          if (rate > 0) {
                            colorClass = "text-green-700 bg-green-100";
                            arrow = "↑";
                          } else if (rate < 0) {
                            colorClass = "text-red-700 bg-red-100";
                            arrow = "↓";
                          }
                          
                          badge = (
                            <span className={`text-[0.75em] px-1 rounded ${colorClass}`}>
                              {arrow}{absRate}%
                            </span>
                          );
                        }
                      }

                      return (
                        <td key={`${item.id}-${field.k}`} className="border border-slate-200 p-2 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-slate-800">{curVal}</span>
                            {badge}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSection;