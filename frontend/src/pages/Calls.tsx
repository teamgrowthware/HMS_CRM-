import { useState, useEffect } from 'react';
import { Search, Filter, PhoneCall, PhoneOutgoing, PhoneIncoming, Play, User } from 'lucide-react';

export default function Calls() {
  const [calls, setCalls] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://hms-crm-backend.onrender.com/api/calls')
      .then(res => res.json())
      .then(data => setCalls(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-gray-500" /> Call Logs
          </h1>
          <div className="h-5 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{calls.length} Calls</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search call logs..." 
              className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white w-64"
            />
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="font-medium text-gray-500 py-3 px-6 text-xs">Call Detail</th>
              <th className="font-medium text-gray-500 py-3 px-6 text-xs">Type</th>
              <th className="font-medium text-gray-500 py-3 px-6 text-xs">Duration</th>
              <th className="font-medium text-gray-500 py-3 px-6 text-xs">Recording</th>
              <th className="font-medium text-gray-500 py-3 px-6 text-xs">Date</th>
              <th className="font-medium text-gray-500 py-3 px-6 text-xs">Linked Lead</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {calls.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-500">No calls found.</td></tr>
            ) : calls.map((call: any) => (
              <tr 
                key={call._id} 
                className="border-b border-gray-100 hover:bg-gray-50/50 group transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                    {call.type === 'Outgoing' ? <PhoneOutgoing className="w-4 h-4 text-blue-500" /> : <PhoneIncoming className="w-4 h-4 text-green-500" />}
                    {call.title || 'Call Log'}
                  </div>
                  <div className="text-gray-500 text-xs max-w-sm truncate">{call.summary || 'No summary provided.'}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${call.type === 'Outgoing' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {call.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {call.duration || '00:00'}
                </td>
                <td className="px-6 py-4">
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-3 w-fit hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200">
                    <Play className="w-3.5 h-3.5 text-gray-700" />
                    <div className="h-1 w-20 bg-gray-300 rounded-full overflow-hidden">
                       <div className="h-full w-1/3 bg-gray-500"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs font-medium whitespace-nowrap">
                  {new Date(call.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {call.leadId ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md w-fit border border-gray-200">
                      <User className="w-3.5 h-3.5" />
                      View Lead
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
