'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Clock } from 'lucide-react';

export default function LocalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [packageType, setPackageType] = useState<'4hr_40km' | '8hr_80km' | '12hr_120km'>('8hr_80km');
  const [from, setFrom] = useState(searchParams.get('from') || 'Belgaum, Karnataka');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [time, setTime] = useState(searchParams.get('time') || '07:00');

  const packages = [
    { id: '4hr_40km' as const, hrs: 4, kms: 40 },
    { id: '8hr_80km' as const, hrs: 8, kms: 80 },
    { id: '12hr_120km' as const, hrs: 12, kms: 120 },
  ];

  const handleExplore = () => {
    const params = new URLSearchParams();
    params.set('from', from);
    params.set('date', date);
    params.set('time', time);
    params.set('package', packageType);
    params.set('tripType', 'local');
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Local Hourly Rentals</span>
          </button>
          <p className="text-sm text-gray-500 mt-1 ml-7">India's Premier Intercity Cabs</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="card space-y-6">
          {/* Package Selector */}
          <div className="grid grid-cols-3 gap-2">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setPackageType(pkg.id)}
                className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                  packageType === pkg.id
                    ? 'border-ocean-500 bg-ocean-50 text-ocean-700 shadow-sm'
                    : 'border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
              >
                {pkg.hrs} hrs<br/><span className="text-xs font-normal">{pkg.kms} kms</span>
              </button>
            ))}
          </div>

          {/* From */}
          <div>
            <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">From</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <MapPin className="w-5 h-5 text-primary-500" />
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Trip Start</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <Calendar className="w-5 h-5 text-primary-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
              />
            </div>
            <p className="text-sm text-gray-600 mt-1 ml-9">{time}</p>
          </div>

          <button onClick={handleExplore} className="w-full btn-primary text-lg py-4 rounded-xl">
            EXPLORE CABS
          </button>
        </div>

        {/* Promo Banner */}
        <div className="mt-6 rounded-2xl overflow-hidden relative h-48">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-blue-800 to-ocean-700" />
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <span className="bg-black/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">EXCLUSIVE</span>
              <h3 className="text-2xl font-bold mt-2">CHARDHAM CAB PACKAGES</h3>
              <p className="text-sm text-white/80 mt-1">Spiritual journeys made comfortable</p>
            </div>
          </div>
        </div>

        {/* Travel Expert */}
        <div className="mt-6 card flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Say hello to</p>
            <h3 className="font-bold text-lg">YOUR TRAVEL EXPERT</h3>
            <p className="text-sm text-gray-500">Get expert advice for smarter travel plans!</p>
          </div>
          <button className="bg-ocean-50 text-ocean-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call Expert | 24×7
          </button>
        </div>
      </div>
    </div>
  );
}
