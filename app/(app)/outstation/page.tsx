'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, ArrowRightLeft, ChevronRight, Plus, X } from 'lucide-react';

export default function OutstationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tripMode, setTripMode] = useState<'one_way' | 'round_trip'>(
    (searchParams.get('mode') as 'one_way' | 'round_trip') || 'one_way'
  );
  const [from, setFrom] = useState(searchParams.get('from') || 'Belgaum, Karnataka');
  const [to, setTo] = useState(searchParams.get('to') || 'Belgaum, Karnataka');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [time, setTime] = useState(searchParams.get('time') || '07:00');
  const [returnDate, setReturnDate] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [newStop, setNewStop] = useState('');

  const handleExplore = () => {
    const params = new URLSearchParams();
    params.set('from', from);
    params.set('to', to);
    params.set('date', date);
    params.set('time', time);
    params.set('mode', tripMode);
    if (returnDate) params.set('returnDate', returnDate);
    if (stops.length) params.set('stops', JSON.stringify(stops));
    router.push(`/vehicles?${params.toString()}`);
  };

  const addStop = () => {
    if (newStop.trim()) {
      setStops([...stops, newStop.trim()]);
      setNewStop('');
    }
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Outstation Cabs</span>
          </button>
          <p className="text-sm text-gray-500 mt-1 ml-7">India's Premier Intercity Cabs</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="card space-y-6">
          {/* Trip Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setTripMode('one_way')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                tripMode === 'one_way' 
                  ? 'border-ocean-500 bg-ocean-50 text-ocean-700 shadow-sm' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              ONE WAY<br/><span className="text-xs font-normal opacity-70">Drop-off only</span>
            </button>
            <button
              onClick={() => setTripMode('round_trip')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                tripMode === 'round_trip' 
                  ? 'border-ocean-500 bg-ocean-50 text-ocean-700 shadow-sm' 
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              ROUND TRIP<br/><span className="text-xs font-normal opacity-70">Return with same cab</span>
            </button>
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

          {/* To */}
          <div className="relative">
            <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">To</label>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <MapPin className="w-5 h-5 text-ocean-500" />
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent flex-1 outline-none text-gray-900 font-medium"
              />
            </div>
            <button className="absolute right-4 top-8 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100">
              <ArrowRightLeft className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Stops */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setNewStop('')}
                className="flex items-center gap-1 text-sm text-ocean-600 font-medium border border-ocean-200 px-3 py-1.5 rounded-lg hover:bg-ocean-50"
              >
                <Plus className="w-4 h-4" /> ADD STOPS
              </button>
              <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
            </div>
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="flex-1 text-sm">{stop}</span>
                <button onClick={() => removeStop(i)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {stops.length === 0 && newStop === '' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a stop location"
                  className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-100 outline-none focus:border-ocean-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addStop();
                    }
                  }}
                  onChange={(e) => setNewStop(e.target.value)}
                  value={newStop}
                />
                <button onClick={addStop} className="bg-ocean-500 text-white px-4 rounded-lg text-sm font-medium">Add</button>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
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
            {tripMode === 'round_trip' && (
              <div>
                <label className="text-xs text-gray-500 uppercase font-semibold mb-1 block">Trip End</label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
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

        {/* Bottom Nav */}
        <div className="mt-8 grid grid-cols-4 gap-2">
          {[
            { label: 'ONE WAY', active: tripMode === 'one_way' },
            { label: 'ROUND TRIP', active: tripMode === 'round_trip' },
            { label: 'LOCAL', active: false },
            { label: 'AIRPORT', active: false },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => {
                if (item.label === 'LOCAL') router.push('/local');
                if (item.label === 'AIRPORT') router.push('/airport');
              }}
              className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                item.active 
                  ? 'border-ocean-500 bg-ocean-50 text-ocean-700' 
                  : 'border-gray-100 text-gray-500 hover:border-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
