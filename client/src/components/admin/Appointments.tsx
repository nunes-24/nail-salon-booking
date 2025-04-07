import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { formatDatePt, formatTime, formatCurrency } from '@/lib/utils';

type AppointmentStatus = 'pending' | 'confirmed' | 'canceled';

type AppointmentWithDetails = {
  id: number;
  clientId: number;
  serviceId: number;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  client: {
    id?: number;
    name: string;
    email?: string;
    phone?: string;
  };
  service: {
    id?: number;
    name: string;
    price: number;
    duration?: number;
  };
};

const Appointments = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('pending');
  
  // Fetch appointments with details
  const appointmentsQuery = useQuery({
    queryKey: ['/api/appointments-with-details'],
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load appointments: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: AppointmentStatus }) => {
      return apiRequest('PUT', `/api/appointments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments-with-details'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do agendamento foi atualizado com sucesso',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar status',
      });
    },
  });
  
  const handleConfirm = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'confirmed' });
  };
  
  const handleCancel = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'canceled' });
  };
  
  const filteredAppointments = ((appointmentsQuery.data as AppointmentWithDetails[]) || [])
    .filter(appointment => appointment.status === activeTab);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex border-b border-[#E8D4C4] pb-4 mb-4">
        <Button 
          onClick={() => setActiveTab('pending')}
          className={activeTab === 'pending' ? 'bg-[#7D4F50] text-white' : 'bg-transparent text-[#333333] hover:bg-[#E8D4C4]/30'}
        >
          Pendentes
        </Button>
        <Button 
          onClick={() => setActiveTab('confirmed')}
          className={`ml-2 ${activeTab === 'confirmed' ? 'bg-[#7D4F50] text-white' : 'bg-transparent text-[#333333] hover:bg-[#E8D4C4]/30'}`}
        >
          Confirmados
        </Button>
        <Button 
          onClick={() => setActiveTab('canceled')}
          className={`ml-2 ${activeTab === 'canceled' ? 'bg-[#7D4F50] text-white' : 'bg-transparent text-[#333333] hover:bg-[#E8D4C4]/30'}`}
        >
          Cancelados
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#E8D4C4] text-left">
              <th className="pb-3 pr-2">Cliente</th>
              <th className="pb-3 pr-2">Serviço</th>
              <th className="pb-3 pr-2">Data</th>
              <th className="pb-3 pr-2">Hora</th>
              <th className="pb-3 pr-2">Valor</th>
              <th className="pb-3 pr-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsQuery.isLoading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">Carregando agendamentos...</td>
              </tr>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.date);
                
                return (
                  <tr key={appointment.id} className="border-b border-[#E8D4C4]/50 hover:bg-[#F9F5F1]">
                    <td className="py-3 pr-2">{appointment.client.name}</td>
                    <td className="py-3 pr-2">{appointment.service.name}</td>
                    <td className="py-3 pr-2">{formatDatePt(appointmentDate)}</td>
                    <td className="py-3 pr-2">{formatTime(appointmentDate)}</td>
                    <td className="py-3 pr-2">{formatCurrency(appointment.service.price)}</td>
                    <td className="py-3 pr-2 flex space-x-2">
                      {activeTab === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleConfirm(appointment.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            disabled={updateStatusMutation.isPending}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleCancel(appointment.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            disabled={updateStatusMutation.isPending}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      {activeTab === 'confirmed' && (
                        <button 
                          onClick={() => handleCancel(appointment.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          disabled={updateStatusMutation.isPending}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      {activeTab === 'canceled' && (
                        <button 
                          onClick={() => handleConfirm(appointment.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          disabled={updateStatusMutation.isPending}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center">Nenhum agendamento {
                  activeTab === 'pending' ? 'pendente' : 
                  activeTab === 'confirmed' ? 'confirmado' : 'cancelado'
                } encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
