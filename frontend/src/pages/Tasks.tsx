import { useState, useEffect } from 'react';
import { Search, Filter, CheckSquare, Calendar, MoreVertical } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://hms-crm-backend.onrender.com/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB]">
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-gray-500" /> All Tasks
          </h1>
          <div className="h-5 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{tasks.length} Tasks</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white w-64"
            />
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {tasks.length === 0 ? (
             <div className="text-center py-12 text-gray-500">No tasks found.</div>
          ) : tasks.map(task => (
            <div key={task._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex gap-4 group hover:shadow-md transition-shadow">
              <input type="checkbox" defaultChecked={task.completed} className="mt-1 rounded border-gray-300 w-5 h-5 cursor-pointer accent-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className={`font-medium text-base ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</div>
                  <MoreVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
                </div>
                <div className="text-sm text-gray-600 mb-4">{task.description}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-700">Todo</span>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar className="w-4 h-4" /> {new Date(task.date).toLocaleString()}
                  </div>
                  {task.priority && (
                    <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      <div className="w-2 h-2 rounded-full bg-red-500" /> High Priority
                    </div>
                  )}
                  {task.leadId && (
                     <div className="ml-auto text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Linked to Lead</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
