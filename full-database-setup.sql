-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS construction_ims;

-- Use the database
USE construction_ims;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id VARCHAR(36),
  quantity INT DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  min_threshold INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'In Stock',
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create inventory_transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id VARCHAR(36) PRIMARY KEY,
  item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  notes TEXT,
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create procurement_orders table
CREATE TABLE IF NOT EXISTS procurement_orders (
  id VARCHAR(36) PRIMARY KEY,
  supplier_id VARCHAR(36),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pending',
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create procurement_order_items table
CREATE TABLE IF NOT EXISTS procurement_order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  item_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES procurement_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password_hash, full_name) VALUES 
('1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', 'admin@example.com', '$2a$10$yCw.hH1Vdh0OYY9Ql9E5Oe.tEXH3Iq5TBIqvFAvO1uuk5XaGp5Ifi', 'Admin User');

-- Insert categories
INSERT INTO categories (id, name, description) VALUES
('c1b2a3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'Building Materials', 'Basic construction materials'),
('c2b3a4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 'Structural Materials', 'Materials for structural components'),
('c3b4a5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 'Finishing Materials', 'Materials for finishing work'),
('c4b5a6c7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', 'Electrical', 'Electrical components and materials'),
('c5b6a7c8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', 'Wood Materials', 'Wood and wood-based materials');

-- Insert inventory items
INSERT INTO inventory_items (id, name, description, category_id, quantity, unit, min_threshold, status, created_by) VALUES
('i1b2a3i4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'Cement', 'Portland cement 40kg bags', 'c1b2a3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 150, 'bags', 20, 'In Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('i2b3a4i5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 'Steel Rebar', '10mm steel reinforcement bars', 'c2b3a4c5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 75, 'pcs', 30, 'In Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('i3b4a5i6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 'Bricks', 'Standard red clay bricks', 'c1b2a3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 12, 'pallets', 15, 'Low Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('i4b5a6i7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', 'Paint - White', 'Interior white paint', 'c3b4a5c6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 0, 'gallons', 10, 'Out of Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('i5b6a7i8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', 'Plywood', '18mm plywood sheets', 'c5b6a7c8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', 45, 'sheets', 15, 'In Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('i6b7a8i9-d0e1-f2g3-h4i5-j6k7l8m9n0o1', 'Concrete Blocks', 'Standard concrete blocks', 'c1b2a3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 320, 'pcs', 100, 'In Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('i7b8a9i0-d1e2-f3g4-h5i6-j7k8l9m0n1o2', 'Electrical Wire', '2.5mm electrical wire', 'c4b5a6c7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', 8, 'rolls', 10, 'Low Stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p');

-- Insert sample transactions
INSERT INTO inventory_transactions (id, item_id, quantity, previous_quantity, new_quantity, transaction_type, notes, created_by, created_at) VALUES
('t1b2a3t4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'i1b2a3i4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 50, 100, 150, 'Stock In', 'Initial stock', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', NOW() - INTERVAL 5 DAY),
('t2b3a4t5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 'i2b3a4i5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 25, 50, 75, 'Stock In', 'Restocking', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', NOW() - INTERVAL 4 DAY),
('t3b4a5t6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 'i3b4a5i6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 3, 15, 12, 'Stock Out', 'Project usage', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', NOW() - INTERVAL 3 DAY),
('t4b5a6t7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', 'i4b5a6i7-d8e9-f0g1-h2i3-j4k5l6m7n8o9', 10, 10, 0, 'Stock Out', 'Project completion', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', NOW() - INTERVAL 2 DAY),
('t5b6a7t8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', 'i5b6a7i8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', 15, 30, 45, 'Stock In', 'New delivery', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', NOW() - INTERVAL 1 DAY);

-- Insert suppliers
INSERT INTO suppliers (id, name, contact_person, email, phone, address) VALUES
('s1b2a3s4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'ABC Building Supplies', 'John Smith', 'john@abcsupplies.com', '123-456-7890', '123 Main St, Naval, Biliran'),
('s2b3a4s5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 'XYZ Construction Materials', 'Jane Doe', 'jane@xyzmaterials.com', '234-567-8901', '456 Oak Ave, Naval, Biliran'),
('s3b4a5s6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 'Biliran Hardware', 'Mike Johnson', 'mike@biliranhardware.com', '345-678-9012', '789 Pine St, Naval, Biliran');

-- Insert procurement orders
INSERT INTO procurement_orders (id, supplier_id, order_date, status, total_amount, notes, created_by) VALUES
('p1b2a3p4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 's1b2a3s4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', NOW() - INTERVAL 10 DAY, 'Completed', 15000.00, 'Monthly cement order', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('p2b3a4p5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 's2b3a4s5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', NOW() - INTERVAL 7 DAY, 'Completed', 8500.00, 'Steel rebar order', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'),
('p3b4a5p6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 's3b4a5s6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', NOW() - INTERVAL 3 DAY, 'Pending', 4200.00, 'Plywood sheets order', '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p');

-- Insert procurement order items
INSERT INTO procurement_order_items (id, order_id, item_id, quantity, unit_price, total_price) VALUES
('o1b2a3o4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'p1b2a3p4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 'i1b2a3i4-d5e6-f7g8-h9i0-j1k2l3m4n5o6', 50, 300.00, 15000.00),
('o2b3a4o5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 'p2b3a4p5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 'i2b3a4i5-d6e7-f8g9-h0i1-j2k3l4m5n6o7', 25, 340.00, 8500.00),
('o3b4a5o6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 'p3b4a5p6-d7e8-f9g0-h1i2-j3k4l5m6n7o8', 'i5b6a7i8-d9e0-f1g2-h3i4-j5k6l7m8n9o0', 15, 280.00, 4200.00);

-- SQL Commands for CRUD Operations

-- SELECT Queries (Read)
-- Get all inventory items with category names
SELECT i.*, c.name as category_name 
FROM inventory_items i
LEFT JOIN categories c ON i.category_id = c.id;

-- Get low stock items
SELECT i.*, c.name as category_name 
FROM inventory_items i
LEFT JOIN categories c ON i.category_id = c.id
WHERE i.quantity <= i.min_threshold AND i.quantity > 0;

-- Get recent transactions with item names
SELECT t.*, i.name as item_name, i.unit, u.full_name as user_name
FROM inventory_transactions t
JOIN inventory_items i ON t.item_id = i.id
LEFT JOIN users u ON t.created_by = u.id
ORDER BY t.created_at DESC LIMIT 10;

-- INSERT Queries (Create)
-- Add new inventory item
INSERT INTO inventory_items 
(id, name, description, category_id, quantity, unit, min_threshold, status, created_by) 
VALUES 
(UUID(), 'New Item', 'Description here', 'category-id-here', 100, 'pcs', 20, 'In Stock', 'user-id-here');

-- Add new category
INSERT INTO categories 
(id, name, description) 
VALUES 
(UUID(), 'New Category', 'Description here');

-- Record inventory transaction
INSERT INTO inventory_transactions 
(id, item_id, quantity, previous_quantity, new_quantity, transaction_type, notes, created_by) 
VALUES 
(UUID(), 'item-id-here', 10, 100, 110, 'Stock In', 'Restocking', 'user-id-here');

-- UPDATE Queries (Update)
-- Update inventory item
UPDATE inventory_items 
SET name = 'Updated Name', 
    description = 'Updated description', 
    category_id = 'category-id-here', 
    quantity = 150, 
    unit = 'pcs', 
    min_threshold = 25, 
    status = 'In Stock', 
    updated_at = NOW() 
WHERE id = 'item-id-here';

-- Update category
UPDATE categories 
SET name = 'Updated Category', 
    description = 'Updated description', 
    updated_at = NOW() 
WHERE id = 'category-id-here';

-- DELETE Queries (Delete)
-- Delete inventory item
DELETE FROM inventory_items WHERE id = 'item-id-here';

-- Delete category (will fail if items are using this category)
DELETE FROM categories WHERE id = 'category-id-here';

-- Delete transaction
DELETE FROM inventory_transactions WHERE id = 'transaction-id-here';
