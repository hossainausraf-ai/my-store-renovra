'use client';

import { useState, useEffect } from 'react';
import { defaultProducts } from '@/data/products';
import { 
  Calendar, 
  Download, 
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#60a5fa', '#8b5cf6', '#93c5fd', '#c4b5fd', '#a78bfa'];

// Mock Sparkline Data for visuals since we don't have historical daily trend for all KPIs
const sparklineData1 = [{v:0},{v:1},{v:1.5},{v:2},{v:1.8},{v:3},{v:4},{v:4.5}];
const sparklineData2 = [{v:0},{v:0.5},{v:2},{v:1.5},{v:2.5},{v:3},{v:3.5},{v:5}];

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    conversion: 0,
    avgOrderValue: 0
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    let payments: any[] = [];
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && data.orders) {
        payments = data.orders;
      }
    } catch (e) {
      console.warn('Error fetching orders for analytics:', e);
    }

    const products = defaultProducts;

    // Map products for quick lookup
    const productMap = new Map();
    products.forEach(p => {
      productMap.set(p.id, p);
    });

    let totalRev = 0;
    let totalOrd = payments.length;
    
    // Groupings
    const dailyData: Record<string, { revenue: number; orders: number }> = {};
    const catData: Record<string, number> = {};

    // Process Last 30 Days (for chart)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Initialize daily data with last 7 days for a nice chart even if empty
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[dateStr] = { revenue: 0, orders: 0 };
    }

    payments.forEach(payment => {
      const product = productMap.get(payment.package_id);
      const price = product ? Number(product.price) : 0;
      const category = product ? product.category : 'Unknown';

      // Global Totals (Only approved or pending? Let's count all non-rejected for now, or just all)
      if (payment.status !== 'rejected') {
        totalRev += price;
      }

      // Daily grouping
      const pDate = new Date(payment.created_at);
      const dateStr = pDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { revenue: 0, orders: 0 };
      }
      
      if (payment.status !== 'rejected') {
        dailyData[dateStr].revenue += price;
        dailyData[dateStr].orders += 1;

        // Category grouping
        catData[category] = (catData[category] || 0) + price;
      }
    });

    // Formatting for Recharts
    const formattedRevenueData = Object.keys(dailyData)
      // Sort keys if necessary, but string dates might be tricky. 
      // Assuming they are inserted chronologically if we iterate.
      .map(date => ({
        name: date,
        revenue: dailyData[date].revenue,
        orders: dailyData[date].orders
      }));
      // Optional: sort by actual date here if needed.

    const formattedCategoryData = Object.keys(catData)
      .map((cat, idx) => ({
        name: cat,
        value: catData[cat],
        color: COLORS[idx % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value); // sort by highest revenue

    setMetrics({
      totalRevenue: totalRev,
      totalOrders: totalOrd,
      conversion: totalOrd > 0 ? 3.18 : 0, // Mock conversion rate as we don't have visitors data
      avgOrderValue: totalOrd > 0 ? (totalRev / totalOrd) : 0
    });

    setRevenueData(formattedRevenueData);
    setCategoryData(formattedCategoryData);
    setIsLoading(false);
  };

  if (!isClient) return null;

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto bg-[var(--background)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
          <p className="text-gray-400 text-sm">Real-time revenue, conversion and traffic insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-white transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            Last 30 days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--surface)] border border-white/10 hover:bg-white/5 rounded-xl text-sm font-medium text-white transition-colors">
            <Download className="w-4 h-4 text-gray-400" />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            
            {/* Card 1 */}
            <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
                Total revenue
                <Info className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">৳{metrics.totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold w-fit">
                    <TrendingUp className="w-3 h-3" /> +12.5%
                  </div>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData1}>
                      <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
                Orders
                <Info className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">{metrics.totalOrders.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold w-fit">
                    <TrendingUp className="w-3 h-3" /> +8.2%
                  </div>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData2}>
                      <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
                Conversion Rate
                <Info className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">{metrics.conversion}%</div>
                  <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold w-fit">
                    <TrendingUp className="w-3 h-3" /> +1.1%
                  </div>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData1}>
                      <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-3">
                Avg. order value
                <Info className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">৳{metrics.avgOrderValue.toFixed(2)}</div>
                  <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded text-xs font-bold w-fit">
                    <TrendingUp className="w-3 h-3" /> +4.3%
                  </div>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData2}>
                      <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* Main Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Overview Chart */}
            <div className="lg:col-span-2 bg-[var(--surface)] border border-white/5 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Revenue overview
                  <Info className="w-4 h-4 text-gray-500" />
                </h2>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2 text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div> Revenue
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-3 h-3 rounded-full bg-blue-400/30"></div> Orders
                  </div>
                </div>
              </div>
              
              <div className="h-[350px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                    <YAxis 
                      yAxisId="left" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 12}} 
                      tickFormatter={(value) => `৳${value}`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 12}} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar yAxisId="right" dataKey="orders" fill="rgba(59, 130, 246, 0.4)" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
                {/* Adding LineChart overlaid for the curve effect inside the relative container */}
                <div className="absolute inset-0 pointer-events-none px-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <YAxis yAxisId="left" hide domain={['dataMin', 'dataMax + 5000']} />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b'}} activeDot={{r: 6, fill: '#fff', stroke: '#3b82f6'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Hover the chart for details
              </p>
            </div>

            {/* Sales by category */}
            <div className="bg-[var(--surface)] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-8">
                Sales by category
                <Info className="w-4 h-4 text-gray-500" />
              </h2>
              
              {categoryData.length > 0 ? (
                <>
                  <div className="h-[200px] w-full relative mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: any) => `৳${Number(value || 0).toLocaleString()}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="text-xl font-bold text-white">৳{metrics.totalRevenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 mt-1">Total sales</div>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    {categoryData.map((cat, idx) => (
                      <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{cat.name || 'Uncategorized'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-white">৳{cat.value.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 w-8 text-right">
                            {metrics.totalRevenue > 0 ? Math.round((cat.value / metrics.totalRevenue) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <PieChart className="w-16 h-16 opacity-20 mb-4" />
                  <p>No category data available</p>
                </div>
              )}
              
            </div>

          </div>
        </>
      )}

    </div>
  );
}
