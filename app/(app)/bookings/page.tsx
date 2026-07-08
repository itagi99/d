'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Calendar } from 'lucide-react';

export default function BookingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'upcoming' | 'current' | 'history'>('upcoming');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button onClick={() => router.push('/account')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Bookings</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {(['upcoming', 'current', 'history'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                tab === t ? 'bg-ocean-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="text-center py-16">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-ocean-500 rounded-full opacity-20 animate-pulse" />
            <div className="absolute inset-2 bg-ocean-600 rounded-full flex items-center justify-center">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Trips</h3>
          <p className="text-gray-500 mb-6">Plan your next journey with Vehigo. Book a cab and enjoy a comfortable ride!</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-ocean inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Book a Cab
          </button>
        </div>
      </div>
    </div>
  );
}
