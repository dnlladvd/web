-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_threshold INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'In Stock',
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory_items(id) NOT NULL,
  transaction_type TEXT NOT NULL, -- 'add', 'remove', 'adjust'
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create procurement orders table
CREATE TABLE IF NOT EXISTS procurement_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id),
  order_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Ordered', 'Delivered', 'Cancelled'
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create procurement order items table
CREATE TABLE IF NOT EXISTS procurement_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES procurement_orders(id) NOT NULL,
  item_id UUID REFERENCES inventory_items(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insert default categories
INSERT INTO categories (name, description)
VALUES 
  ('Building Materials', 'Basic construction materials like cement, bricks, etc.'),
  ('Structural Materials', 'Materials used for structural components'),
  ('Wood Materials', 'All types of wood and wood-based products'),
  ('Finishing Materials', 'Materials used for finishing work'),
  ('Electrical', 'Electrical components and materials'),
  ('Plumbing', 'Plumbing fixtures and materials'),
  ('Tools', 'Hand and power tools'),
  ('Equipment', 'Heavy machinery and equipment'),
  ('Safety Equipment', 'Personal protective equipment and safety gear')
ON CONFLICT (name) DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table inventory_items;
alter publication supabase_realtime add table inventory_transactions;
alter publication supabase_realtime add table suppliers;
alter publication supabase_realtime add table procurement_orders;
alter publication supabase_realtime add table procurement_order_items;
