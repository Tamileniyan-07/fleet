export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  fullName: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  type: 'TRUCK' | 'DRONE' | 'VAN' | 'SHIP' | 'ROBOT';
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'OFFLINE';
  currentLocation: string;
  lat: number;
  lng: number;
  driver: string;
  fuelLevel: number;
  lastMaintenance: string;
  nextDelivery: string;
  capacity: string;
}

export interface DashboardStats {
  totalVehicles: number;
  activeDeliveries: number;
  onTimeRate: number;
  fuelEfficiency: number;
  revenue: number;
  pendingAlerts: number;
}

export interface Alert {
  id: string;
  type: 'WARNING' | 'CRITICAL' | 'INFO';
  message: string;
  timestamp: string;
  vehicleId?: string;
}

export interface DeliveryRoute {
  id: string;
  origin: string;
  destination: string;
  status: 'IN_TRANSIT' | 'COMPLETED' | 'PENDING' | 'DELAYED';
  eta: string;
  vehicleId: string;
}
