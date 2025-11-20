import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { STORAGE_KEY, DATA_SCHEMA } from './constants';
import { DataEntry } from './types';
import InputSection from './components/InputSection';
import ChartSection from './components/ChartSection';
import TableSection from './components/TableSection';

const App: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  
  // Initialize with local date string to avoid timezone issues
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [formValues, setFormValues] = useState<{ [key: string]: number | string }>({});

  // Load data on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const list: DataEntry[] = JSON.parse(raw);
        // Ensure descending sort by date for table view
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setData(list);
      } catch (e) {
        console.error("Failed to parse data", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  const persistData = (newData: DataEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!selectedDate) {
      alert("请选择日期");
      return;
    }

    const newEntry: DataEntry = {
      id: Date.now(),
      date: selectedDate,
    };

    // Populate entry from form values using Schema to ensure structure
    DATA_SCHEMA.forEach(group => {
      group.fields.forEach(field => {
        const val = formValues[field.k];
        newEntry[field.k] = (val === '' || val === undefined || val === null) ? 0 : parseFloat(val.toString());
      });
    });

    const newList = [...data];
    const existingIndex = newList.findIndex(i => i.date === selectedDate);

    if (existingIndex !== -1) {
      // Logic to ask for overwrite confirmation
      const shouldOverwrite = window.confirm(`日期 ${selectedDate} 的数据已存在。\n是否要覆盖现有数据？`);
      
      if (!shouldOverwrite) {
        return; // User selected 'Cancel', do not overwrite
      }
      
      // User selected 'OK', overwrite the existing entry
      newList[existingIndex] = newEntry;
    } else {
      newList.push(newEntry);
    }

    // Sort descending again
    newList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    persistData(newList);
    
    // Clear form
    setFormValues({});
    alert("保存成功！");
  };

  const handleDeleteColumn = (id: number) => {
    if (!window.confirm("⚠️ 确定要删除这一整周的数据吗？")) return;
    const newList = data.filter(item => item.id !== id);
    persistData(newList);
  };

  const handleExport = () => {
    if (data.length === 0) {
      alert("暂无数据");
      return;
    }

    const headerRow = ["分类", "指标名称", ...data.map(d => d.date)];
    const aoa: any[][] = [headerRow];

    DATA_SCHEMA.forEach(group => {
      group.fields.forEach(field => {
        const row: any[] = [group.category, field.n];
        data.forEach(item => {
          row.push(item[field.k] || 0);
        });
        aoa.push(row);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "周报数据");
    XLSX.writeFile(wb, `周报数据_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="max-w-[1800px] mx-auto p-5">
      <h1 className="text-2xl font-bold text-center mb-5 text-slate-800">📈 数据周报监控台</h1>

      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-white p-4 rounded-lg border border-slate-300 flex gap-5 items-center justify-center mb-5 shadow-md">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 font-medium">统计日期: </label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-1.5 border border-slate-300 rounded hover:border-blue-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded transition-colors shadow-sm"
        >
          💾 录入本周数据
        </button>
      </div>

      <InputSection values={formValues} onChange={handleInputChange} />

      <ChartSection data={data} />

      <TableSection 
        data={data} 
        onDeleteColumn={handleDeleteColumn} 
        onExport={handleExport}
      />
    </div>
  );
};

export default App;