'use client';

import { useState, useEffect } from 'react';
import { Plus, Wrench, Navigation, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Machine {
  id: string;
  machineType: string;
  name: string;
  registrationNumber: string;
  purchaseDate: string;
  condition: string;
  operatorName?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  gpsStatus?: 'active' | 'inactive';
  utilizationRate?: number;
}

export default function FleetDashboardPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeNow: 0,
    maintenanceNeeded: 0,
    utilizationRate: 0,
  });

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      const response = await fetch('/api/enterprise/fleet');
      const data = await response.json();
      setMachines(data.machines || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('[v0] Failed to fetch fleet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const machineTypes = ['Tractor', 'Harvester', 'Drone', 'Sprayer', 'Water Pump', 'Thresher'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Fleet Management</h1>
            <p className="text-slate-400">Track and manage all machinery assets</p>
          </div>
          <Button className="btn-primary gap-2">
            <Plus className="size-4" />
            Add Machine
          </Button>
        </div>

        {/* Key Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card-glass rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-2">Total Assets</div>
            <div className="text-3xl font-bold text-white">{stats.totalAssets}</div>
            <div className="text-xs text-slate-500 mt-2">Tractors, harvesters, drones</div>
          </div>
          <div className="card-glass rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-2">Active Now</div>
            <div className="text-3xl font-bold text-emerald-400">{stats.activeNow}</div>
            <div className="text-xs text-slate-500 mt-2">Currently in use</div>
          </div>
          <div className="card-glass rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-2">Maintenance Needed</div>
            <div className="text-3xl font-bold text-amber-400">{stats.maintenanceNeeded}</div>
            <div className="text-xs text-slate-500 mt-2">Due this month</div>
          </div>
          <div className="card-glass rounded-2xl p-6">
            <div className="text-sm text-slate-400 mb-2">Utilization Rate</div>
            <div className="text-3xl font-bold text-cyan-400">{stats.utilizationRate}%</div>
            <div className="text-xs text-slate-500 mt-2">Average per month</div>
          </div>
        </div>

        {/* Machines Table/Grid */}
        <div className="card-glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Machine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Registration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Condition</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Operator</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">GPS Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Next Maintenance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{machine.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{machine.machineType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-mono">{machine.registrationNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        machine.condition === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
                        machine.condition === 'Good' ? 'bg-cyan-500/20 text-cyan-300' :
                        machine.condition === 'Fair' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {machine.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{machine.operatorName || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${
                          machine.gpsStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-slate-300">
                          {machine.gpsStatus === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{machine.nextMaintenance || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Button className="btn-secondary text-xs px-3 py-1">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {machines.length === 0 && !loading && (
            <div className="text-center py-12">
              <Wrench className="size-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No machines in fleet yet. Add one to get started.</p>
            </div>
          )}
        </div>

        {/* Maintenance Schedule */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Upcoming Maintenance</h3>
            <div className="space-y-3">
              {machines.slice(0, 5).map((machine) => (
                <div key={machine.id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                  <AlertTriangle className="size-4 text-amber-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{machine.name}</div>
                    <div className="text-xs text-slate-500">{machine.nextMaintenance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Machine Health</h3>
            <div className="space-y-3">
              {machines.slice(0, 5).map((machine) => (
                <div key={machine.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{machine.name}</div>
                    <div className="text-xs text-slate-500">{machine.machineType}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {machine.condition === 'Excellent' || machine.condition === 'Good' ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-400" />
                    )}
                    <span className="text-sm text-slate-300">{machine.utilizationRate || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
