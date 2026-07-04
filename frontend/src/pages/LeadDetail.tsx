import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, Mail, Link as LinkIcon, ChevronDown, ChevronRight, 
  Activity, MessageSquare, PhoneCall, CheckSquare, FileText, Plus, Check, X, Building2, UserSquare2,
  Calendar, Flag, Play, Volume2, MoreVertical, Mic, Paperclip, Smile, Send
} from 'lucide-react';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('activity');
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [personOpen, setPersonOpen] = useState(true);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [orgExisting, setOrgExisting] = useState(true);
  const [contactExisting, setContactExisting] = useState(false);
  
  // Data states
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [calls, setCalls] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [whatsapps, setWhatsapps] = useState<any[]>([]);

  // Form States
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [whatsappMsg, setWhatsappMsg] = useState('');

  // Modals for Tabs
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  useEffect(() => {
    fetchLeadData();
  }, [id]);

  const fetchLeadData = async () => {
    try {
      const [leadRes, notesRes, tasksRes, callsRes, emailsRes, whatsappRes] = await Promise.all([
        fetch(`https://hms-crm-backend.onrender.com/api/leads/${id}`),
        fetch(`https://hms-crm-backend.onrender.com/api/notes?leadId=${id}`),
        fetch(`https://hms-crm-backend.onrender.com/api/tasks?leadId=${id}`),
        fetch(`https://hms-crm-backend.onrender.com/api/calls?leadId=${id}`),
        fetch(`https://hms-crm-backend.onrender.com/api/emails?leadId=${id}`),
        fetch(`https://hms-crm-backend.onrender.com/api/whatsapp?leadId=${id}`)
      ]);
      setLead(await leadRes.json());
      setNotes(await notesRes.json());
      setTasks(await tasksRes.json());
      setCalls(await callsRes.json());
      setEmails(await emailsRes.json());
      setWhatsapps(await whatsappRes.json());
    } catch (error) {
      console.error('Error fetching lead data:', error);
    }
  };

  const handleCreateNote = async () => {
    await fetch('https://hms-crm-backend.onrender.com/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: id, title: noteTitle, content: noteContent }) });
    setNoteTitle(''); setNoteContent(''); setIsNoteModalOpen(false); fetchLeadData();
  };
  const handleCreateTask = async () => {
    await fetch('https://hms-crm-backend.onrender.com/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: id, title: taskTitle, description: taskDesc, date: taskDate, priority: true }) });
    setTaskTitle(''); setTaskDesc(''); setTaskDate(''); setIsTaskModalOpen(false); fetchLeadData();
  };
  const handleCreateCall = async () => {
    await fetch('https://hms-crm-backend.onrender.com/api/calls', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: id, duration: '45s' }) });
    setIsCallModalOpen(false); fetchLeadData();
  };
  const handleCreateEmail = async () => {
    await fetch('https://hms-crm-backend.onrender.com/api/emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: id, to: emailTo || lead?.email, subject: emailSubject, body: emailBody }) });
    setEmailSubject(''); setEmailBody(''); setIsEmailModalOpen(false); fetchLeadData();
  };
  const handleCreateWhatsapp = async (msg?: string) => {
    await fetch('https://hms-crm-backend.onrender.com/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: id, message: msg || whatsappMsg }) });
    setWhatsappMsg(''); setIsWhatsAppModalOpen(false); fetchLeadData();
  };

  const tabs = [
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'calls', label: 'Calls', icon: PhoneCall },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full bg-white font-sans text-[13px] text-gray-900">
      {/* Top Header */}
      <header className="h-[60px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/leads')} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="hover:underline cursor-pointer" onClick={() => navigate('/leads')}>Leads</span>
            <span>/</span>
            <span className="font-semibold text-gray-900">{lead ? `${lead.salutation} ${lead.firstName} ${lead.lastName}` : 'Loading...'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer border border-transparent">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead?.owner || 'Shariq'}&backgroundColor=e2e8f0`} className="w-5 h-5 rounded-full" alt="owner" />
            <span className="font-medium">{lead?.owner || '-'}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
            <div className="w-2 h-2 rounded-full border-2 border-gray-400 bg-white" />
            <span className="font-medium">{lead?.status || '-'}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          <button 
            onClick={() => setIsConvertModalOpen(true)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Convert to Deal
          </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Tabs & Content */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
          {/* Tabs */}
          <div className="flex items-center px-4 border-b border-gray-200 shrink-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                    isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Tab Content Area */}
          <div className="flex-1 overflow-auto bg-[#F9FAFB] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-semibold text-gray-900 capitalize">{activeTab}</h2>
              {activeTab === 'activity' && (
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm">
                  <Plus className="w-4 h-4" />
                  New
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              )}
              {activeTab === 'emails' && (
                <button 
                  onClick={() => setIsEmailModalOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Email
                </button>
              )}
              {activeTab === 'calls' && (
                <button 
                  onClick={() => setIsCallModalOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" /> Make a Call
                </button>
              )}
              {activeTab === 'notes' && (
                <button 
                  onClick={() => setIsNoteModalOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Note
                </button>
              )}
              {activeTab === 'tasks' && (
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> New Task
                </button>
              )}
              {activeTab === 'whatsapp' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsWhatsAppModalOpen(true)}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                  >
                    Send Template
                  </button>
                  <button className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm">
                    <Plus className="w-4 h-4" /> New WhatsApp Message
                  </button>
                </div>
              )}
            </div>

            {/* Content based on Active Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium text-gray-900">Shariq Ansari created this lead</div>
                      <div className="text-gray-500 text-xs">just now</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                {notes.map((note: any) => (
                  <div key={note._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-900 text-sm">{note.title}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-gray-500 text-xs">{new Date(note.createdAt).toLocaleDateString()}</div>
                        <MoreVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {tasks.map((task: any) => (
                  <div key={task._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex gap-4 group">
                    <input type="checkbox" defaultChecked={task.completed} className="mt-1 rounded border-gray-300 w-4 h-4 cursor-pointer" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <MoreVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{task.description}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span className="bg-gray-100 px-2 py-1 rounded">Todo</span>
                        <div className="flex items-center gap-1"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead?.owner || 'Shariq'}&backgroundColor=e2e8f0`} className="w-4 h-4 rounded-full" alt="owner" /> {lead?.owner || 'Owner'}</div>
                        <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {task.date}</div>
                        {task.priority && <div className="flex items-center gap-1 text-red-600"><div className="w-2 h-2 rounded-full bg-red-500" /> High</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'calls' && (
              <div className="space-y-4">
                {calls.map((call: any) => (
                  <div key={call._id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                      <PhoneCall className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium text-gray-900 text-sm">{call.type} Call</div>
                        <div className="text-gray-500 text-xs">{new Date(call.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5" /> Duration <strong>{call.duration}</strong></span>
                        <button className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                          <Play className="w-3.5 h-3.5" /> Listen to Call
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'emails' && (
              <div className="space-y-4">
                {emails.map((email: any) => (
                  <div key={email._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium text-gray-900 text-sm">{email.subject}</div>
                          <div className="text-gray-500 text-xs">{new Date(email.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-gray-500 text-sm mb-3">To: {email.to}</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{email.body}</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 flex gap-4 items-center">
                      <button className="text-gray-700 font-medium text-sm hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                  {whatsapps.map((msg: any) => (
                    <div key={msg._id} className={`flex ${msg.type === 'Sent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`border rounded-lg p-3 max-w-[80%] shadow-sm relative ${
                        msg.type === 'Sent' ? 'bg-[#E7F6DF] border-[#D5ECC8] rounded-tr-none' : 'bg-white border-gray-200 rounded-tl-none'
                      }`}>
                        <div className="text-sm text-gray-900 whitespace-pre-wrap pr-10">{msg.message}</div>
                        <div className="absolute bottom-1 right-2 flex items-center gap-1">
                          <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          {msg.type === 'Sent' && (
                            <div className="flex -space-x-1">
                              <Check className="w-3 h-3 text-blue-500" />
                              {msg.status !== 'Sent' && <Check className="w-3 h-3 text-blue-500" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="border border-gray-200 rounded-lg bg-white p-2 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 mt-auto">
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded"><Smile className="w-5 h-5" /></button>
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded"><Paperclip className="w-5 h-5" /></button>
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    className="flex-1 outline-none text-sm px-2"
                    value={whatsappMsg}
                    onChange={(e) => setWhatsappMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateWhatsapp()}
                  />
                  <button onClick={() => handleCreateWhatsapp()} className="text-white bg-green-600 hover:bg-green-700 p-1.5 rounded-md transition-colors"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {activeTab !== 'activity' && activeTab !== 'notes' && activeTab !== 'tasks' && activeTab !== 'calls' && activeTab !== 'emails' && activeTab !== 'whatsapp' && (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <div className="mb-2">
                  {activeTab === 'emails' && <Mail className="w-8 h-8 opacity-50" />}
                  {activeTab === 'whatsapp' && <MessageSquare className="w-8 h-8 opacity-50" />}
                </div>
                <div className="text-sm font-medium">No {activeTab} yet</div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Details Sidebar */}
        <div className="w-[340px] bg-white flex flex-col shrink-0 overflow-y-auto">
          {/* ID Header */}
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="font-semibold text-gray-900">CRM-LEAD-2024-00043</span>
          </div>

          {/* Person Title */}
          <div className="px-6 pb-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-medium text-gray-600 shrink-0">
              {lead?.firstName?.charAt(0) || 'M'}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{lead ? `${lead.salutation} ${lead.firstName} ${lead.lastName}` : 'Loading...'}</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-4">
            <button 
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex items-center gap-2 w-full px-2 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
            >
              {detailsOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              Details
            </button>
            
            {detailsOpen && (
              <div className="px-2 py-2 space-y-3">
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Organization</span>
                  <span className="text-gray-900 font-medium">{lead?.organization || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Website</span>
                  {lead?.website ? (
                    <a href={lead.website} target="_blank" rel="noreferrer" className="text-blue-600 cursor-pointer hover:underline truncate">{lead.website}</a>
                  ) : <span className="text-gray-400">-</span>}
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Industry</span>
                  <span className="text-gray-900">{lead?.industry || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Employees</span>
                  <span className="text-gray-900">{lead?.noOfEmployees || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Revenue</span>
                  <span className="text-gray-900">{lead?.annualRevenue || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Lead Owner</span>
                  <div className="flex items-center gap-2">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead?.owner || 'Shariq'}&backgroundColor=e2e8f0`} className="w-5 h-5 rounded-full" alt="owner" />
                    <span className="text-gray-900">{lead?.owner || '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 my-2 mx-6" />

          {/* Person Section */}
          <div className="px-4 pb-6">
            <button 
              onClick={() => setPersonOpen(!personOpen)}
              className="flex items-center gap-2 w-full px-2 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md"
            >
              {personOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              Person
            </button>
            
            {personOpen && (
              <div className="px-2 py-2 space-y-3">
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Salutation</span>
                  <span className="text-gray-900">{lead?.salutation || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">First Name <span className="text-red-500">*</span></span>
                  <span className="text-gray-900 font-medium">{lead?.firstName || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Last Name</span>
                  <span className="text-gray-900">{lead?.lastName || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900 truncate">{lead?.email || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <span className="text-gray-500">Mobile No</span>
                  <span className="text-gray-900">{lead?.mobileNo || '-'}</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Convert to Deal Modal */}
      {isConvertModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Convert to Deal</h2>
              <button onClick={() => setIsConvertModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 bg-[#F9FAFB]">
              
              {/* Organization Block */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">Organization</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-700 font-medium">Choose Existing</label>
                  <div 
                    onClick={() => setOrgExisting(!orgExisting)}
                    className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-200 ${orgExisting ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all duration-200 ${orgExisting ? 'ml-auto' : ''}`} />
                  </div>
                </div>
                
                {orgExisting ? (
                  <div className="relative mt-3">
                    <input type="text" defaultValue="Tesla India" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-2">
                    New organization will be created based on the details in details section
                  </div>
                )}
              </div>

              {/* Contact Block */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <UserSquare2 className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">Contact</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-700 font-medium">Choose Existing</label>
                  <div 
                    onClick={() => setContactExisting(!contactExisting)}
                    className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-200 ${contactExisting ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all duration-200 ${contactExisting ? 'ml-auto' : ''}`} />
                  </div>
                </div>
                
                {contactExisting ? (
                  <div className="relative mt-3">
                    <input type="text" defaultValue="Marcus Brown" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" />
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-2">
                    New contact will be created based on the person's details
                  </div>
                )}
              </div>

            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center bg-gray-50 rounded-b-lg">
              <button 
                onClick={async () => {
                  try {
                    await fetch('https://hms-crm-backend.onrender.com/api/deals', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        dealName: `${lead.firstName} ${lead.lastName} Deal`,
                        organization: lead.organization || 'No Organization',
                        contact: `${lead.firstName} ${lead.lastName}`,
                        amount: lead.annualRevenue || 10000,
                        owner: lead.owner
                      })
                    });
                    setIsConvertModalOpen(false);
                    navigate('/deals');
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Convert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Note</h2>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="Enter title" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Content</label>
                <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="bg-gray-50 border-b border-gray-300 px-3 py-2 flex gap-3 text-gray-500">
                    <span className="font-bold cursor-pointer hover:text-gray-900">B</span>
                    <span className="italic cursor-pointer hover:text-gray-900">I</span>
                    <span className="underline cursor-pointer hover:text-gray-900">U</span>
                    <span className="cursor-pointer hover:text-gray-900">{"</>"}</span>
                  </div>
                  <textarea rows={6} value={noteContent} onChange={(e) => setNoteContent(e.target.value)} className="w-full py-2 px-3 text-sm focus:outline-none" placeholder="Type your note here..."></textarea>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-lg">
              <button onClick={handleCreateNote} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[600px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create Task</h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Follow Up" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <textarea rows={3} value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Task details..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Due Date</label>
                  <input type="datetime-local" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Priority</label>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div> Low
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md border-2 border-red-500 text-sm font-medium bg-red-50 text-red-700">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> High
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-lg">
              <button onClick={handleCreateTask} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {isCallModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[320px] flex flex-col items-center overflow-hidden border border-gray-700">
             <div className="w-full bg-gray-800/50 flex justify-end p-2">
                <button onClick={() => setIsCallModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="py-8 flex flex-col items-center w-full">
               <div className="relative mb-6">
                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-semibold text-gray-800 z-10 relative">
                   M
                 </div>
                 {/* Ripple effect rings */}
                 <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                 <div className="absolute inset-[-10px] bg-blue-500 rounded-full opacity-10 animate-ping" style={{ animationDelay: '200ms' }}></div>
               </div>
               <h3 className="text-xl font-medium text-white mb-1">Mr Marcus Brown</h3>
               <p className="text-gray-400 text-sm mb-8">+917666980887</p>
               <div className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-8">Calling...</div>
               
               <div className="flex items-center gap-6">
                 <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
                   <Mic className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleCreateCall}
                   className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                 >
                   <Phone className="w-6 h-6 rotate-[135deg]" />
                 </button>
                 <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white transition-colors">
                   <PhoneCall className="w-5 h-5" />
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[800px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">New Email</h2>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-0 flex flex-col h-[500px]">
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-4">
                <span className="text-gray-500 text-sm font-medium w-12">TO:</span>
                <div className="flex-1 flex gap-2">
                  <input type="text" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder={lead?.email || 'Email address'} className="flex-1 outline-none text-sm font-medium text-gray-900" />
                </div>
              </div>
              <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-4">
                <span className="text-gray-500 text-sm font-medium w-12">SUBJECT:</span>
                <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder={`Subject for ${lead?.firstName || 'Lead'}`} className="flex-1 outline-none text-sm font-medium text-gray-900" />
              </div>
              
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                <div className="relative inline-block">
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-sm font-medium transition-colors shadow-sm">
                    Email Templates <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto text-sm text-gray-800">
                <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="w-full h-full resize-none outline-none" placeholder="Write your email here..."></textarea>
              </div>

              {/* Formatting bar */}
              <div className="px-6 py-2 border-t border-gray-200 bg-gray-50 flex items-center gap-3 text-gray-500">
                <span className="font-bold cursor-pointer hover:text-gray-900">B</span>
                <span className="italic cursor-pointer hover:text-gray-900">I</span>
                <span className="underline cursor-pointer hover:text-gray-900">U</span>
                <div className="w-px h-4 bg-gray-300"></div>
                <Paperclip className="w-4 h-4 cursor-pointer hover:text-gray-900" />
                <LinkIcon className="w-4 h-4 cursor-pointer hover:text-gray-900" />
              </div>

            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-lg">
              <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Discard
              </button>
              <button onClick={handleCreateEmail} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Template Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">WhatsApp Templates</h2>
              <button onClick={() => setIsWhatsAppModalOpen(false)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <input type="text" placeholder="Search by keyword..." className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              
              <div className="border border-gray-200 rounded-lg hover:border-green-500 cursor-pointer p-4 transition-colors">
                <div className="font-semibold text-gray-900 mb-1">Welcome</div>
                <div className="text-sm text-gray-500 line-clamp-2">
                  Hi {`{{name}}`}, Welcome to Frappe CRM bootcamp. Your company {`{{organization}}`} is eligible for this event please buy the ticket here.
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg hover:border-green-500 cursor-pointer p-4 transition-colors">
                <div className="font-semibold text-gray-900 mb-1">hello_crm_users</div>
                <div className="text-sm text-gray-500 line-clamp-2">
                  Hi {`{{1}}`}, How are you? Is your company {`{{2}}`} interested in Frappe CRM?
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-lg">
              <button onClick={() => setIsWhatsAppModalOpen(false)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
                Send Template
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
