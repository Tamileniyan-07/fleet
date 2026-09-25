import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DashboardStats, Alert, DeliveryRoute } from '../types';
import {
  Truck, Package, Clock, Fuel, DollarSign, AlertTriangle,
  TrendingUp, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const chartData = [
  { name: 'Mon', deliveries: 45, efficiency: 89 },
  { name: 'Tue', deliveries: 52, efficiency: 91 },
  { name: 'Wed', deliveries: 48, efficiency: 87 },
  { name: 'Thu', deliveries: 61, efficiency: 93 },
  { name: 'Fri', deliveries: 55, efficiency: 90 },
  { name: 'Sat', deliveries: 38, efficiency: 85 },
  { name: 'Sun', deliveries: 29, efficiency: 88 },
];

const weeklyData = [
  { name: 'W1', revenue: 2100000 },
  { name: 'W2', revenue: 2400000 },
  { name: 'W3', revenue: 2200000 },
  { name: 'W4', revenue: 2847500 },
];

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.getAlerts().then(setAlerts);
    api.getRoutes().then(setRoutes);
  }, []);

  const statCards = stats ? [
    { label: 'Total Vehicles', value: stats.totalVehicles, icon: Truck, color: 'from-primary to-primary-light', change: '+3' },
    { label: 'Active Deliveries', value: stats.activeDeliveries, icon: Package, color: 'from-accent to-accent-light', change: '+12%' },
    { label: 'On-Time Rate', value: `${stats.onTimeRate}%`, icon: Clock, color: 'from-success to-emerald-400', change: '+2.1%' },
    { label: 'Fuel Efficiency', value: `${stats.fuelEfficiency}%`, icon: Fuel, color: 'from-warning to-amber-400', change: '-0.5%' },
    { label: 'Revenue (MTD)', value: `$${(stats.revenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'from-neon to-emerald-300', change: '+18%' },
    { label: 'Pending Alerts', value: stats.pendingAlerts, icon: AlertTriangle, color: 'from-danger to-rose-400', change: '-4' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Command Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time logistics intelligence overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
          <Activity className="w-3 h-3 text-success" />
          <span className="text-xs text-success font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card rounded-xl p-4 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xs flex items-center gap-0.5 ${card.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                {card.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-slate-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Chart */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Weekly Deliveries & Efficiency</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="deliveries" stroke="#6366f1" fill="url(#colorDeliveries)" strokeWidth={2} />
              <Area type="monotone" dataKey="efficiency" stroke="#06b6d4" fill="url(#colorEfficiency)" strokeWidth={2} />
              <defs>
                <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Monthly Revenue Trend</h3>
            <DollarSign className="w-4 h-4 text-neon" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v/1000000}M`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(value: number) => [`$${(value/1000000).toFixed(2)}M`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row - Alerts & Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            System Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-light/50 hover:bg-surface-lighter/30 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  alert.type === 'CRITICAL' ? 'bg-danger' :
                  alert.type === 'WARNING' ? 'bg-warning' : 'bg-accent'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Routes */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Active Delivery Routes
          </h3>
          <div className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-light/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{route.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      route.status === 'IN_TRANSIT' ? 'bg-success/20 text-success' :
                      route.status === 'COMPLETED' ? 'bg-accent/20 text-accent' :
                      route.status === 'DELAYED' ? 'bg-danger/20 text-danger' :
                      'bg-warning/20 text-warning'
                    }`}>
                      {route.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {route.origin} → {route.destination}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{route.eta}</p>
                  <p className="text-[10px] text-slate-500">{route.vehicleId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
