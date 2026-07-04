import { Link, useLocation } from 'react-router-dom';
import { 
  Users, Briefcase, UserSquare2, Building2, FileText, 
  CheckSquare, PhoneCall, Mail, Bell, ChevronDown, 
  ChevronRight, PanelLeftClose 
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Deals', path: '/deals', icon: Briefcase },
    { name: 'Contacts', path: '/contacts', icon: UserSquare2 },
    { name: 'Organizations', path: '/organizations', icon: Building2 },
    { name: 'Notes', path: '/notes', icon: FileText },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Call Logs', path: '/calls', icon: PhoneCall },
    { name: 'Email Templates', path: '/emails', icon: Mail },
  ];

  const views = [
    { name: 'Public views' },
    { name: 'My Leads', isMenu: true },
    { name: 'My Deals', isMenu: true },
    { name: 'Pinned views', isMenu: true },
    { name: 'Incoming calls' }
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-[13px] text-gray-900">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#F9FAFB] flex flex-col border-r border-gray-200">
        
        {/* Profile/App Header */}
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 rounded-lg mx-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white font-bold">
              Y
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[14px]">CRM</span>
              <span className="text-gray-500 text-[12px]">Mahek Saarla</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* Notifications */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </div>
            <span className="text-gray-400 text-xs">7</span>
          </div>
        </div>

        <div className="border-t border-gray-200 mx-4 my-2"></div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-white shadow-sm font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-6 pb-2">
            {views.map((view, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
                {view.isMenu ? <ChevronRight className="w-3 h-3" /> : <span className="w-3" />}
                <span className="flex-1">{view.name}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom Collapse */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-md w-full">
            <PanelLeftClose className="w-4 h-4" />
            <span>Collapse</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {children}
      </main>
    </div>
  );
}
