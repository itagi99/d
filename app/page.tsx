'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, ArrowRightLeft, Car, Luggage, Shield, Headphones, ChevronRight, Star } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'outstation' | 'local' | 'airport'>('outstation');
  const [tripMode, setTripMode] = useState<'one_way' | 'round_trip'>('one_way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('07:00');
  const [returnDate, setReturnDate] = useState('');

  const handleExplore = () => {
    const params = new URLSearchParams();
    params.set('from', from || 'Belgaum, Karnataka');
    if (to) params.set('to', to);
    params.set('date', date || new Date().toISOString().split('T')[0]);
    params.set('time', time);
    params.set('mode', tripMode);

    if (activeTab === 'outstation') {
      router.push(`/outstation?${params.toString()}`);
    } else if (activeTab === 'local') {
      router.push(`/local?${params.toString()}`);
    } else {
      router.push(`/airport?${params.toString()}`);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-ocean-900 via-ocean-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 50 Q25 30 50 50 T100 50 V100 H0 Z" fill="white" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-32">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">VEHIGO</h1>
            </div>
            <p className="text-ocean-100 text-lg">India's Premier Intercity & Local Cabs</p>
          </div>

          {/* Booking Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-2 max-w-3xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 bg-white/10 rounded-2xl">
              {(['outstation', 'local', 'airport'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition-all ${
                    activeTab === tab ? 'bg-white text-ocean-700 shadow-lg' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {tab === 'outstation' ? 'Outstation' : tab === 'local' ? 'Local' : 'Airport'}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 text-gray-900">
              {activeTab === 'outstation' && (
                <>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setTripMode('one_way')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                        tripMode === 'one_way' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      ONE WAY<br/><span className="text-xs opacity-70">Drop-off only</span>
                    </button>
                    <button
                      onClick={() => setTripMode('round_trip')}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                        tripMode === 'round_trip' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      ROUND TRIP<br/><span className="text-xs opacity-70">Return with same cab</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">From</label>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        <input
                          type="text"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                          placeholder="Belgaum, Karnataka"
                          className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                        />
                      </div>
                      <button className="absolute right-4 top-8 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100">
                        <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">To</label>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <MapPin className="w-5 h-5 text-ocean-500" />
                        <input
                          type="text"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          placeholder="Enter destination"
                          className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Trip Start</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Calendar className="w-5 h-5 text-primary-500" />
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Time</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Clock className="w-5 h-5 text-primary-500" />
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {tripMode === 'round_trip' && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Return Date</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Calendar className="w-5 h-5 text-ocean-500" />
                          <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'local' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { hrs: 4, kms: 40 },
                      { hrs: 8, kms: 80 },
                      { hrs: 12, kms: 120 },
                    ].map((pkg) => (
                      <button
                        key={pkg.hrs}
                        className="py-3 rounded-xl border-2 border-primary-500 bg-primary-50 text-primary-700 font-semibold text-sm"
                      >
                        {pkg.hrs} hrs<br/><span className="text-xs font-normal">{pkg.kms} kms</span>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">From</label>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <MapPin className="w-5 h-5 text-primary-500" />
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Belgaum, Karnataka"
                        className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Date</label>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <Calendar className="w-5 h-5 text-primary-500" />
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Time</label>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <Clock className="w-5 h-5 text-primary-500" />
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'airport' && (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <button className="flex-1 py-2 rounded-lg text-sm font-medium border border-primary-500 bg-primary-50 text-primary-700">
                      Pickup from Airport
                    </button>
                    <button className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600">
                      Drop to Airport
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Airport</label>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        <input type="text" placeholder="Enter airport" className="bg-transparent flex-1 outline-none text-gray-900 font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">City / Location</label>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <MapPin className="w-5 h-5 text-ocean-500" />
                        <input type="text" placeholder="Belgaum, Karnataka" className="bg-transparent flex-1 outline-none text-gray-900 font-medium" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Date</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Calendar className="w-5 h-5 text-primary-500" />
                          <input type="date" className="bg-transparent flex-1 outline-none text-gray-900 font-medium" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Time</label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Clock className="w-5 h-5 text-primary-500" />
                          <input type="time" className="bg-transparent flex-1 outline-none text-gray-900 font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleExplore}
                className="w-full mt-6 btn-primary text-lg py-4 rounded-xl"
              >
                EXPLORE CABS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Car, title: 'Easy Booking', desc: 'Book in 2 minutes' },
            { icon: Shield, title: 'Best Prices', desc: 'No hidden charges' },
            { icon: Luggage, title: 'Verified Vehicles', desc: 'Regularly inspected' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
          ].map((feat, i) => (
            <div key={i} className="card flex flex-col items-center text-center p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-ocean-50 rounded-full flex items-center justify-center mb-3">
                <feat.icon className="w-6 h-6 text-ocean-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{feat.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Packages */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Routes</h2>
          <button className="text-ocean-600 font-semibold text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { from: 'Belgaum', to: 'Goa', price: '₹2,899', distance: '150 km', rating: 4.8 },
            { from: 'Belgaum', to: 'Bangalore', price: '₹4,499', distance: '510 km', rating: 4.7 },
            { from: 'Belgaum', to: 'Pune', price: '₹3,299', distance: '340 km', rating: 4.9 },
          ].map((route, i) => (
            <div key={i} className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{route.from} → {route.to}</p>
                    <p className="text-xs text-gray-500">{route.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                  <Star className="w-3 h-3 text-green-600 fill-green-600" />
                  <span className="text-xs font-semibold text-green-700">{route.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{route.price}</span>
                <span className="text-sm text-gray-500">per cab</span>
              </div>
              <button className="w-full mt-4 py-2 rounded-lg border border-primary-500 text-primary-600 font-semibold group-hover:bg-primary-500 group-hover:text-white transition-colors">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-ocean-900 to-ocean-800 rounded-3xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: 'Happy Customers' },
              { value: '10,000+', label: 'Trips Completed' },
              { value: '500+', label: 'Verified Drivers' },
              { value: '4.8/5', label: 'Average Rating' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-ocean-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
