import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Clock, ChefHat, DollarSign,
  ClipboardList, Armchair, RefreshCw, AlertCircle,
  TrendingDown, Activity, PieChart as PieIcon
} from 'lucide-react';
import { uz } from '../i18n';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const fmt = (n) => Math.round(n || 0).toLocaleString('ru-RU');

const catEmoji = {
  payroll: '👤',
  ingredients: '🍅',
  utilities: '⚡',
  rent: '🏠',
  other: '📦'
};

const StatCard = ({ title, value, sub, color, icon }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--glass-border)',
    borderTop: `3px solid ${color}`,
    borderRadius: 16,
    padding: '28px 32px',
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    minWidth: 200,
  }}>
    <div style={{ position: 'absolute', right: 20, top: 20, opacity: 0.07, color }}>{icon}</div>
    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 10 }}>
      {title}
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
    {children}
  </div>
);

const ChartCard = ({ title, children, action }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--glass-border)',
    borderRadius: 16,
    padding: '28px 28px 20px',
  }}>
    <SectionHeader title={title}>{action}</SectionHeader>
    {children}
  </div>
);

const DayToggle = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3 }}>
    {[7, 14, 30].map(d => (
      <button
        key={d}
        onClick={() => onChange(d)}
        style={{
          padding: '4px 12px',
          borderRadius: 6,
          fontSize: '0.8rem',
          fontWeight: 600,
          background: value === d ? 'var(--primary)' : 'transparent',
          color: value === d ? '#000' : 'var(--text-muted)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {d}k
      </button>
    ))}
  </div>
);

const CustomStatsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--glass-border)',
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: '0.85rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: 100
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-muted)' }}>{p.name === 'revenue' ? 'Tushum' : 'Xarajat'}:</span>
          <span style={{ fontWeight: 700, color: p.color }}>{fmt(p.value)} so'm</span>
        </div>
      ))}
      {payload.length >= 2 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>Sof:</span>
          <span style={{ fontWeight: 800, color: (payload[0].value - payload[1].value) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {fmt(payload[0].value - payload[1].value)} so'm
          </span>
        </div>
      )}
    </div>
  );
};

// ─── Main Dashboard Component ─────────────────────────────────────────────────
const AnalyticsDashboard = ({ socket }) => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [expenseStats, setExpenseStats] = useState({ total: 0, byCategory: {} });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (selectedDays = days) => {
    try {
      setError(null);
      const [statsRes, revenueRes, peakRes, dishesRes, expenseRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get(`/analytics/revenue?days=${selectedDays}`),
        api.get('/analytics/peak-hours'),
        api.get('/analytics/top-dishes?limit=10'),
        api.get(`/expenses/stats?days=${selectedDays}`),
      ]);
      setStats(statsRes.data);
      setRevenue(revenueRes.data);
      setPeakHours(peakRes.data);
      setTopDishes(dishesRes.data);
      setExpenseStats(expenseRes.data);
    } catch (err) {
      setError('Analitikani yuklashda xatolik');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAll(days);
  }, [fetchAll, days]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchAll(days);
    socket.on('payment:created', refresh);
    socket.on('order:created', refresh);
    socket.on('expense:created', refresh);
    socket.on('expense:updated', refresh);
    socket.on('expense:deleted', refresh);
    return () => {
      socket.off('payment:created', refresh);
      socket.off('order:created', refresh);
      socket.off('expense:created', refresh);
      socket.off('expense:updated', refresh);
      socket.off('expense:deleted', refresh);
    };
  }, [socket, days, fetchAll]);

  const handleDaysChange = (d) => {
    setDays(d);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <RefreshCw size={28} style={{ color: 'var(--primary)', opacity: 0.6, animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <AlertCircle size={36} color="var(--danger)" style={{ marginBottom: 12 }} />
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{error}</p>
      <button className="btn btn-primary" onClick={() => fetchAll(days)}>Qayta urinish</button>
    </div>
  );

  if (!stats) return null;

  // Peak hour bar colors — highlight the top 3 busiest hours
  const maxOrders = Math.max(...peakHours.map(h => h.orders), 1);
  const peakThreshold = maxOrders * 0.7;

  const sortedExpenses = Object.entries(expenseStats.byCategory)
    .sort(([, a], [, b]) => b - a);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Stat cards row ── */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <StatCard
          title="Bugungi daromad"
          value={`${fmt(stats.totalRevenueToday)} so'm`}
          sub={`${stats.totalPaymentsToday} ta to'lov`}
          color="var(--success)"
          icon={<TrendingUp size={48} />}
        />
        <StatCard
          title="Bugungi xarajat"
          value={`${fmt(stats.totalExpensesToday)} so'm`}
          sub="tasdiqlangan"
          color="var(--danger)"
          icon={<TrendingDown size={48} />}
        />
        <StatCard
          title={uz.manager.netRevenue}
          value={`${fmt(stats.netRevenueToday)} so'm`}
          sub="sof foyda"
          color={stats.netRevenueToday >= 0 ? "var(--primary)" : "var(--danger)"}
          icon={<Activity size={48} />}
        />
        <StatCard
          title="Band stollar"
          value={stats.occupiedTables}
          sub={`Naqd: ${stats.paymentSplit.cash} · Karta: ${stats.paymentSplit.card}`}
          color="var(--primary)"
          icon={<Armchair size={48} />}
        />
      </div>

      {/* ── Revenue vs Expenses chart ── */}
      <ChartCard
        title="Daromad va Xarajatlar"
        action={<DayToggle value={days} onChange={handleDaysChange} />}
      >
        {revenue.every(d => d.revenue === 0 && d.expenses === 0) ? (
          <EmptyChart message="Bu davr uchun ma'lumotlar yo'q" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} width={48} />
              <Tooltip content={<CustomStatsTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--success)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* ── Breakdowns row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Expense breakdown */}
        <ChartCard title="Xarajatlar tarkibi">
          {sortedExpenses.length === 0 ? (
            <EmptyChart message="Bu davrda xarajatlar yo'q" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sortedExpenses.map(([cat, amount]) => {
                const percent = (amount / expenseStats.total) * 100;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{catEmoji[cat]} {uz.expenses[cat]}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{fmt(amount)} so'm ({percent.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: 'var(--primary)', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Jami xarajat:</span>
                <span style={{ fontWeight: 800, color: 'var(--danger)' }}>{fmt(expenseStats.total)} so'm</span>
              </div>
            </div>
          )}
        </ChartCard>

        {/* Peak hours bar chart */}
        <ChartCard title="Eng band soatlar">
          {peakHours.every(h => h.orders === 0) ? (
            <EmptyChart message="Hali buyurtmalar yo'q" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={peakHours} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                <Tooltip content={<CustomStatsTooltip />} />
                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                  {peakHours.map((entry, i) => (
                    <Cell key={i} fill={entry.orders >= peakThreshold ? 'var(--primary)' : 'rgba(200,151,63,0.25)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Top dishes table */}
        <ChartCard title="Xaridorgir taomlar">
          {topDishes.length === 0 ? (
            <EmptyChart message="Hali to'langan buyurtmalar yo'q" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
              {topDishes.map((dish) => (
                <div key={dish.menuItemId} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: dish.rank <= 3 ? 'var(--primary)' : 'rgba(255,255,255,0.06)', color: dish.rank <= 3 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>{dish.rank}</span>
                  <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dish.name}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{fmt(dish.totalRevenue)}</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

    </div>
  );
};

const EmptyChart = ({ message }) => (
  <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
    {message}
  </div>
);

export default AnalyticsDashboard;