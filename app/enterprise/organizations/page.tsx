'use client';

import { useState, useEffect } from 'react';
import { Plus, Building2, Users, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Organization {
  id: string;
  name: string;
  type: 'corporate_farm' | 'fpo' | 'dealer' | 'distributor';
  description?: string;
  location?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  memberCount?: number;
  createdAt?: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'corporate_farm',
    description: '',
    location: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/enterprise/organizations');
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error('[v0] Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/enterprise/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newOrg = await response.json();
        setOrganizations([...organizations, newOrg]);
        setShowForm(false);
        setFormData({
          name: '',
          type: 'corporate_farm',
          description: '',
          location: '',
          contactPerson: '',
          contactEmail: '',
          contactPhone: '',
        });
      }
    } catch (error) {
      console.error('[v0] Failed to create organization:', error);
    }
  };

  const typeLabels = {
    corporate_farm: 'Corporate Farm',
    fpo: 'FPO',
    dealer: 'Dealer',
    distributor: 'Distributor',
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Organizations</h1>
            <p className="text-slate-400">Manage corporate farms, FPOs, dealers, and distributors</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="btn-primary gap-2"
          >
            <Plus className="size-4" />
            New Organization
          </Button>
        </div>

        {/* Create Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="card-glass rounded-2xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4">Create Organization</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Organization Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="corporate_farm">Corporate Farm</option>
                    <option value="fpo">FPO</option>
                    <option value="dealer">Dealer</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Organizations Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <div key={org.id} className="card-hover-lift">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Building2 className="size-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{org.name}</h3>
                      <div className="text-xs text-emerald-400 uppercase tracking-wide">
                        {typeLabels[org.type]}
                      </div>
                    </div>
                  </div>
                </div>

                {org.description && (
                  <p className="text-sm text-slate-400 mb-4">{org.description}</p>
                )}

                <div className="space-y-2 text-sm">
                  {org.location && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="size-4 text-amber-400" />
                      {org.location}
                    </div>
                  )}
                  {org.contactPerson && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="size-4 text-emerald-400" />
                      {org.contactPerson}
                    </div>
                  )}
                  {org.contactPhone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="size-4 text-cyan-400" />
                      {org.contactPhone}
                    </div>
                  )}
                  {org.contactEmail && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="size-4 text-pink-400" />
                      {org.contactEmail}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {org.memberCount || 0} members
                  </div>
                  <Button className="btn-secondary text-xs px-3 py-1">
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {organizations.length === 0 && !loading && (
          <div className="text-center py-16">
            <Building2 className="size-16 mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No organizations yet. Create one to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}
