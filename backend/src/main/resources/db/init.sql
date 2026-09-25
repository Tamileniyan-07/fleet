-- ============================================
-- NeuroFleet AI Logistics Platform
-- Database Initialization Script
-- ============================================
-- This script runs automatically when the PostgreSQL container starts
-- for the first time (via docker-entrypoint-initdb.d).

-- Create custom types
DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('TRUCK', 'DRONE', 'VAN', 'SHIP', 'ROBOT');
    CREATE TYPE vehicle_status AS ENUM ('ACTIVE', 'IDLE', 'MAINTENANCE', 'OFFLINE');
    CREATE TYPE user_role AS ENUM ('ADMIN', 'OPERATOR', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'VIEWER',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fleets table
CREATE TABLE IF NOT EXISTS fleets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type vehicle_type NOT NULL,
    status vehicle_status NOT NULL DEFAULT 'IDLE',
    current_location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    driver VARCHAR(100) NOT NULL,
    fuel_level INTEGER NOT NULL DEFAULT 100 CHECK (fuel_level >= 0 AND fuel_level <= 100),
    capacity VARCHAR(50) NOT NULL,
    last_maintenance DATE,
    next_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_fleets_status ON fleets(status);
CREATE INDEX IF NOT EXISTS idx_fleets_type ON fleets(type);
CREATE INDEX IF NOT EXISTS idx_fleets_location ON fleets(current_location);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Insert default admin user
-- Password: admin123 (BCrypt hash)
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES (
    'admin',
    'admin@neurofleet.ai',
    '$2a$12$LJ3m4ys3Lk0TSwHjGBOUduWJJuQlA0vYSvGKjFQxL8rFxMnJmW3Wy',
    'Commander Alex Chen',
    'ADMIN'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample fleet data
INSERT INTO fleets (name, type, status, current_location, latitude, longitude, driver, fuel_level, capacity)
VALUES
    ('TRUCK-001', 'TRUCK', 'ACTIVE', 'Shanghai Hub A', 31.2304, 121.4737, 'Marcus Webb', 87, '5000 kg'),
    ('DRONE-002', 'DRONE', 'ACTIVE', 'Tokyo Depot 3', 35.6762, 139.6503, 'Yuki Tanaka', 92, '50 kg'),
    ('VAN-003', 'VAN', 'IDLE', 'Singapore Port 7', 1.3521, 103.8198, 'Elena Rodriguez', 65, '1500 kg'),
    ('SHIP-004', 'SHIP', 'ACTIVE', 'Dubai Zone 12', 25.2048, 55.2708, 'James Okafor', 78, '50000 kg'),
    ('ROBOT-005', 'ROBOT', 'MAINTENANCE', 'LA Terminal 5', 34.0522, -118.2437, 'Priya Sharma', 45, '200 kg'),
    ('TRUCK-006', 'TRUCK', 'ACTIVE', 'Berlin Node 8', 52.5200, 13.4050, 'Liam Chen', 91, '5000 kg'),
    ('DRONE-007', 'DRONE', 'ACTIVE', 'Sydney Bay 2', -33.8688, 151.2093, 'Fatima Al-Hassan', 88, '50 kg'),
    ('VAN-008', 'VAN', 'OFFLINE', 'Mumbai Corridor 4', 19.0760, 72.8777, 'Oliver Schmidt', 12, '1500 kg')
ON CONFLICT DO NOTHING;
