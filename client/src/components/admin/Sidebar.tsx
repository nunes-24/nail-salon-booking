import { useAuth } from '@/lib/auth.tsx';
import { Menu } from 'lucide-react';

type SectionType = 'appointments' | 'clients' | 'schedules' | 'billing' | 'services' | 'messages' | 'config';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ activeSection, onSectionChange, isOpen, onToggle }: SidebarProps) => {
  const { logout } = useAuth();
  
  // Function to handle section changes with mobile responsiveness
  const handleSectionChange = (section: SectionType) => {
    onSectionChange(section);
    
    // If sidebar is closed, open it
    if (!isOpen) {
      onToggle();
    } 
    // If sidebar is open and we're on mobile, close it when selecting a section
    else if (window.innerWidth < 768) {
      onToggle();
    }
  };
  
  return (
    <aside 
      className={`bg-white shadow-md h-screen sticky top-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}
    >
      <div className={`flex flex-col pt-6 ${isOpen ? 'px-6' : 'px-3'} mb-8`}>
        {isOpen ? (
          <>
            <div className="text-xl font-serif text-[#7D4F50] font-bold">NailArtistry</div>
            <div className="text-sm text-[#333333]/60">Área Administrativa</div>
          </>
        ) : (
          <button 
            onClick={onToggle} 
            className="flex items-center justify-center w-10 h-10 text-[#7D4F50]"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
      
      <nav className="space-y-1">
        <button 
          onClick={() => handleSectionChange('clients')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'clients' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Clientes" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {isOpen && "Clientes"}
        </button>
        
        <button 
          onClick={() => handleSectionChange('appointments')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'appointments' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Agendamentos" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {isOpen && "Agendamentos"}
        </button>
        
        <button 
          onClick={() => handleSectionChange('schedules')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'schedules' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Horários" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isOpen && "Horários"}
        </button>
        
        <button 
          onClick={() => handleSectionChange('billing')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'billing' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Faturamento" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          {isOpen && "Faturamento"}
        </button>
        
        <button 
          onClick={() => handleSectionChange('services')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'services' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Serviços" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {isOpen && "Serviços"}
        </button>
        
        <button 
          onClick={() => handleSectionChange('messages')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'messages' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Mensagens" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {isOpen && "Mensagens"}
        </button>
        
        <button 
          onClick={() => handleSectionChange('config')}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 ${activeSection === 'config' ? 'bg-[#E8D4C4] text-[#7D4F50]' : 'hover:bg-[#E8D4C4] hover:text-[#7D4F50]'} transition-all`}
          title={!isOpen ? "Configurações" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {isOpen && "Configurações"}
        </button>
      </nav>
      
      <div className="absolute bottom-0 w-full pb-6">
        <button 
          onClick={logout}
          className={`sidebar-item flex items-center w-full ${isOpen ? 'px-6 text-left' : 'justify-center px-3'} py-3 hover:bg-[#E8D4C4] hover:text-[#7D4F50] transition-all`}
          title={!isOpen ? "Sair" : ""}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && "Sair"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
