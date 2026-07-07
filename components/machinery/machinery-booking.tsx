'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, User, Star, Zap, TrendingUp, Filter, Search, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/cards/glass-card';

interface Machine {
  id: number;
  name: string;
  type: string;
  pricePerHour: number;
  operator: string;
  operatorRating: number;
  distance: string;
  availability: boolean;
  image: string;
  location: string;
  gpsEnabled: boolean;
}

const machines: Machine[] = [
  {
    id: 1,
    name: 'Heavy Duty Tractor',
    type: 'Tractor',
    pricePerHour: 450,
    operator: 'Ramesh Kumar',
    operatorRating: 4.9,
    distance: '2.5 km',
    availability: true,
    image: '🚜',
    location: 'Marathalli, Bangalore',
    gpsEnabled: true,
  },
  {
    id: 2,
    name: 'Rotavator',
    type: 'Tilling',
    pricePerHour: 350,
    operator: 'Suresh Rao',
    operatorRating: 4.7,
    distance: '5 km',
    availability: true,
    image: '⚙️',
    location: 'Whitefield, Bangalore',
    gpsEnabled: true,
  },
  {
    id: 3,
    name: 'Combine Harvester',
    type: 'Harvesting',
    pricePerHour: 800,
    operator: 'Rajesh Singh',
    operatorRating: 4.8,
    distance: '8 km',
    availability: false,
    image: '🌾',
    location: 'Outer Ring Road, Bangalore',
    gpsEnabled: true,
  },
  {
    id: 4,
    name: 'Seed Drill',
    type: 'Seeding',
    pricePerHour: 280,
    operator: 'Mohan M',
    operatorRating: 4.6,
    distance: '3 km',
    availability: true,
    image: '🌱',
    location: 'Koramangala, Bangalore',
    gpsEnabled: true,
  },
  {
    id: 5,
    name: 'Cultivator',
    type: 'Tilling',
    pricePerHour: 250,
    operator: 'Vijay Kumar',
    operatorRating: 4.5,
    distance: '1.5 km',
    availability: true,
    image: '🔧',
    location: 'BTM Layout, Bangalore',
    gpsEnabled: true,
  },
  {
    id: 6,
    name: 'Sprayer Machine',
    type: 'Spraying',
    pricePerHour: 200,
    operator: 'Prakash Dev',
    operatorRating: 4.7,
    distance: '4 km',
    availability: true,
    image: '💦',
    location: 'Indiranagar, Bangalore',
    gpsEnabled: true,
  },
];

export function MachineryBooking() {
  const [selectedDate, setSelectedDate] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showMap, setShowMap] = useState(false);

  const machineTypes = ['All', 'Tractor', 'Tilling', 'Harvesting', 'Seeding', 'Spraying'];
  
  const filteredMachines = filterType === 'All'
    ? machines
    : machines.filter(m => m.type === filterType);

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-4 fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold font-serif text-white">
            Enterprise Machinery Booking
          </h2>
          <p className="text-lg text-white/70 max-w-2xl">
            Real-time availability, GPS tracking, and professional operators
          </p>
        </div>

        {/* Booking filters */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 fade-in">
          {/* Date picker */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-white/40 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-green-500/50"
            />
          </div>

          {/* Machine type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
          >
            {machineTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* View toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 justify-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white hover:bg-white/10 transition-all"
          >
            <MapIcon className="size-5" />
            {showMap ? 'List View' : 'Map View'}
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-white/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search machines..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
            />
          </div>
        </div>

        {/* Machines grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMachines.map((machine, index) => (
            <div
              key={machine.id}
              className={`fade-in stagger-item-${(index % 9) + 1}`}
            >
              <GlassCard hover variant="lg" className="h-full flex flex-col">
                {/* Machine image area */}
                <div className="relative mb-4 -mx-6 -mt-8 pt-0 h-40 bg-gradient-to-br from-white/10 to-white/5 rounded-t-2xl flex items-center justify-center text-5xl">
                  {machine.image}
                  {machine.gpsEnabled && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <Zap className="size-3" /> GPS
                    </div>
                  )}
                  {!machine.availability && (
                    <div className="absolute inset-0 bg-black/40 rounded-t-2xl flex items-center justify-center">
                      <span className="text-white font-bold">Not Available</span>
                    </div>
                  )}
                </div>

                {/* Machine details */}
                <div className="flex-grow">
                  <div className="text-sm text-green-400 font-semibold mb-1">
                    {machine.type}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {machine.name}
                  </h3>

                  {/* Price per hour */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-400">
                        ₹{machine.pricePerHour}
                      </span>
                      <span className="text-sm text-white/60">/hour</span>
                    </div>
                  </div>

                  {/* Operator info */}
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="size-4 text-white/60" />
                      <span className="text-sm text-white font-medium">{machine.operator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < Math.floor(machine.operatorRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-white/20'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-white/60">
                        {machine.operatorRating}
                      </span>
                    </div>
                  </div>

                  {/* Location and distance */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-white/60 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-white/70">{machine.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <TrendingUp className="size-4" />
                      {machine.distance} away
                    </div>
                  </div>
                </div>

                {/* Booking buttons */}
                <div className="space-y-2 pt-4">
                  <Button
                    disabled={!machine.availability}
                    className={`w-full ${
                      machine.availability
                        ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white border-0'
                        : 'bg-white/5 text-white/50 cursor-not-allowed border border-white/10'
                    } transition-all`}
                  >
                    {machine.availability ? 'Book Now' : 'Unavailable'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    View Details
                  </Button>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Map view placeholder */}
        {showMap && (
          <div className="mt-12 fade-in">
            <GlassCard className="h-96 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="size-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">Interactive map view coming soon</p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
