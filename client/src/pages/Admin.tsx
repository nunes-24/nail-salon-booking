import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth.tsx';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import Clients from '@/components/admin/Clients';
import Appointments from '@/components/admin/Appointments';
import Schedules from '@/components/admin/Schedules';
import Billing from '@/components/admin/Billing';
import Services from '@/components/admin/Services';
import Messages from '@/components/admin/Messages';
import Config from '@/components/admin/Config';
import { useIsMobile } from '@/hooks/use-mobile';

type SectionType = 'appointments' | 'clients' | 'schedules' | 'billing' | 'services' | 'messages' | 'config';

const Admin = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionType>('appointments');
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);
  
  // Adjust sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  // If not authenticated, don't render the admin page
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-[#F9F5F1]">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      <div className="flex-1 p-4 md:p-8">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button 
                onClick={toggleSidebar}
                className="mr-4 p-2 text-[#7D4F50] hover:bg-[#E8D4C4] rounded-md"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="font-serif text-xl md:text-2xl text-[#7D4F50]">
              {activeSection === 'appointments' && 'Agendamentos'}
              {activeSection === 'clients' && 'Clientes'}
              {activeSection === 'schedules' && 'Horários'}
              {activeSection === 'billing' && 'Faturamento'}
              {activeSection === 'services' && 'Serviços'}
              {activeSection === 'messages' && 'Mensagens'}
              {activeSection === 'config' && 'Configurações'}
            </h1>
          </div>
          <div className="text-sm text-[#333333]/60">Bem-vindo, Administrador</div>
        </header>
        
        {activeSection === 'appointments' && <Appointments />}
        {activeSection === 'clients' && <Clients />}
        {activeSection === 'schedules' && <Schedules />}
        {activeSection === 'billing' && <Billing />}
        {activeSection === 'services' && <Services />}
        {activeSection === 'messages' && <Messages />}
        {activeSection === 'config' && <Config />}
      </div>
    </div>
  );
};

export default Admin;
