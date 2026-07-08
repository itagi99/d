'use client';

import { useRouter } from 'next/navigation';
import { Phone, BookOpen, User, MapPin, Headphones, LogOut } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();

  const menuItems = [
    { icon: BookOpen, label: 'My bookings', href: '/bookings' },
    { icon: User, label: 'Account details', href: '/account/details' },
    { icon: MapPin, label: 'Road trips for you', href: '/trips' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="font-semibold">Account</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Phone Header */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <div className="bg-ocean-50 rounded-2xl px-6 py-3 flex items-center gap-2 text-ocean-700 font-semibold">
              <Phone className="w-5 h-5" />
              7795966127
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className="w-full card flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-ocean-600" />
                </div>
                <span className="font-semibold text-gray-900">{item.label}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          ))}
        </div>

        {/* Support */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Need help?</p>
              <p className="text-sm text-gray-500">Available for you 24×7</p>
            </div>
          </div>
          <button className="bg-ocean-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Call Support
          </button>
        </div>

        {/* Social */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Follow Us</p>
          <div className="flex items-center justify-center gap-4">
            {['X', 'f', 'ig', 'yt'].map((social, i) => (
              <button key={i} className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-ocean-500 hover:text-ocean-600 transition-colors">
                <span className="font-bold text-sm">{social}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 text-sm text-gray-500">
          <p>© Vehigo Car Rentals 2025. All Rights Reserved</p>
          <p className="mt-1">version 26.06.3 (590)</p>
        </div>
      </div>
    </div>
  );
}
