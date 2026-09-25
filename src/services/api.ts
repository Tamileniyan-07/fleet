import { Vehicle, DashboardStats, Alert, DeliveryRoute } from '../types';

const API_BASE = '/api';

// Helper to get auth headers
function getHeaders(): HeadersInit {
  const stored = localStorage.getItem('neurofleet_auth');
  const token = stored ? JSON.parse(stored).token : '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// Mock data generators
const VEHICLE_TYPES: Vehicle['type'][] = ['TRUCK', 'DRONE', 'VAN', 'SHIP', 'ROBOT'];
const STATUSES: Vehicle['status'][] = ['ACTIVE', 'IDLE', 'MAINTENANCE', 'OFFLINE'];
const LOCATIONS = [
  'Shanghai Hub A', 'Tokyo Depot 3', 'Singapore Port 7', 'Dubai Zone 12',
  'LA Terminal 5', 'Berlin Node 8', 'Sydney Bay 2', 'Mumbai Corridor 4',
  'São Paulo Gate 6', 'London Arc 9', 'Toronto Link 11', 'Seoul District 1'
];
const DRIVERS = [
  'Marcus Webb', 'Yuki Tanaka', 'Elena Rodriguez', 'James Okafor',
  'Priya Sharma', 'Liam Chen', 'Fatima Al-Hassan', 'Oliver Schmidt',
  'Aisha Mbeki', 'Raj Patel', 'Sofia Rossi', 'Kai Nakamura'
];

function generateVehicles(count: number): Vehicle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `NF-${String(i + 1001).padStart(4, '0')}`,
    name: `${VEHICLE_TYPES[i % VEHICLE_TYPES.length]}-${String(i + 1).padStart(3, '0')}`,
    type: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
    status: STATUSES[i % STATUSES.length],
    currentLocation: LOCATIONS[i % LOCATIONS.length],
    lat: 25 + Math.random() * 30,
    lng: -10 + Math.random() * 140,
    driver: DRIVERS[i % DRIVERS.length],
    fuelLevel: Math.floor(Math.random() * 100),
    lastMaintenance: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    nextDelivery: `2024-12-${String((i % 28) + 1).padStart(2, '0')}T${String((i % 24)).padStart(2, '0')}:00:00Z`,
    capacity: `${Math.floor(Math.random() * 5000 + 500)} kg`,
  }));
}

// In-memory store
let vehicles = generateVehicles(24);

// Mock API service (simulates Spring Boot backend)
export const api = {
  // Auth
  async login(username: string, password: string) {
    return { success: username === 'admin' && password === 'admin123' };
  },

  // Fleet Management - GET /api/admin/fleets
  async getFleets(): Promise<Vehicle[]> {
    await new Promise(r => setTimeout(r, 300));
    return [...vehicles];
  },

  // Fleet Management - POST /api/admin/fleets
  async createFleet(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    await new Promise(r => setTimeout(r, 400));
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `NF-${String(vehicles.length + 1001).padStart(4, '0')}`,
    };
    vehicles = [...vehicles, newVehicle];
    return newVehicle;
  },

  // Fleet Management - PUT /api/admin/fleets/:id
  async updateFleet(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    await new Promise(r => setTimeout(r, 400));
    vehicles = vehicles.map(v => v.id === id ? { ...v, ...vehicle } : v);
    return vehicles.find(v => v.id === id)!;
  },

  // Fleet Management - DELETE /api/admin/fleets/:id
  async deleteFleet(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    vehicles = vehicles.filter(v => v.id !== id);
  },

  // Dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 200));
    return {
      totalVehicles: vehicles.length,
      activeDeliveries: 147,
      onTimeRate: 94.7,
      fuelEfficiency: 87.3,
      revenue: 2847500,
      pendingAlerts: 12,
    };
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    await new Promise(r => setTimeout(r, 200));
    return [
      { id: '1', type: 'CRITICAL', message: 'Engine overheating detected on TRUCK-003', timestamp: '2 min ago', vehicleId: 'NF-1003' },
      { id: '2', type: 'WARNING', message: 'Route deviation on DRONE-007 - possible GPS interference', timestamp: '8 min ago', vehicleId: 'NF-1007' },
      { id: '3', type: 'INFO', message: 'Scheduled maintenance due for VAN-012 in 24 hours', timestamp: '15 min ago', vehicleId: 'NF-1012' },
      { id: '4', type: 'WARNING', message: 'Fuel level below 20% on SHIP-005', timestamp: '22 min ago', vehicleId: 'NF-1005' },
      { id: '5', type: 'CRITICAL', message: 'Communication lost with ROBOT-015 in Zone 4', timestamp: '31 min ago', vehicleId: 'NF-1015' },
      { id: '6', type: 'INFO', message: 'New delivery route optimized - saving 12% fuel', timestamp: '45 min ago' },
    ];
  },

  // Delivery routes
  async getRoutes(): Promise<DeliveryRoute[]> {
    await new Promise(r => setTimeout(r, 200));
    return [
      { id: 'R-001', origin: 'Shanghai Hub A', destination: 'Tokyo Depot 3', status: 'IN_TRANSIT', eta: '2h 34m', vehicleId: 'NF-1001' },
      { id: 'R-002', origin: 'Dubai Zone 12', destination: 'Berlin Node 8', status: 'IN_TRANSIT', eta: '6h 12m', vehicleId: 'NF-1004' },
      { id: 'R-003', origin: 'LA Terminal 5', destination: 'Toronto Link 11', status: 'DELAYED', eta: '4h 45m', vehicleId: 'NF-1005' },
      { id: 'R-004', origin: 'Singapore Port 7', destination: 'Mumbai Corridor 4', status: 'COMPLETED', eta: 'Arrived', vehicleId: 'NF-1002' },
      { id: 'R-005', origin: 'Sydney Bay 2', destination: 'Seoul District 1', status: 'PENDING', eta: '8h 20m', vehicleId: 'NF-1006' },
    ];
  },
};
