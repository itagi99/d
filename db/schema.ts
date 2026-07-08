import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const vehicleTypes = sqliteTable('vehicle_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // Hatchback, Sedan, SUV
  slug: text('slug').notNull().unique(),
  seatCapacity: integer('seat_capacity').notNull(),
  ac: integer('ac', { mode: 'boolean' }).default(true),
  fuelType: text('fuel_type').default('CNG'), // CNG, Diesel, Petrol, Electric
  rating: real('rating').default(5.0),
  imageUrl: text('image_url'),
  description: text('description'),
  luggageCapacity: integer('luggage_capacity').default(2),
});

export const vehiclePackages = sqliteTable('vehicle_packages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  vehicleTypeId: integer('vehicle_type_id').notNull().references(() => vehicleTypes.id),
  packageType: text('package_type').notNull(), // local_4hr_40km, local_8hr_80km, local_12hr_120km, outstation_one_way, outstation_round_trip, airport
  baseFare: real('base_fare').notNull(), // in INR
  extraKmRate: real('extra_km_rate').notNull(),
  extraHourRate: real('extra_hour_rate').notNull(),
  driverAllowance: real('driver_allowance').default(0),
  nightAllowance: real('night_allowance').default(0),
  tollTaxes: real('toll_taxes').default(0),
  stateTax: real('state_tax').default(0),
  gstPercent: real('gst_percent').default(5),
  discountPercent: real('discount_percent').default(0),
  includedKms: integer('included_kms').default(0),
  includedHours: integer('included_hours').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

export const addOns = sqliteTable('add_ons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  icon: text('icon'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

export const coupons = sqliteTable('coupons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  discountPercent: real('discount_percent'),
  discountAmount: real('discount_amount'),
  maxDiscount: real('max_discount'),
  minBookingAmount: real('min_booking_amount').default(0),
  validFrom: integer('valid_from', { mode: 'timestamp' }),
  validUntil: integer('valid_until', { mode: 'timestamp' }),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  bookingNumber: text('booking_number').notNull().unique(),

  // Trip details
  tripType: text('trip_type').notNull(), // one_way, round_trip, local, airport
  packageSlug: text('package_slug'),

  // Locations
  fromLocation: text('from_location').notNull(),
  fromLat: real('from_lat'),
  fromLng: real('from_lng'),
  toLocation: text('to_location'),
  toLat: real('to_lat'),
  toLng: real('to_lng'),
  stops: text('stops'), // JSON array of stop locations

  // Vehicle
  vehicleTypeId: integer('vehicle_type_id').notNull().references(() => vehicleTypes.id),
  vehiclePackageId: integer('vehicle_package_id').references(() => vehiclePackages.id),

  // Timing
  pickupDate: text('pickup_date').notNull(), // YYYY-MM-DD
  pickupTime: text('pickup_time').notNull(), // HH:MM
  returnDate: text('return_date'),
  returnTime: text('return_time'),

  // Passenger
  passengerName: text('passenger_name').notNull(),
  passengerPhone: text('passenger_phone').notNull(),
  passengerEmail: text('passenger_email'),
  pickupAddress: text('pickup_address'),
  alternatePhone: text('alternate_phone'),
  gstNumber: text('gst_number'),

  // Pricing
  baseFare: real('base_fare').notNull(),
  extraKm: integer('extra_km').default(0),
  extraKmCharge: real('extra_km_charge').default(0),
  extraHour: integer('extra_hour').default(0),
  extraHourCharge: real('extra_hour_charge').default(0),
  driverAllowance: real('driver_allowance').default(0),
  nightCharge: real('night_charge').default(0),
  tollParking: real('toll_parking').default(0),
  stateTax: real('state_tax').default(0),
  addOnsTotal: real('add_ons_total').default(0),
  couponDiscount: real('coupon_discount').default(0),
  couponCode: text('coupon_code'),
  gstAmount: real('gst_amount').default(0),
  totalFare: real('total_fare').notNull(),
  payableNow: real('payable_now').default(0), // partial payment

  // Status
  status: text('status').default('pending'), // pending, confirmed, assigned, ongoing, completed, cancelled
  paymentStatus: text('payment_status').default('pending'), // pending, partial, paid, refunded

  // Driver assignment
  driverId: integer('driver_id'),
  driverName: text('driver_name'),
  driverPhone: text('driver_phone'),
  vehicleNumber: text('vehicle_number'),

  // Meta
  specialInstructions: text('special_instructions'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const bookingAddOns = sqliteTable('booking_add_ons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  addOnId: integer('add_on_id').notNull().references(() => addOns.id),
  quantity: integer('quantity').default(1),
  price: real('price').notNull(),
});

export const drivers = sqliteTable('drivers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  licenseNumber: text('license_number').notNull().unique(),
  vehicleNumber: text('vehicle_number').notNull(),
  vehicleTypeId: integer('vehicle_type_id').references(() => vehicleTypes.id),
  rating: real('rating').default(5.0),
  totalTrips: integer('total_trips').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  currentLocationLat: real('current_location_lat'),
  currentLocationLng: real('current_location_lng'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  userId: integer('user_id').references(() => users.id),
  amount: real('amount').notNull(),
  paymentMethod: text('payment_method').notNull(), // upi, card, netbanking, wallet, cash
  paymentStatus: text('payment_status').default('pending'), // pending, success, failed, refunded
  transactionId: text('transaction_id'),
  gatewayResponse: text('gateway_response'),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  userId: integer('user_id').notNull().references(() => users.id),
  driverId: integer('driver_id').references(() => drivers.id),
  vehicleRating: integer('vehicle_rating'),
  driverRating: integer('driver_rating'),
  overallRating: integer('overall_rating').notNull(),
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').default('India'),
  lat: real('lat'),
  lng: real('lng'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
});

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').default('open'), // open, resolved, closed
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});
