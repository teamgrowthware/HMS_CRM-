import { useState, useEffect } from 'react';
import { Plus, X, Search, Filter, Globe, Users } from 'lucide-react';

export default function Organizations() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    noOfEmployees: '',
    annualRevenue: '',
    territory: '',
    owner: 'Shariq Ansari'
  });

  const fetchOrganizations = () => {
    fetch('https://hms-crm-backend.onrender.com/api/organizations')
      .then(res => res.json())
      .then(data => setOrganizations(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrganization = async () => {
    try {
      const response = await fetch('https://hms-crm-backend.onrender.com/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', industry: '', website: '', noOfEmployees: '', annualRevenue: '', territory: '', owner: 'Shariq Ansari' });
        fetchOrganizations();
      }
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Organizations</h1>
          <div className="h-5 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{organizations.length} Organizations</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white w-64"
            />
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="font-medium text-gray-500 py-3 px-4 text-xs w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Name</th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Industry</th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Website</th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Employees</th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Annual Revenue</th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Territory</th>
              <th className="font-medium text-gray-500 py-3 px-4 text-xs">Owner</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {organizations.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-500">No organizations found. Create one to get started.</td></tr>
            ) : organizations.map((org: any) => (
              <tr 
                key={org._id} 
                className="border-b border-gray-100 hover:bg-gray-50/50 group cursor-pointer transition-colors"
              >
                <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300 opacity-50 group-hover:opacity-100" /></td>
                <td className="px-4 py-2.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{org.name}</span>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{org.industry || '-'}</td>
                <td className="px-4 py-2.5 text-blue-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> 
                    <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`} target="_blank" rel="noreferrer" className="hover:underline" onClick={e => e.stopPropagation()}>{org.website || '-'}</a>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> {org.noOfEmployees || '-'}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-gray-600">₹{org.annualRevenue || '-'}</td>
                <td className="px-4 py-2.5 text-gray-600">{org.territory || '-'}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${org.owner}&backgroundColor=e2e8f0`} className="w-5 h-5 rounded-full" alt="avatar" />
                    {org.owner}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Organization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Create Organization</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                
                <div className="col-span-12">
                  <label className="block text-xs text-gray-500 mb-1">Organization Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Industry</label>
                  <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Website</label>
                  <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-4">
                  <label className="block text-xs text-gray-500 mb-1">No. of Employees</label>
                  <select name="noOfEmployees" value={formData.noOfEmployees} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="">Select...</option>
                    <option>1-10</option>
                    <option>11-50</option>
                    <option>51-200</option>
                    <option>201-500</option>
                    <option>500+</option>
                  </select>
                </div>

                <div className="col-span-4">
                  <label className="block text-xs text-gray-500 mb-1">Annual Revenue (₹)</label>
                  <input type="text" name="annualRevenue" value={formData.annualRevenue} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-4">
                  <label className="block text-xs text-gray-500 mb-1">Territory</label>
                  <input type="text" name="territory" value={formData.territory} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0 bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
              >
                Discard
              </button>
              <button 
                onClick={handleCreateOrganization}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md hover:bg-gray-800 transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
