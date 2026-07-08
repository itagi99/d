-- Vehigo Database Schema for Turso (SQLite)
-- Run this in your Turso dashboard or via CLI: turso db shell <db-name> < schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
);

-- Vehicle Types
CREATE TABLE IF NOT EXISTS vehicle_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    seat_capacity INTEGER NOT NULL,
    ac INTEGER DEFAULT 1,
    fuel_type TEXT DEFAULT 'CNG',
    rating REAL DEFAULT 5.0,
    image_url TEXT,
    description TEXT,
    luggage_capacity INTEGER DEFAULT 2
);

-- Vehicle Packages (Pricing)
CREATE TABLE IF NOT EXISTS vehicle_packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_type_id INTEGER NOT NULL,
    package_type TEXT NOT NULL,
    base_fare REAL NOT NULL,
    extra_km_rate REAL NOT NULL,
    extra_hour_rate REAL NOT NULL,
    driver_allowance REAL DEFAULT 0,
    night_allowance REAL DEFAULT 0,
    toll_taxes REAL DEFAULT 0,
    state_tax REAL DEFAULT 0,
    gst_percent REAL DEFAULT 5,
    discount_percent REAL DEFAULT 0,
    included_kms INTEGER DEFAULT 0,
    included_hours INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id)
);

-- Add-ons
CREATE TABLE IF NOT EXISTS add_ons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    icon TEXT,
    is_active INTEGER DEFAULT 1
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    discount_percent REAL,
    discount_amount REAL,
    max_discount REAL,
    min_booking_amount REAL DEFAULT 0,
    valid_from INTEGER,
    valid_until INTEGER,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
);

-- Bookings (Main)
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    booking_number TEXT NOT NULL UNIQUE,
    trip_type TEXT NOT NULL,
    package_slug TEXT,
    from_location TEXT NOT NULL,
    from_lat REAL,
    from_lng REAL,
    to_location TEXT,
    to_lat REAL,
    to_lng REAL,
    stops TEXT,
    vehicle_type_id INTEGER NOT NULL,
    vehicle_package_id INTEGER,
    pickup_date TEXT NOT NULL,
    pickup_time TEXT NOT NULL,
    return_date TEXT,
    return_time TEXT,
    passenger_name TEXT NOT NULL,
    passenger_phone TEXT NOT NULL,
    passenger_email TEXT,
    pickup_address TEXT,
    alternate_phone TEXT,
    gst_number TEXT,
    base_fare REAL NOT NULL,
    extra_km INTEGER DEFAULT 0,
    extra_km_charge REAL DEFAULT 0,
    extra_hour INTEGER DEFAULT 0,
    extra_hour_charge REAL DEFAULT 0,
    driver_allowance REAL DEFAULT 0,
    night_charge REAL DEFAULT 0,
    toll_parking REAL DEFAULT 0,
    state_tax REAL DEFAULT 0,
    add_ons_total REAL DEFAULT 0,
    coupon_discount REAL DEFAULT 0,
    coupon_code TEXT,
    gst_amount REAL DEFAULT 0,
    total_fare REAL NOT NULL,
    payable_now REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    driver_id INTEGER,
    driver_name TEXT,
    driver_phone TEXT,
    vehicle_number TEXT,
    special_instructions TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id),
    FOREIGN KEY (vehicle_package_id) REFERENCES vehicle_packages(id)
);

-- Booking Add-ons junction
CREATE TABLE IF NOT EXISTS booking_add_ons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    add_on_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    price REAL NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (add_on_id) REFERENCES add_ons(id)
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    license_number TEXT NOT NULL UNIQUE,
    vehicle_number TEXT NOT NULL,
    vehicle_type_id INTEGER,
    rating REAL DEFAULT 5.0,
    total_trips INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    current_location_lat REAL,
    current_location_lng REAL,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    user_id INTEGER,
    amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    transaction_id TEXT,
    gateway_response TEXT,
    paid_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    driver_id INTEGER,
    vehicle_rating INTEGER,
    driver_rating INTEGER,
    overall_rating INTEGER NOT NULL,
    comment TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Locations (Cities)
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    lat REAL,
    lng REAL,
    is_active INTEGER DEFAULT 1,
    is_popular INTEGER DEFAULT 0
);

-- Contacts / Support
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);

-- Seed data: Vehicle Types
INSERT OR IGNORE INTO vehicle_types (id, name, slug, seat_capacity, ac, fuel_type, rating, description, luggage_capacity) VALUES
(1, 'Hatchback', 'hatchback', 4, 1, 'CNG', 4.5, 'Compact AC cab, perfect for city rides', 2),
(2, 'Sedan', 'sedan', 4, 1, 'CNG', 4.7, 'Comfortable 4-seater AC cab with extra legroom', 3),
(3, 'SUV', 'suv', 6, 1, 'Diesel', 4.8, 'Spacious 6-seater AC cab for family trips', 4),
(4, 'Tempo Traveller', 'tempo-traveller', 12, 1, 'Diesel', 4.6, 'Large group travel solution', 10);

