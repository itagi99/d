'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star, User, Fuel, Luggage } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  slug: string;
  seatCapacity: number;
  ac: boolean;
  fuelType: string;
  rating: number;
  description: string;
  luggageCapacity: number;
  baseFare: number;
  extraKmRate: number;
  includedKms: number;
  includedHours: number;
  discountPercent: number;
  driverAllowance: number;
}

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const tripType = searchParams.get('tripType') || 'outstation';
  const packageType = searchParams.get('package') || 'local_8hr_80km';

  useEffect(() => {
    fetch(`/api/vehicles?tripType=${tripType}&package=${packageType}`)
      .then(r => r.json())
      .then(data => {
        setVehicles(data.vehicles || []);
        setLoading(false);
      });
  }, [tripType, packageType]);

  const handleSelect = (vehicleId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('vehicleId', vehicleId.toString());
    router.push(`/review?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Select Vehicle</span>
          </button>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {searchParams.get('from')} {searchParams.get('to') ? `→ ${searchParams.get('to')}` : ''} | {searchParams.get('date')} | {searchParams.get('time')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {vehicles.map((v) => {
          const discountedFare = v.baseFare * (1 - v.discountPercent / 100);
          const isSelected = selectedVehicle === v.id;

          return (
            <div 
              key={v.id} 
              className={`card transition-all cursor-pointer ${isSelected ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-md'}`}
              onClick={() => setSelectedVehicle(v.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{v.name}</h3>
                    <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded text-xs font-bold">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {v.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{v.seatCapacity} seater AC Cab</p>

                  {v.discountPercent > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {v.discountPercent}% OFF
                      </span>
                      <span className="text-gray-400 line-through text-sm">₹{v.baseFare.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-bold text-ocean-600">₹{Math.round(discountedFare).toLocaleString()}</span>
                    <span className="text-sm text-gray-500">+ ₹{Math.round(discountedFare * 0.05)} Charges & Taxes</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-primary-500" />
                      <span>Driver allowance included</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Fuel className="w-4 h-4 text-ocean-500" />
                      <span>{v.includedKms} kms included | Post limit: ₹{v.extraKmRate}/km</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Luggage className="w-4 h-4 text-primary-500" />
                      <span>Cab with Luggage Carrier @ ₹149</span>
                    </div>
                  </div>
                </div>

                <div className="w-32 h-24 bg-gray-100 rounded-xl flex items-center justify-center ml-4">
                  <CarIcon className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              {isSelected && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(v.id);
                  }}
                  className="w-full mt-4 btn-primary py-3 rounded-xl"
                >
                  SELECT CAR
                </button>
              )}
            </div>
          );
        })}

        {/* Trust Badges */}
        <div className="card flex items-center justify-around py-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-1">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-xs font-semibold text-gray-700">Book Now<br/>at Zero Cost</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-1">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <p className="text-xs font-semibold text-gray-700">Free Cancellations<br/>Till 1 Hour</p>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="text-center">
            <div className="w-10 h-10 bg-ocean-50 rounded-full flex items-center justify-center mx-auto mb-1">
              <svg className="w-5 h-5 text-ocean-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-xs font-semibold text-gray-700">24×7<br/>Customer Support</p>
          </div>
        </div>

        {/* Inclusions */}
        <div className="card">
          <div className="flex gap-2 mb-4 border-b border-gray-100 pb-2 overflow-x-auto">
            <button className="px-4 py-2 rounded-lg bg-ocean-500 text-white text-sm font-semibold whitespace-nowrap">INCLUSIONS</button>
            <button className="px-4 py-2 rounded-lg text-gray-500 text-sm font-semibold hover:bg-gray-50 whitespace-nowrap">EXCLUSIONS</button>
            <button className="px-4 py-2 rounded-lg text-gray-500 text-sm font-semibold hover:bg-gray-50 whitespace-nowrap">FACILITIES</button>
            <button className="px-4 py-2 rounded-lg text-gray-500 text-sm font-semibold hover:bg-gray-50 whitespace-nowrap">T&C</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Fuel className="w-5 h-5 text-primary-500" />
              <span>Fuel Charges</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <User className="w-5 h-5 text-primary-500" />
              <span>Driver Allowance</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>GST (5%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m4 0h2m-2 0a2 2 0 104 0m-2 0a2 2 0 114 0m4 0a2 2 0 104 0m-4 0a2 2 0 114 0M5 17H3v-4.586a1 1 0 01.293-.707l2.828-2.829A1 1 0 017.172 9H17a1 1 0 011 1v4.586a1 1 0 01-.293.707L19 17h-2m-10 0v-5a1 1 0 011-1h8a1 1 0 011 1v5M9 9h6" />
    </svg>
  );
}
