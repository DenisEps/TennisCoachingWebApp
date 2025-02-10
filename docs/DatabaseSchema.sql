-- Enable the pgcrypto extension for generating UUIDs (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
-- Stores both client and coach information.
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('coach', 'client')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Coach Profiles Table
-- Stores coach-specific information.
CREATE TABLE coach_profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  bio TEXT,
  experience_years INTEGER,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Coach Availability Table
-- Allows coaches to set their recurring availability (e.g., working hours per day).
CREATE TABLE coach_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES users(id),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- 4. Sessions Table
-- Stores booking details between a coach and a client.
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES users(id),
  client_id UUID REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_session_time CHECK (start_time < end_time)
);

-- 5. News Feed Table
-- Enables coaches to post announcements or news.
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security Policies

-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Coach profiles policies
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach profiles are viewable by all"
  ON coach_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coaches can update their own profiles"
  ON coach_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Coach availability policies
ALTER TABLE coach_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach availability is viewable by all"
  ON coach_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coaches can manage their availability"
  ON coach_availability FOR ALL
  USING (auth.uid() = coach_id);

-- Sessions policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = coach_id);

CREATE POLICY "Clients can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = coach_id);

-- News policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News is viewable by all authenticated users"
  ON news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Coaches can create and manage news"
  ON news FOR ALL
  USING (auth.uid() = coach_id);

-- Functions and Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_profiles_updated_at
    BEFORE UPDATE ON coach_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_availability_updated_at
    BEFORE UPDATE ON coach_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
