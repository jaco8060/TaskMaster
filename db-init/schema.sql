-- Create pg_cron extension if it doesn't already exist
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create organizations table without foreign key
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    org_code VARCHAR(20) UNIQUE,
    code_expiration TIMESTAMP WITH TIME ZONE,
    admin_id INT, -- No REFERENCES yet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table without foreign keys
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    profile_picture VARCHAR(255) DEFAULT 'default_profile.svg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    reset_password_token VARCHAR(255),
    reset_password_expires BIGINT,
    assigned_by INT, -- No REFERENCES yet
    organization_id INT -- No REFERENCES yet
);

-- Add foreign key constraints to organizations
ALTER TABLE organizations
ADD CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users(id);

-- Add foreign key constraints to users
ALTER TABLE users
ADD CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create assigned_personnel table
CREATE TABLE IF NOT EXISTS assigned_personnel (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    reported_by INT REFERENCES users(id),
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_history (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
    property VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by INT REFERENCES users(id)
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to update assigned_personnel role
CREATE OR REPLACE FUNCTION update_assigned_personnel_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assigned_personnel
  SET role = NEW.role
  WHERE user_id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user role updates
CREATE TRIGGER user_role_update
AFTER UPDATE OF role ON users
FOR EACH ROW
EXECUTE FUNCTION update_assigned_personnel_role();

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ticket_id INT REFERENCES tickets(id) ON DELETE SET NULL,
    project_id INT REFERENCES projects(id) ON DELETE SET NULL
);

-- Create assigned_ticket_users table
CREATE TABLE IF NOT EXISTS assigned_ticket_users (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
    id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);

-- Schedule a job to update org_code every minute
SELECT cron.schedule('update_org_codes', '* * * * *', $$
  UPDATE organizations
  SET org_code = substring(gen_random_uuid()::text, 1, 20),
      code_expiration = NOW() + INTERVAL '1 minute';
$$);