-- Seed data: Vehicle Packages (Local Belgaum pricing from screenshots)
INSERT OR IGNORE INTO vehicle_packages (id, vehicle_type_id, package_type, base_fare, extra_km_rate, extra_hour_rate, driver_allowance, gst_percent, included_kms, included_hours, is_active) VALUES
-- Local 8hr/80km packages (from screenshots)
(1, 1, 'local_8hr_80km', 2450, 12.0, 150.0, 0, 5, 80, 8, 1),
(2, 2, 'local_8hr_80km', 2500, 12.0, 150.0, 0, 5, 80, 8, 1),
(3, 3, 'local_8hr_80km', 3428, 14.0, 200.0, 0, 5, 80, 8, 1),
-- Local 4hr/40km packages
(4, 1, 'local_4hr_40km', 1450, 12.0, 150.0, 0, 5, 40, 4, 1),
(5, 2, 'local_4hr_40km', 1550, 12.0, 150.0, 0, 5, 40, 4, 1),
(6, 3, 'local_4hr_40km', 2200, 14.0, 200.0, 0, 5, 40, 4, 1),
-- Local 12hr/120km packages
(7, 1, 'local_12hr_120km', 3450, 12.0, 150.0, 0, 5, 120, 12, 1),
(8, 2, 'local_12hr_120km', 3550, 12.0, 150.0, 0, 5, 120, 12, 1),
(9, 3, 'local_12hr_120km', 4800, 14.0, 200.0, 0, 5, 120, 12, 1),
-- Outstation one-way (per km approx)
(10, 1, 'outstation_one_way', 11, 11.0, 150.0, 250, 5, 0, 0, 1),
(11, 2, 'outstation_one_way', 13, 13.0, 150.0, 250, 5, 0, 0, 1),
(12, 3, 'outstation_one_way', 18, 18.0, 200.0, 300, 5, 0, 0, 1),
-- Outstation round-trip (per km approx)
(13, 1, 'outstation_round_trip', 10, 10.0, 150.0, 250, 5, 0, 0, 1),
(14, 2, 'outstation_round_trip', 12, 12.0, 150.0, 250, 5, 0, 0, 1),
(15, 3, 'outstation_round_trip', 16, 16.0, 200.0, 300, 5, 0, 0, 1);

-- Seed data: Add-ons
INSERT OR IGNORE INTO add_ons (id, name, description, price, icon, is_active) VALUES
(1, 'Cab with Luggage Carrier', 'Roof carrier for extra luggage', 149, 'luggage', 1),
(2, 'New Car Promise - 2023 or newer', 'Guaranteed vehicle model year 2023 or newer', 249, 'car', 1),
(3, 'Chauffeur who knows your language', 'Driver fluent in your preferred language', 199, 'user', 1),
(4, 'Additional Driver', 'Extra driver for long journeys', 299, 'users', 1),
(5, 'Child Seat', 'ISOFIX child safety seat', 99, 'baby', 1);

-- Seed data: Coupons
INSERT OR IGNORE INTO coupons (id, code, discount_percent, max_discount, min_booking_amount, usage_limit, is_active) VALUES
(1, 'WELCOME50', 50, 500, 1000, 1000, 1),
(2, 'VEHIGO20', 20, 300, 1500, 500, 1),
(3, 'FIRST RIDE', 17, 250, 500, 1, 1),
(4, 'HOLIDAY10', 10, 200, 2000, 200, 1);

-- Seed data: Locations (Popular cities)
INSERT OR IGNORE INTO locations (id, city, state, country, is_active, is_popular) VALUES
(1, 'Belgaum', 'Karnataka', 'India', 1, 1),
(2, 'Bangalore', 'Karnataka', 'India', 1, 1),
(3, 'Mumbai', 'Maharashtra', 'India', 1, 1),
(4, 'Pune', 'Maharashtra', 'India', 1, 1),
(5, 'Goa', 'Goa', 'India', 1, 1),
(6, 'Hyderabad', 'Telangana', 'India', 1, 1),
(7, 'Chennai', 'Tamil Nadu', 'India', 1, 1),
(8, 'Delhi', 'Delhi', 'India', 1, 1),
(9, 'Jaipur', 'Rajasthan', 'India', 1, 1),
(10, 'Ahmedabad', 'Gujarat', 'India', 1, 1);
