import { useAuth } from '@/lib/auth.tsx';

type SectionType = 'appointments' | 'clients' | 'schedules' | 'billing' | 'services' | 'messages' | 'config';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { logout } = useAuth();
  
  return (
    <aside className="w-64 bg-white shadow-md pt-6 h-screen sticky top-0">
      <div className="px-6 mb-8">
        <div className="text-xl font-serif text-[#7D4F50] font-bold">NailArtistry</div>
        <div className="text-sm text-[#333333]/60">Área Administrativa</div>
      </div>
      
      <nav className="space-y-1">
        <button 
          onClick={() => onSectionChange('clients')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'clients' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Clientes
        </button>
        
        <button 
          onClick={() => onSectionChange('appointments')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'appointments' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Agendamentos
        </button>
        
        <button 
          onClick={() => onSectionChange('schedules')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'schedules' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Horários
        </button>
        
        <button 
          onClick={() => onSectionChange('billing')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'billing' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Faturamento
        </button>
        
        <button 
          onClick={() => onSectionChange('services')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'services' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Serviços
        </button>
        
        <button 
          onClick={() => onSectionChange('messages')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'messages' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Mensagens
        </button>
        
        <button 
          onClick={() => onSectionChange('config')}
          className={`sidebar-item flex items-center w-full px-6 py-3 text-left ${activeSection === 'config' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configurações
        </button>
      </nav>
      
      <div className="absolute bottom-0 w-full pb-6">
        <button 
          onClick={logout}
          className="sidebar-item flex items-center w-full px-6 py-3 text-left hover:bg-[#E8D4C4] hover:text-[#7D4F50] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
