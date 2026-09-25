import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Vehicle } from '../types';
import { MapPin, Radio, Satellite } from 'lucide-react';

export function LiveMap() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    api.getFleets().then(setVehicles);
  }, []);

  const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Fleet Map</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time vehicle tracking & geospatial intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
            <Radio className="w-3 h-3 text-success animate-pulse" />
            <span className="text-xs text-success">{activeVehicles.length} Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
            <Satellite className="w-3 h-3 text-accent" />
            <span className="text-xs text-accent">GPS Connected</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-card rounded-xl overflow-hidden relative" style={{ height: '500px' }}>
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-light to-surface">
          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Continent-like shapes */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <ellipse cx="30%" cy="40%" rx="15%" ry="20%" fill="#6366f1" />
            <ellipse cx="55%" cy="35%" rx="12%" ry="15%" fill="#06b6d4" />
            <ellipse cx="75%" cy="50%" rx="10%" ry="12%" fill="#6366f1" />
            <ellipse cx="20%" cy="65%" rx="8%" ry="10%" fill="#06b6d4" />
            <ellipse cx="80%" cy="30%" rx="6%" ry="8%" fill="#6366f1" />
          </svg>

          {/* Vehicle markers */}
          {vehicles.map((vehicle, i) => {
            const x = ((vehicle.lng + 10) / 150) * 100;
            const y = ((vehicle.lat - 20) / 40) * 100;
            const isActive = vehicle.status === 'ACTIVE';
            const isIdle = vehicle.status === 'IDLE';

            return (
              <div
                key={vehicle.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 ${
                  isActive ? 'animate-pulse' : ''
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className={`w-3 h-3 rounded-full ${
                  isActive ? 'bg-success shadow-lg shadow-success/50' :
                  isIdle ? 'bg-accent shadow-lg shadow-accent/50' :
                  vehicle.status === 'MAINTENANCE' ? 'bg-warning shadow-lg shadow-warning/50' :
                  'bg-danger shadow-lg shadow-danger/50'
                }`} />
                {isActive && (
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-success/30 animate-ping" />
                )}
              </div>
            );
          })}

          {/* Connection lines between active vehicles */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {activeVehicles.slice(0, -1).map((v, i) => {
              const next = activeVehicles[i + 1];
              if (!next) return null;
              const x1 = ((v.lng + 10) / 150) * 100;
              const y1 = ((v.lat - 20) / 40) * 100;
              const x2 = ((next.lng + 10) / 150) * 100;
              const y2 = ((next.lat - 20) / 40) * 100;
              return (
                <line
                  key={`${v.id}-${next.id}`}
                  x1={`${x1}%`} y1={`${y1}%`}
                  x2={`${x2}%`} y2={`${y2}%`}
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
              );
            })}
          </svg>
        </div>

        {/* Selected Vehicle Info Panel */}
        {selectedVehicle && (
          <div className="absolute top-4 right-4 w-72 glass-card rounded-xl border border-border/40 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">{selectedVehicle.name}</h3>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">ID</span>
                <span className="text-white font-mono">{selectedVehicle.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className={`font-medium ${
                  selectedVehicle.status === 'ACTIVE' ? 'text-success' :
                  selectedVehicle.status === 'IDLE' ? 'text-accent' :
                  selectedVehicle.status === 'MAINTENANCE' ? 'text-warning' : 'text-danger'
                }`}>{selectedVehicle.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location</span>
                <span className="text-white">{selectedVehicle.currentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driver</span>
                <span className="text-white">{selectedVehicle.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordinates</span>
                <span className="text-white font-mono">{selectedVehicle.lat.toFixed(2)}, {selectedVehicle.lng.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fuel</span>
                <span className="text-white">{selectedVehicle.fuelLevel}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 glass-card rounded-lg border border-border/30 p-3">
          <p className="text-xs font-medium text-slate-400 mb-2">Legend</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-xs text-slate-300">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs text-slate-300">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-warning" />
              <span className="text-xs text-slate-300">Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-danger" />
              <span className="text-xs text-slate-300">Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle List Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeVehicles.slice(0, 6).map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => setSelectedVehicle(vehicle)}
            className="glass-card rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-success" />
                <span className="text-sm font-medium text-white">{vehicle.name}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{vehicle.id}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{vehicle.currentLocation}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">{vehicle.driver}</span>
              <span className="text-xs text-success">{vehicle.fuelLevel}% fuel</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
