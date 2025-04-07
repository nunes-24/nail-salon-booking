import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { ptMonths, getAvailableTimes, isPastDate } from '@/lib/utils';

type Availability = {
  id: number;
  date: string;
  isAvailable: boolean;
};

const Schedules = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Fetch availabilities
  const availabilityQuery = useQuery({
    queryKey: ['/api/availability'],
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load availability: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  // Update availability mutation
  const updateAvailabilityMutation = useMutation({
    mutationFn: async ({ date, isAvailable }: { date: Date; isAvailable: boolean }) => {
      return apiRequest('POST', '/api/availability', { date, isAvailable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
      toast({
        title: 'Disponibilidade atualizada',
        description: 'A disponibilidade foi atualizada com sucesso',
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar disponibilidade',
      });
    },
  });
  
  // Check if date has availability set
  const getDateAvailability = (date: Date): boolean => {
    if (!date) return true;
    
    const availabilities = availabilityQuery.data as Availability[] || [];
    const formattedDate = date.toISOString().split('T')[0];
    
    const availability = availabilities.find(a => 
      new Date(a.date).toISOString().split('T')[0] === formattedDate
    );
    
    return availability ? availability.isAvailable : true;
  };
  
  const handleUpdateAvailability = () => {
    if (!selectedDate) return;
    
    updateAvailabilityMutation.mutate({
      date: selectedDate,
      isAvailable
    });
  };
  
  // Customize date picker appearance
  const renderDayContents = (day: number, date: Date) => {
    // Add custom styling to dates
    const isDateAvailable = getDateAvailability(date);
    const isPast = isPastDate(date);
    
    return (
      <div
        className={`font-medium text-sm py-1 px-2 rounded-full mx-auto flex items-center justify-center 
          ${isPast ? 'opacity-50 cursor-not-allowed' : 
            isDateAvailable ? '' : 'bg-red-100 text-red-700'}`}
      >
        {day}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Gerenciar Disponibilidade</h3>
        
        <div className="mb-6">
          <p className="text-sm text-[#333333]/70 mb-2">
            Selecione uma data para gerenciar sua disponibilidade. As datas marcadas em vermelho estão bloqueadas.
          </p>
          
          <div className="max-w-md mx-auto mt-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              inline
              locale="pt"
              renderDayContents={renderDayContents}
              minDate={new Date()}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#7D4F50] text-white font-medium hover:bg-[#7D4F50]/90 transition">
                Gerenciar Data Selecionada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerenciar Disponibilidade</DialogTitle>
              </DialogHeader>
              
              {selectedDate && (
                <div className="space-y-4 py-4">
                  <p className="text-center font-medium">
                    {selectedDate.getDate()} de {ptMonths[selectedDate.getMonth()]} de {selectedDate.getFullYear()}
                  </p>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium">Disponível para agendamentos</span>
                    <Switch 
                      checked={isAvailable}
                      onCheckedChange={setIsAvailable}
                    />
                  </div>
                  
                  <div className="border-t border-[#E8D4C4] pt-4 mt-4">
                    <p className="text-sm text-[#333333]/70 mb-4">
                      {isAvailable 
                        ? 'Esta data estará disponível para agendamentos.' 
                        : 'Esta data será bloqueada e não estará disponível para agendamentos.'
                      }
                    </p>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleUpdateAvailability}
                        disabled={updateAvailabilityMutation.isPending}
                        className="bg-[#7D4F50] hover:bg-[#7D4F50]/90"
                      >
                        {updateAvailabilityMutation.isPending ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Horário de Funcionamento</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Segunda-feira</span>
            <span>09:00 - 18:00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Terça-feira</span>
            <span>09:00 - 18:00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Quarta-feira</span>
            <span>09:00 - 18:00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Quinta-feira</span>
            <span>09:00 - 18:00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Sexta-feira</span>
            <span>09:00 - 18:00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Sábado</span>
            <span>09:00 - 14:00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="font-medium">Domingo</span>
            <span className="text-red-500">Fechado</span>
          </div>
        </div>
        
        <p className="text-sm text-[#333333]/70 mt-4">
          Para alterar o horário de funcionamento, entre em contato com o administrador do sistema.
        </p>
      </div>
    </div>
  );
};

export default Schedules;
