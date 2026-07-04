import { useState, useEffect } from 'react';
import { Search, Filter, FileText } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://hms-crm-backend.onrender.com/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      {/* Top Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" /> All Notes
          </h1>
          <div className="h-5 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{notes.length} Notes</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white w-64"
            />
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No notes found. Create a note inside a Lead to see it here.</div>
          ) : notes.map(note => (
            <div key={note._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap flex-1 mb-4">{note.content}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium">{new Date(note.createdAt).toLocaleString()}</span>
                {note.leadId && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-medium">Linked to Lead</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
