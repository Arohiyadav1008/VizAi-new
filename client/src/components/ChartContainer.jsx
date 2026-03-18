import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { cn } from '../lib/utils';

const COLORS = ['#3b82f6', '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

const ChartContainer = ({ type, data, title, metrics, dimensions }) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="label" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18191c', border: '1px solid #27272a', borderRadius: '12px' }}
              itemStyle={{ color: '#f8f8f8' }}
            />
            <Legend iconType="circle" />
            {metrics.map((m, i) => (
              <Bar key={m} dataKey={m} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="label" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18191c', border: '1px solid #27272a', borderRadius: '12px' }}
            />
            <Legend iconType="circle" />
            {metrics.map((m, i) => (
              <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i % COLORS.length]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              {metrics.map((m, i) => (
                <linearGradient key={`grad-${m}`} id={`color${m}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis dataKey="label" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18191c', border: '1px solid #27272a', borderRadius: '12px' }}
            />
            <Legend iconType="circle" />
            {metrics.map((m, i) => (
              <Area key={m} type="monotone" dataKey={m} stroke={COLORS[i % COLORS.length]} fillOpacity={1} fill={`url(#color${m})`} strokeWidth={2} />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey={metrics[0]}
              nameKey="label"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#18191c', border: '1px solid #27272a', borderRadius: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>

        );
      default:
        return <div className="flex items-center justify-center h-full text-muted-foreground italic">Unsupported chart type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full group/chart">
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="font-bold text-sm text-muted-foreground truncate flex-1">{title}</h3>}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50 ml-4 shrink-0 transition-opacity">
          {['bar', 'line', 'area', 'pie'].map((t) => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={cn(
                "px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all",
                chartType === t
                  ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                  : "hover:bg-accent/10 text-muted-foreground hover:text-accent"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartContainer;
