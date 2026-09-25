import { useEffect, useState, useCallback, type FormEvent, type ReactNode } from 'react';
import { api } from '../services/api';
import { Vehicle } from '../types';
import {
  Plus, Search, Filter, Trash2, Edit2, MoreVertical, RefreshCw,
  Truck, Navigation, Fuel, Calendar, X, Check, ChevronDown
} from 'lucide-react';

// ============ UI Components (Shadcn-inspired) ============

function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: string }) {
  const colors: Record<string, string> = {
    default: 'bg-surface-lighter text-slate-300',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    danger: 'bg-danger/20 text-danger border border-danger/30',
    info: 'bg-accent/20 text-accent border border-accent/30',
    primary: 'bg-primary/20 text-primary-light border border-primary/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[variant] || colors.default}`}>
      {children}
    </span>
  );
}

function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="dialog-overlay absolute inset-0" onClick={onClose} />
      <div className="relative glass-card rounded-2xl border border-border/40 w-full max-w-lg mx-4 p-6 shadow-2xl animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-lighter/50 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, title, message }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="dialog-overlay absolute inset-0" onClick={onClose} />
      <div className="relative glass-card rounded-2xl border border-border/40 w-full max-w-sm mx-4 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-surface-lighter/50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm bg-danger text-white hover:bg-danger/80 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ Main Fleet Management Component ============

export function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '', type: 'TRUCK' as Vehicle['type'], status: 'IDLE' as Vehicle['status'],
    currentLocation: '', driver: '', fuelLevel: 100, capacity: '',
  });

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    const data = await api.getFleets();
    setVehicles(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase()) ||
      v.currentLocation.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    await api.createFleet({
      ...formData,
      lat: 25 + Math.random() * 30,
      lng: -10 + Math.random() * 140,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
    });
    setAddDialogOpen(false);
    resetForm();
    fetchVehicles();
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    await api.updateFleet(selectedVehicle.id, formData);
    setEditDialogOpen(false);
    setSelectedVehicle(null);
    resetForm();
    fetchVehicles();
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;
    await api.deleteFleet(selectedVehicle.id);
    setDeleteDialogOpen(false);
    setSelectedVehicle(null);
    fetchVehicles();
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'TRUCK', status: 'IDLE', currentLocation: '', driver: '', fuelLevel: 100, capacity: '' });
  };

  const openEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      name: vehicle.name, type: vehicle.type, status: vehicle.status,
      currentLocation: vehicle.currentLocation, driver: vehicle.driver,
      fuelLevel: vehicle.fuelLevel, capacity: vehicle.capacity,
    });
    setEditDialogOpen(true);
    setActionMenuOpen(null);
  };

  const openDelete = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
    setActionMenuOpen(null);
  };

  const getStatusVariant = (status: Vehicle['status']) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'IDLE': return 'info';
      case 'MAINTENANCE': return 'warning';
      case 'OFFLINE': return 'danger';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'TRUCK': return '🚛';
      case 'DRONE': return '🛸';
      case 'VAN': return '🚐';
      case 'SHIP': return '🚢';
      case 'ROBOT': return '🤖';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Fleet Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor your autonomous fleet • <span className="text-primary">{vehicles.length} vehicles registered</span></p>
        </div>
        <button
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, driver, location, or ID..."
            className="w-full pl-10 pr-4 py-2 bg-surface-light border border-border rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="IDLE">Idle</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
        <button
          onClick={fetchVehicles}
          className="p-2 rounded-lg border border-border hover:bg-surface-lighter/50 text-slate-400 hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 border-b border-border/30">Vehicle</th>
                <th className="text-left px-4 py-3 border-b border-border/30">Status</th>
                <th className="text-left px-4 py-3 border-b border-border/30">Location</th>
                <th className="text-left px-4 py-3 border-b border-border/30">Driver</th>
                <th className="text-left px-4 py-3 border-b border-border/30">Fuel</th>
                <th className="text-left px-4 py-3 border-b border-border/30">Capacity</th>
                <th className="text-right px-4 py-3 border-b border-border/30">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-400">Loading fleet data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Truck className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-400">No vehicles found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-border/10 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getTypeIcon(vehicle.type)}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{vehicle.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{vehicle.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusVariant(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3 h-3 text-slate-500" />
                        <span className="text-sm text-slate-300">{vehicle.currentLocation}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-300">{vehicle.driver}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              vehicle.fuelLevel > 60 ? 'bg-success' :
                              vehicle.fuelLevel > 30 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{vehicle.fuelLevel}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-300">{vehicle.capacity}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActionMenuOpen(actionMenuOpen === vehicle.id ? null : vehicle.id)}
                          className="p-1.5 rounded-lg hover:bg-surface-lighter/50 text-slate-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {actionMenuOpen === vehicle.id && (
                          <div className="absolute right-0 top-full mt-1 w-36 glass-card rounded-lg border border-border/40 py-1 shadow-xl z-10">
                            <button
                              onClick={() => openEdit(vehicle)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-surface-lighter/50 hover:text-white transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => openDelete(vehicle)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-border/30 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">API: GET /api/admin/fleets</span>
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} title="Register New Vehicle">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                placeholder="e.g., TRUCK-025"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="TRUCK">🚛 Truck</option>
                <option value="DRONE">🛸 Drone</option>
                <option value="VAN">🚐 Van</option>
                <option value="SHIP">🚢 Ship</option>
                <option value="ROBOT">🤖 Robot</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Current Location</label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              placeholder="e.g., Shanghai Hub A"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Assigned Driver</label>
              <input
                type="text"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                placeholder="Driver name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Capacity</label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                placeholder="e.g., 2500 kg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Initial Fuel Level (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.fuelLevel}
              onChange={(e) => setFormData({ ...formData, fuelLevel: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-surface-lighter/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Register Vehicle
            </button>
          </div>
        </form>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} title={`Edit ${selectedVehicle?.name}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Vehicle Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Vehicle['type'] })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="TRUCK">🚛 Truck</option>
                <option value="DRONE">🛸 Drone</option>
                <option value="VAN">🚐 Van</option>
                <option value="SHIP">🚢 Ship</option>
                <option value="ROBOT">🤖 Robot</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
              className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
            >
              <option value="ACTIVE">Active</option>
              <option value="IDLE">Idle</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Current Location</label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
              className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Driver</label>
              <input
                type="text"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Fuel Level (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.fuelLevel}
                onChange={(e) => setFormData({ ...formData, fuelLevel: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-surface-light border border-border rounded-lg text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:bg-surface-lighter/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to remove ${selectedVehicle?.name} from the fleet? This action cannot be undone.`}
      />
    </div>
  );
}
