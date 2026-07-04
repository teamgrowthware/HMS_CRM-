import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ArrowUpDown, Columns, RefreshCcw, MoreHorizontal, ChevronDown, PhoneCall, X } from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    salutation: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    gender: 'Male',
    organization: '',
    website: '',
    noOfEmployees: '1-10',
    territory: 'India',
    annualRevenue: 0,
    industry: 'Technology',
    status: 'New',
    owner: 'Shariq Ansari'
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('https://hms-crm-backend.onrender.com/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateLead = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('https://hms-crm-backend.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchLeads(); // Refresh list
      } else {
        const errorData = await response.json();
        alert('Server Error: ' + (errorData.details || errorData.error));
      }
    } catch (error: any) {
      alert('Network Error: ' + error.message);
      console.error('Error creating lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'border-gray-500';
      case 'Qualified': return 'border-green-500';
      case 'Junk': return 'border-purple-500';
      case 'Nurture': return 'border-blue-500';
      case 'Unqualified': return 'border-red-500';
      default: return 'border-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <header className="h-[60px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">Leads</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
      </header>

      {/* Toolbar */}
      <div className="h-[52px] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md text-[13px] font-medium border border-gray-200">
            <span className="w-4 h-4 flex items-center justify-center">≡</span>
            List View
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md border border-transparent">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-[13px]">
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200">
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center gap-1.5 text-gray-700 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 text-gray-700 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort
          </button>
          <button className="flex items-center gap-1.5 text-gray-700 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
            <Columns className="w-3.5 h-3.5" /> Columns
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto border-t border-gray-200">
        <table className="w-full text-[13px] text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 w-10 font-medium"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="px-4 py-2 font-medium min-w-[200px]">Name</th>
              <th className="px-4 py-2 font-medium min-w-[180px]">Organization</th>
              <th className="px-4 py-2 font-medium min-w-[120px]">Status</th>
              <th className="px-4 py-2 font-medium min-w-[120px]">Source</th>
              <th className="px-4 py-2 font-medium min-w-[150px]">Job Title</th>
              <th className="px-4 py-2 font-medium min-w-[200px]">Email</th>
              <th className="px-4 py-2 font-medium min-w-[150px]">Mobile No</th>
              <th className="px-4 py-2 font-medium">Assigned To</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {isLoading ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">Loading leads...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-8 text-gray-500">No leads found. Create one to get started.</td></tr>
            ) : leads.map((lead: any) => (
              <tr 
                key={lead._id} 
                onClick={() => navigate(`/leads/${lead._id}`)}
                className="border-b border-gray-100 hover:bg-gray-50/50 group cursor-pointer"
              >
                <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300 opacity-50 group-hover:opacity-100" /></td>
                <td className="px-4 py-2.5 flex items-center gap-2">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.firstName}&backgroundColor=e2e8f0`} className="w-5 h-5 rounded-full bg-gray-200" alt="avatar" />
                  <span>{lead.salutation} {lead.firstName} {lead.lastName}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-medium">{lead.organization ? lead.organization.charAt(0).toUpperCase() : 'O'}</span>
                    {lead.organization || '-'}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full border-2 ${getStatusColor(lead.status)} bg-white`} />
                    {lead.status}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-gray-600">{lead.source || '-'}</td>
                <td className="px-4 py-2.5 text-gray-600">{lead.title || '-'}</td>
                <td className="px-4 py-2.5 text-gray-600">{lead.email}</td>
                <td className="px-4 py-2.5 text-gray-600 flex items-center gap-2">
                  <PhoneCall className="w-3 h-3 text-gray-400" />
                  {lead.mobileNo || '-'}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 text-gray-600">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.owner}&backgroundColor=e2e8f0`} className="w-5 h-5 rounded-full" alt="avatar" />
                    {lead.owner}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Paginator */}
      <div className="h-10 border-t border-gray-200 bg-[#F9FAFB] flex items-center justify-between px-6 text-[12px] text-gray-500">
        <div className="flex gap-2 items-center">
          <span className="hover:text-gray-900 cursor-pointer">20</span>
          <span className="hover:text-gray-900 cursor-pointer">50</span>
          <span className="bg-gray-200 px-1.5 rounded text-gray-900 font-medium">100</span>
        </div>
        <div>
          39 of 39
        </div>
      </div>

      {/* Create Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Create Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">Salutation</label>
                  <div className="relative">
                    <select name="salutation" value={formData.salutation} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm appearance-none bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>Mr</option>
                      <option>Mrs</option>
                      <option>Ms</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-4">
                  <label className="block text-xs text-gray-500 mb-1">First Name <span className="text-red-500">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-5">
                  <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">Mobile No</label>
                  <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">Gender</label>
                  <div className="relative">
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm appearance-none bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-6 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Organization</label>
                  <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-3 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Website</label>
                  <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-3 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">No of Employees</label>
                  <div className="relative">
                    <select name="noOfEmployees" value={formData.noOfEmployees} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm appearance-none bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>1-10</option>
                      <option>11-50</option>
                      <option>51-200</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-4 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Territory</label>
                  <div className="relative">
                    <select name="territory" value={formData.territory} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm appearance-none bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>India</option>
                      <option>USA</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-4 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Annual Revenue</label>
                  <input type="number" name="annualRevenue" value={formData.annualRevenue} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-4 mt-2">
                  <label className="block text-xs text-gray-500 mb-1">Industry</label>
                  <div className="relative">
                    <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm appearance-none bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>Technology</option>
                      <option>Finance</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0 rounded-b-lg">
              <div className="flex gap-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-2 h-2 rounded-full border-2 border-gray-400 bg-white" />
                    <span className="font-medium text-sm">New</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Lead Owner</label>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Shariq&backgroundColor=e2e8f0" className="w-5 h-5 rounded-full" alt="owner" />
                    <span className="font-medium text-sm">Shariq Ansari</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <button 
                onClick={handleCreateLead}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
