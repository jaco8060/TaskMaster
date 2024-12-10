-- backend/schema.sql

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    reset_password_token VARCHAR(255),
    reset_password_expires BIGINT,
    assigned_by INT REFERENCES users(id)
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Assigned Personnel Table
CREATE TABLE IF NOT EXISTS assigned_personnel (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tickets Table
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

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    ticket_id INT REFERENCES tickets(id),
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ticket History Table
CREATE TABLE IF NOT EXISTS ticket_history (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id),
    old_title TEXT,
    new_title TEXT,
    old_description TEXT,
    new_description TEXT,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    old_priority VARCHAR(20),
    new_priority VARCHAR(20),
    old_project_id INT,
    new_project_id INT,
    change_message TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changed_by INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Function to update assigned_personnel role when users role changes
CREATE OR REPLACE FUNCTION update_assigned_personnel_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE assigned_personnel
  SET role = NEW.role
  WHERE user_id = OLD.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update of users table
CREATE TRIGGER user_role_update
AFTER UPDATE OF role ON users
FOR EACH ROW
EXECUTE FUNCTION update_assigned_personnel_role();
