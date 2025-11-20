import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { DATA_SCHEMA } from './constants';
import { DataEntry } from './types';
import InputSection from './components/InputSection';
import ChartSection from './components/ChartSection';
import TableSection from './components/TableSection';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// --- Helper Component for Setup Guide ---
const SetupGuide = () => (
  <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-blue-100">
    <h1 className="text-2xl font-bold text-slate-800 mb-4">☁️ 开启多人协作模式</h1>
    <p className="text-slate-600 mb-6">
      为了让大家看到同一份数据，我们需要连接到一个免费的云数据库 (Supabase)。
      请按照以下步骤操作：
    </p>

    <div className="space-y-6">
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-bold text-blue-700 mb-2">第一步：获取数据库密钥</h3>
        <ol className="list-decimal list-inside text-sm text-slate-700 space-y-2">
          <li>访问 <a href="https://supabase.com" target="_blank" className="text-blue-600 underline">supabase.com</a> 并注册/登录。</li>
          <li>点击 "New Project" 创建一个新项目。</li>
          <li>创建完成后，进入 <strong>Settings</strong> (齿轮图标) -&gt; <strong>API</strong>。</li>
          <li>找到 <strong>Project URL</strong> 和 <strong>anon public key</strong>。</li>
          <li>打开代码文件 <code>supabaseClient.ts</code>，将这两个值填入对应位置。</li>
        </ol>
      </div>

      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-bold text-blue-700 mb-2">第二步：创建数据表</h3>
        <p className="text-sm text-slate-600 mb-2">在 Supabase 左侧菜单点击 <strong>SQL Editor</strong>，点击 <strong>New query</strong>，粘贴以下代码并点击 <strong>Run</strong>：</p>
        <div className="bg-slate-800 text-slate-200 p-3 rounded text-xs font-mono overflow-x-auto relative group">
          <pre>{`create table weekly_reports (
  date text primary key,
  metrics jsonb
);`}</pre>
          <button 
            onClick={() => navigator.clipboard.writeText(`create table weekly_reports (\n  date text primary key,\n  metrics jsonb\n);`)}
            className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded text-xs"
          >
            复制 SQL
          </button>
        </div>
      </div>
    </div>
    
    <div className="mt-6 text-center text-sm text-slate-500">
      完成配置后，刷新此页面即可开始使用。
    </div>
  </div>
);

const App: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [formValues, setFormValues] = useState<{ [key: string]: number | string }>({});

  // --- Load Data from Supabase ---
  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const { data: rows, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (rows) {
        // Transform DB structure (date, metrics) back to App structure (flat object)
        const list: DataEntry[] = rows.map(row => ({
          id: new Date(row.date).getTime(), // Generate a numeric ID from date for React keys
          date: row.date,
          ...row.metrics // Spread the JSONB metrics into the flat object
        }));
        setData(list);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('读取数据失败，请检查 Supabase 配置');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!isSupabaseConfigured) {
    return <SetupGuide />;
  }

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedDate) {
      alert("请选择日期");
      return;
    }

    // 1. Construct the metrics object
    const metrics: { [key: string]: number } = {};
    DATA_SCHEMA.forEach(group => {
      group.fields.forEach(field => {
        const val = formValues[field.k];
        metrics[field.k] = (val === '' || val === undefined || val === null) ? 0 : parseFloat(val.toString());
      });
    });

    // 2. Check for existence (Overwrite logic)
    // We check our local state first to avoid an extra network call, 
    // but for strict consistency we could check DB. Local state is usually fine here.
    const existingEntry = data.find(d => d.date === selectedDate);

    if (existingEntry) {
      const shouldOverwrite = window.confirm(`日期 ${selectedDate} 的数据已存在。\n是否要覆盖现有数据？`);
      if (!shouldOverwrite) return;
    }

    setLoading(true);
    try {
      // 3. Upsert to Supabase
      // We store 'date' as the primary key, and 'metrics' as a JSONB blob
      const { error } = await supabase
        .from('weekly_reports')
        .upsert({ 
          date: selectedDate, 
          metrics: metrics 
        });

      if (error) throw error;

      alert("保存成功！(已同步到云端)");
      setFormValues({}); // Clear form
      await fetchData(); // Refresh data

    } catch (error) {
      console.error('Error saving data:', error);
      alert('保存失败: ' + (error as any).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteColumn = async (id: number) => {
    // Find the date associated with this ID
    const entryToDelete = data.find(item => item.id === id);
    if (!entryToDelete) return;

    if (!window.confirm(`⚠️ 确定要删除 ${entryToDelete.date} 的数据吗？\n此操作会同步删除云端数据。`)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('weekly_reports')
        .delete()
        .eq('date', entryToDelete.date);

      if (error) throw error;
      
      await fetchData(); // Refresh
    } catch (error) {
      console.error('Error deleting:', error);
      alert('删除失败');
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-2xl font-bold text-center mb-5 text-slate-800">
        📈 数据周报监控台 
        <span className="ml-2 text-xs font-normal text-white bg-blue-500 px-2 py-0.5 rounded-full align-middle">云端同步版</span>
      </h1>

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
          disabled={loading}
          className={`text-white font-bold py-2 px-5 rounded transition-colors shadow-sm flex items-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? '处理中...' : '💾 录入本周数据'}
        </button>
      </div>

      {loading && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-[60] animate-pulse">
          正在同步云端数据...
        </div>
      )}

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
