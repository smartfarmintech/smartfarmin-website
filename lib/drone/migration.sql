-- Drone Services Tables Migration

-- Create drone_categories table
CREATE TABLE IF NOT EXISTS drone_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drone_operators table
CREATE TABLE IF NOT EXISTS drone_operators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  dgca_license_number TEXT UNIQUE,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  experience_years INTEGER DEFAULT 0,
  service_area_radius_km NUMERIC DEFAULT 25,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  rating_avg NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create drones table
CREATE TABLE IF NOT EXISTS drones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES drone_operators(id),
  drone_model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  drone_category TEXT REFERENCES drone_categories(name),
  payload_capacity_kg NUMERIC,
  battery_capacity_minutes INTEGER,
  camera_type TEXT,
  tank_capacity_liters NUMERIC,
  gps_accuracy_meters NUMERIC,
  total_flight_hours NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create drone_availability table
CREATE TABLE IF NOT EXISTS drone_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES drone_operators(id),
  available_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drone_bookings table
CREATE TABLE IF NOT EXISTS drone_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id),
  farm_id UUID REFERENCES lands(id),
  drone_id UUID REFERENCES drones(id),
  operator_id UUID REFERENCES drone_operators(id),
  crop_name TEXT NOT NULL,
  area_acres NUMERIC NOT NULL,
  service_type TEXT NOT NULL,
  special_instructions TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  booking_status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  confirmed_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  estimated_cost NUMERIC,
  final_cost NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create drone_flights table
CREATE TABLE IF NOT EXISTS drone_flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES drone_bookings(id),
  drone_id UUID NOT NULL REFERENCES drones(id),
  operator_id UUID NOT NULL REFERENCES drone_operators(id),
  area_acres NUMERIC,
  flight_duration_minutes INTEGER,
  battery_used_percent NUMERIC,
  coverage_quality TEXT,
  images_captured INTEGER DEFAULT 0,
  post_flight_report JSONB,
  crop_analysis JSONB,
  flight_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'completed',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drone_analyses table
CREATE TABLE IF NOT EXISTS drone_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES drone_bookings(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  analysis_type TEXT NOT NULL,
  crop_stress_data JSONB,
  spray_schedule_data JSONB,
  pesticide_data JSONB,
  flight_plan_data JSONB,
  ndvi_data JSONB,
  coverage_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drone_ratings table
CREATE TABLE IF NOT EXISTS drone_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES farmers(id),
  operator_id UUID NOT NULL REFERENCES drone_operators(id),
  drone_id UUID REFERENCES drones(id),
  booking_id UUID REFERENCES drone_bookings(id),
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drone_maintenance table
CREATE TABLE IF NOT EXISTS drone_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drone_id UUID NOT NULL REFERENCES drones(id),
  maintenance_type TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  cost NUMERIC,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drone_analytics table
CREATE TABLE IF NOT EXISTS drone_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES drone_operators(id),
  analysis_date DATE DEFAULT CURRENT_DATE,
  total_flights INTEGER DEFAULT 0,
  total_area_acres NUMERIC DEFAULT 0,
  avg_flight_time NUMERIC,
  revenue NUMERIC,
  operational_hours NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE drone_operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE drones ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE drone_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drone_operators
CREATE POLICY "drone_operators_read" ON drone_operators
  FOR SELECT USING (TRUE);

CREATE POLICY "drone_operators_self_update" ON drone_operators
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for drones
CREATE POLICY "drones_read" ON drones
  FOR SELECT USING (TRUE);

CREATE POLICY "drones_owner_write" ON drones
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM drone_operators WHERE id = drones.operator_id
  ));

-- RLS Policies for drone_bookings
CREATE POLICY "drone_bookings_access" ON drone_bookings
  FOR ALL USING (
    auth.uid() = farmer_id OR 
    auth.uid() IN (SELECT user_id FROM drone_operators WHERE id = drone_bookings.operator_id)
  );

-- RLS Policies for drone_flights
CREATE POLICY "drone_flights_access" ON drone_flights
  FOR ALL USING (
    auth.uid() IN (
      SELECT farmer_id FROM drone_bookings WHERE id = drone_flights.booking_id
    ) OR
    auth.uid() = operator_id
  );

-- RLS Policies for drone_analyses
CREATE POLICY "drone_analyses_access" ON drone_analyses
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for drone_ratings
CREATE POLICY "drone_ratings_read" ON drone_ratings
  FOR SELECT USING (TRUE);

CREATE POLICY "drone_ratings_write" ON drone_ratings
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

-- Create indexes for performance
CREATE INDEX idx_drone_operators_user_id ON drone_operators(user_id);
CREATE INDEX idx_drones_operator_id ON drones(operator_id);
CREATE INDEX idx_drone_availability_operator_date ON drone_availability(operator_id, available_date);
CREATE INDEX idx_drone_bookings_farmer_id ON drone_bookings(farmer_id);
CREATE INDEX idx_drone_bookings_operator_id ON drone_bookings(operator_id);
CREATE INDEX idx_drone_bookings_status ON drone_bookings(booking_status);
CREATE INDEX idx_drone_flights_booking_id ON drone_flights(booking_id);
CREATE INDEX idx_drone_flights_drone_id ON drone_flights(drone_id);
CREATE INDEX idx_drone_analyses_booking_id ON drone_analyses(booking_id);
CREATE INDEX idx_drone_ratings_operator_id ON drone_ratings(operator_id);
CREATE INDEX idx_drone_maintenance_drone_id ON drone_maintenance(drone_id);
CREATE INDEX idx_drone_analytics_operator_id ON drone_analytics(operator_id);
