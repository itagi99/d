'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Phone, Mail, User, Check, ChevronDown, Shield, CreditCard, Wallet, Building2 } from 'lucide-react';

interface AddOn {
  id: number;
  name: string;
  price: number;
  selected: boolean;
}

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<any>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    pickupLocation: '',
    alternateEmail: '',
    gstNumber: '',
  });

  const [paymentMode, setPaymentMode] = useState<'partial' | 'full'>('partial');

  useEffect(() => {
    const vehicleId = searchParams.get('vehicleId');
    if (vehicleId) {
      fetch(`/api/vehicles/${vehicleId}`)
        .then(r => r.json())
        .then(data => setVehicle(data.vehicle));
    }

    fetch('/api/addons')
      .then(r => r.json())
      .then(data => setAddOns(data.addOns.map((a: any) => ({ ...a, selected: false }))));
  }, [searchParams]);

  const toggleAddOn = (id: number) => {
    setAddOns(addOns.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME50') {
      setDiscount(500);
      setCouponApplied(true);
    } else if (coupon.toUpperCase() === 'VEHIGO20') {
      setDiscount(300);
      setCouponApplied(true);
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const baseFare = vehicle.baseFare || 2450;
  const addOnsTotal = addOns.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);
  const gstAmount = (baseFare + addOnsTotal) * 0.05;
  const totalFare = baseFare + addOnsTotal + gstAmount - discount;
  const payableNow = paymentMode === 'partial' ? Math.round(totalFare * 0.25) : totalFare;

  const handleBook = async () => {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        vehicleId: vehicle.id,
        addOns: addOns.filter(a => a.selected).map(a => a.id),
        couponCode: couponApplied ? coupon : null,
        totalFare,
        payableNow,
        paymentMode,
        tripType: searchParams.get('tripType') || 'local',
        from: searchParams.get('from'),
        to: searchParams.get('to'),
        date: searchParams.get('date'),
        time: searchParams.get('time'),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/bookings/${data.bookingId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Review Your Booking</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Trip Summary */}
        <div className="card">
          <h3 className="font-bold text-lg mb-3">Trip Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-medium">{searchParams.get('tripType') === 'local' ? 'Local Rental' : 'Outstation'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">From</span>
              <span className="font-medium">{searchParams.get('from')}</span>
            </div>
            {searchParams.get('to') && (
              <div className="flex justify-between">
                <span className="text-gray-500">To</span>
                <span className="font-medium">{searchParams.get('to')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium">{searchParams.get('date')} | {searchParams.get('time')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-medium">{vehicle.name}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Free cancellation till 1 hr of departure</span>
          </div>
        </div>

        {/* Contact Details */}
        <div className="card space-y-4">
          <h3 className="font-bold text-lg">Contact & Pickup Details</h3>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
            <input 
              type="text" 
              className="input-field"
              value={form.fullName}
              onChange={e => setForm({...form, fullName: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-20">
              <label className="text-sm text-gray-600 mb-1 block">Code</label>
              <div className="input-field flex items-center gap-1 text-gray-500">
                <Phone className="w-4 h-4" /> +91
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">Mobile Number</label>
              <input 
                type="tel" 
                className="input-field"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="7795966127"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email ID</label>
            <input 
              type="email" 
              className="input-field"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Pickup Location</label>
            <input 
              type="text" 
              className="input-field"
              value={form.pickupLocation}
              onChange={e => setForm({...form, pickupLocation: e.target.value})}
              placeholder="Enter pickup address"
            />
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-ocean-600 text-sm font-medium">
              <Mail className="w-4 h-4" /> + Alternate Email
            </button>
            <button className="flex items-center gap-2 text-ocean-600 text-sm font-medium">
              <Building2 className="w-4 h-4" /> + Add GST
            </button>
          </div>
        </div>

        {/* Coupon */}
        <div className="card">
          <h3 className="font-bold text-lg mb-3">Coupons & Offers</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="input-field flex-1 uppercase"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="ENTER A COUPON"
            />
            <button 
              onClick={applyCoupon}
              className="btn-ocean px-6"
            >
              APPLY
            </button>
          </div>
          {couponApplied && (
            <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
              <Check className="w-4 h-4" /> Coupon applied! You saved ₹{discount}
            </p>
          )}
        </div>

        {/* Add-ons */}
        <div className="card">
          <h3 className="font-bold text-lg mb-1">Personalize Your Journey</h3>
          <p className="text-sm text-gray-500 mb-4">Enhance your travel experience with our premium add-ons</p>

          <div className="space-y-3">
            {addOns.map(addon => (
              <div 
                key={addon.id}
                onClick={() => toggleAddOn(addon.id)}
                className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  addon.selected ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    addon.selected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                  }`}>
                    {addon.selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{addon.name}</p>
                    {addon.id === 1 && <p className="text-xs text-primary-600 font-medium">Most Popular</p>}
                  </div>
                </div>
                <span className="font-bold text-gray-900">₹{addon.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions/Exclusions */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Inclusions/Exclusions</h3>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="w-4 h-4" />
              <span>Inclusions: Fuel Charges, Driver Allowance, GST (5%)</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              <span>Exclusions: Pay ₹12/km after 80 km, Pay ₹149/hr after 8 hours, Toll / State tax, Night Allowance, Parking</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Total Fare</h3>
            <span className="text-2xl font-bold text-gray-900">₹{Math.round(totalFare)}</span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setPaymentMode('partial')}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                paymentMode === 'partial' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Book at ₹0<br/><span className="text-xs font-normal">Pay 25% now</span>
            </button>
            <button 
              onClick={() => setPaymentMode('full')}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                paymentMode === 'full' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Pay 100%<br/><span className="text-xs font-normal">Full payment</span>
            </button>
          </div>

          <button 
            onClick={handleBook}
            className="w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            PAY NOW ₹{Math.round(payableNow)}
          </button>
        </div>
      </div>
    </div>
  );
}
