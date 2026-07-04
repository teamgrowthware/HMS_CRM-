import { useState, useEffect } from 'react';
import { Plus, X, Search, Filter, AlignLeft, BarChart2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STAGES = ['Prospecting', 'Qualification', 'Needs Analysis', 'Value Proposition', 'Id. Decision Makers', 'Perception Analysis', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'];

export default function Deals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dealName: '',
    organization: '',
    contact: '',
    amount: '',
    stage: 'Prospecting',
    closingDate: '',
    owner: 'Shariq Ansari'
  });

  const fetchDeals = () => {
    fetch('https://hms-crm-backend.onrender.com/api/deals')
      .then(res => res.json())
      .then(data => setDeals(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDeal = async () => {
    try {
      const response = await fetch('https://hms-crm-backend.onrender.com/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ dealName: '', organization: '', contact: '', amount: '', stage: 'Prospecting', closingDate: '', owner: 'Shariq Ansari' });
        fetchDeals();
      }
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (!dealId) return;

    // Optimistically update UI
    setDeals(prevDeals => prevDeals.map(d => d._id === dealId ? { ...d, stage } : d));

    // Update Backend
    try {
      await fetch(`https://hms-crm-backend.onrender.com/api/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
    } catch (error) {
      console.error('Error updating stage:', error);
      fetchDeals(); // revert on error
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Deals</h1>
          <div className="h-5 w-px bg-gray-300"></div>
          <div className="flex bg-gray-100 rounded-md p-0.5">
            <button className="px-3 py-1 rounded bg-white shadow-sm text-sm font-medium text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Kanban
            </button>
            <button className="px-3 py-1 rounded text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" /> List
            </button>
          </div>
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

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-[#F9FAFB] p-6 flex gap-6 items-start">
        {STAGES.map(stage => {
          const columnDeals = deals.filter(d => d.stage === stage);
          const totalAmount = columnDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

          return (
            <div 
              key={stage} 
              className="w-80 flex-shrink-0 flex flex-col max-h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    {stage} <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-xs">{columnDeals.length}</span>
                  </h3>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">₹{totalAmount.toLocaleString()}</div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
              
              {/* Deals List */}
              <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                {columnDeals.map(deal => (
                  <div 
                    key={deal._id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal._id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{deal.dealName}</h4>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.owner}&backgroundColor=e2e8f0`} className="w-5 h-5 rounded-full" alt="avatar" />
                    </div>
                    <div className="text-xs text-gray-600 mb-3">{deal.organization || 'No Organization'}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-900">₹{(Number(deal.amount) || 0).toLocaleString()}</span>
                      <span className="text-gray-500">{deal.closingDate ? new Date(deal.closingDate).toLocaleDateString() : '-'}</span>
                    </div>
                    
                    {/* Hover actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded border border-gray-100 shadow-sm flex gap-1">
                      <Plus className="w-3.5 h-3.5 text-gray-500 hover:text-blue-600 cursor-pointer" />
                    </div>
                  </div>
                ))}
                
                {/* Empty Drop Zone indicator */}
                {columnDeals.length === 0 && (
                  <div className="h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">Create Deal</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                
                <div className="col-span-12">
                  <label className="block text-xs text-gray-500 mb-1">Deal Name <span className="text-red-500">*</span></label>
                  <input type="text" name="dealName" value={formData.dealName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Organization</label>
                  <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
                  <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Stage</label>
                  <select name="stage" value={formData.stage} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-span-6">
                  <label className="block text-xs text-gray-500 mb-1">Expected Closing Date</label>
                  <input type="date" name="closingDate" value={formData.closingDate} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none" />
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
                onClick={handleCreateDeal}
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
