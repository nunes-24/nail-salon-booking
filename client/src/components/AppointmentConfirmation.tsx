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
        <h2 className="text-2xl text-[#7D4F50] mb-4">Agendamento Confirmado!</h2>
        <p className="mb-8 max-w-md mx-auto">
          Seu agendamento foi confirmado com sucesso. Você receberá um email de confirmação em breve com os detalhes da sua marcação.
        </p>
        <Button 
          onClick={handleReturnToMain}
          className="bg-[#D7B29D] text-white py-3 px-8 rounded-lg hover:bg-[#D7B29D]/90 transition shadow-md"
        >
          Voltar à Página Inicial
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl text-[#7D4F50] mb-4 text-center font-medium">Contacto</h2>
      
      {/* Appointment Summary */}
      <div className="bg-[#FCF5EE] rounded-xl p-3 mb-5">
        <h3 className="text-base mb-2 text-[#7D4F50] font-medium">Resumo</h3>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between pb-1">
            <span className="text-[#333333]/70">Serviço:</span>
            <span className="font-medium">{selectedService?.name || 'Não selecionado'}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[#333333]/70">Data:</span>
            <span className="font-medium">{selectedDate ? formatDatePt(selectedDate) : 'Não selecionada'}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[#333333]/70">Hora:</span>
            <span className="font-medium">{selectedTime || 'Não selecionada'}</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-[#333333]/70">Preço:</span>
            <span className="font-medium">{selectedService ? formatCurrency(selectedService.price) : '-'}</span>
          </div>
        </div>
      </div>
      
      {/* Client Information Form */}
      <div className="p-3 mb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-[#333333]/70">Nome Completo*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full px-3 py-1 h-8 text-sm border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
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
                  <FormLabel className="text-sm text-[#333333]/70">Email*</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="w-full px-3 py-1 h-8 text-sm border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
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
                  <FormLabel className="text-sm text-[#333333]/70">Telefone*</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex-shrink-0 w-20 mr-2">
                        <select 
                          className="w-full h-8 px-2 py-1 text-sm border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                          defaultValue="+351"
                        >
                          <option value="+351">+351 🇵🇹</option>
                          <option value="+34">+34 🇪🇸</option>
                          <option value="+33">+33 🇫🇷</option>
                          <option value="+44">+44 🇬🇧</option>
                          <option value="+39">+39 🇮🇹</option>
                          <option value="+55">+55 🇧🇷</option>
                        </select>
                      </div>
                      <Input 
                        {...field} 
                        type="tel"
                        className="w-full px-3 py-1 h-8 text-sm border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                      />
                    </div>
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
                  <FormLabel className="text-sm text-[#333333]/70">Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={2}
                      className="w-full px-3 py-1 text-sm border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button 
                type="button"
                onClick={onBack}
                className="border border-[#D7B29D] text-[#D7B29D] py-2 px-5 rounded-lg hover:bg-[#E8D4C4]/20 transition"
              >
                Voltar
              </Button>
              <Button 
                type="submit"
                disabled={createAppointmentMutation.isPending}
                className="bg-[#D7B29D] text-white py-2 px-5 rounded-lg hover:bg-[#D7B29D]/90 transition shadow-md"
              >
                {createAppointmentMutation.isPending ? 'Confirmando...' : 'Confirmar'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
