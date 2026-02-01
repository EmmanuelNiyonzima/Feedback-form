
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/AppContext';
import { UserRole } from '../types';
import { LayoutDashboard, PlusCircle, FileText, BarChart2, Settings as SettingsIcon, Menu, LogOut, ChevronRight, Building2 } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active, themeColor }: any) => {
  const activeStyle = active ? { backgroundColor: themeColor, color: '#fff', boxShadow: `0 10px 15px -3px ${themeColor}40` } : {};
  
  return (
    <Link
      to={to}
      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
        active 
          ? '' 
          : 'text-slate-500 hover:bg-slate-50'
      }`}
      style={activeStyle}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} />
        <span className="font-medium tracking-wide text-sm">{label}</span>
      </div>
      {active && <ChevronRight size={16} className="text-white/70" />}
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { currentUser, getCurrentInstitution, logout } = useAppStore();
  
  const institution = getCurrentInstitution();
  const themeColor = institution?.primaryColor || '#4f46e5';
  const logo = institution?.logoUrl;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (path.startsWith('/submit/') || path === '/login') {
    return <div className="min-h-screen bg-slate-50 font-sans text-slate-900">{children}</div>;
  }

  if (!currentUser) {
    setTimeout(() => navigate('/login'), 0);
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 hidden md:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] z-10">
        <div className="p-8 pb-6 flex flex-col items-center">
          <Link to="/" className="flex flex-col items-center gap-6 text-center w-full">
            {logo ? (
              <div className="w-44 h-44 bg-white rounded-3xl shadow-xl border border-slate-100 p-4 flex items-center justify-center animate-in fade-in zoom-in duration-700">
                <img 
                  src={logo} 
                  alt="Institution Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-4xl shrink-0" style={{ background: themeColor }}>
                {currentUser.role === UserRole.SUPER_ADMIN ? 'S' : 'I'}
              </div>
            )}
            <div className="flex flex-col overflow-hidden max-w-full mt-4">
              <span className="text-2xl font-black text-slate-800 tracking-tight leading-tight truncate px-2">
                {institution ? institution.name : 'InsightFlow'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-50 pt-2 w-full">
                {currentUser.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Dashboard Control'}
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar mt-4">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Main Menu</div>
          
          {currentUser.role === UserRole.SUPER_ADMIN ? (
             <SidebarItem to="/" icon={Building2} label="Institutions" active={path === '/'} themeColor={themeColor} />
          ) : (
            <>
              <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" active={path === '/'} themeColor={themeColor} />
              <SidebarItem to="/create" icon={PlusCircle} label="Create Form" active={path === '/create'} themeColor={themeColor} />
              <SidebarItem to="/analytics" icon={BarChart2} label="Analytics & Insights" active={path.startsWith('/analytics')} themeColor={themeColor} />
              <SidebarItem to="/data" icon={FileText} label="Responses Data" active={path === '/data'} themeColor={themeColor} />
            </>
          )}

          <div className="mt-8 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Settings</div>
          {currentUser.role === UserRole.INSTITUTION_ADMIN && (
             <SidebarItem to="/settings" icon={SettingsIcon} label="Inst. Settings" active={path === '/settings'} themeColor={themeColor} />
          )}
          <button onClick={handleLogout} className="w-full group flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
             <div className="flex items-center gap-3">
               <LogOut size={20} />
               <span className="font-medium tracking-wide text-sm">Sign Out</span>
             </div>
          </button>
        </nav>

        <div className="p-4 m-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold" style={{ color: themeColor }}>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-700 truncate">{currentUser.name}</span>
              <span className="text-xs text-slate-400 truncate capitalize">{currentUser.role.replace('_', ' ').toLowerCase()}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 md:hidden sticky top-0 z-20">
          <span className="font-bold text-lg text-slate-800">InsightFlow</span>
          <button className="p-2 text-slate-600">
            <Menu />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
