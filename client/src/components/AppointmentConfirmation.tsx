import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { insertClientSchema } from '@shared/schema';
import { Service } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { formatDatePt, formatTime, formatCurrency, formatDuration } from '@/lib/utils';

interface AppointmentConfirmationProps {
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  onBack: () => void;
}

const formSchema = insertClientSchema.extend({
  notes: z.string().optional(),
});

const AppointmentConfirmation = ({ 
  selectedService, 
  selectedDate, 
  selectedTime,
  onBack,
}: AppointmentConfirmationProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });
  
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const appointmentData = {
        serviceId: selectedService?.id,
        date: selectedDate,
        notes: data.notes,
        client: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        }
      };
      
      return apiRequest('POST', '/api/appointments', appointmentData);
    },
    onSuccess: async () => {
      setIsConfirmed(true);
      toast({
        title: 'Agendamento Confirmado',
        description: 'Seu agendamento foi realizado com sucesso!',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro no Agendamento',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao agendar.',
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Dados incompletos',
        description: 'Informações de serviço, data ou hora estão faltando.',
      });
      return;
    }
    
    createAppointmentMutation.mutate(data);
  };
  
  const handleReturnToMain = () => {
    setLocation('/');
  };
  
  if (isConfirmed) {
    return (
      <div className="text-center py-12">
        <div className="mb-6 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-[#7D4F50] mb-4">Agendamento Confirmado!</h2>
        <p className="mb-8 max-w-md mx-auto">
          Seu agendamento foi confirmado com sucesso. Você receberá um email de confirmação em breve com os detalhes da sua marcação.
        </p>
        <Button 
          onClick={handleReturnToMain}
          className="bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#7D4F50]/90 transition shadow-md"
        >
          Voltar à Página Inicial
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="font-serif text-2xl text-[#7D4F50] mb-6 text-center">Confirme seu Agendamento</h2>
      
      {/* Appointment Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 font-serif text-[#7D4F50]">Resumo</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="text-[#333333]/70">Serviço:</span>
            <span className="font-medium">{selectedService?.name || 'Não selecionado'}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="text-[#333333]/70">Data:</span>
            <span className="font-medium">{selectedDate ? formatDatePt(selectedDate) : 'Não selecionada'}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="text-[#333333]/70">Hora:</span>
            <span className="font-medium">{selectedTime || 'Não selecionada'}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="text-[#333333]/70">Preço:</span>
            <span className="font-medium">{selectedService ? formatCurrency(selectedService.price) : '-'}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-[#E8D4C4]">
            <span className="text-[#333333]/70">Duração:</span>
            <span className="font-medium">{selectedService ? formatDuration(selectedService.duration) : '-'}</span>
          </div>
        </div>
      </div>
      
      {/* Client Information Form */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 font-serif text-[#7D4F50]">Seus Dados</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#333333]/70">Nome Completo*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#333333]/70">Email*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#333333]/70">Telefone*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#333333]/70">Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between mt-8">
              <Button 
                type="button"
                onClick={onBack}
                className="border border-[#7D4F50] text-[#7D4F50] py-3 px-6 rounded-lg font-medium hover:bg-[#E8D4C4]/20 transition"
              >
                Voltar
              </Button>
              <Button 
                type="submit"
                disabled={createAppointmentMutation.isPending}
                className="bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#7D4F50]/90 transition shadow-md"
              >
                {createAppointmentMutation.isPending ? 'Confirmando...' : 'Confirmar Agendamento'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
