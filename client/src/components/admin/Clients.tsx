import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client, insertClientSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { formatDatePt, formatCurrency } from '@/lib/utils';

const Clients = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Define form schema
  const form = useForm<z.infer<typeof insertClientSchema>>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });
  
  // Fetch clients
  const clientsQuery = useQuery({
    queryKey: ['/api/clients'],
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load clients: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertClientSchema>) => {
      return apiRequest('POST', '/api/clients', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Cliente adicionado',
        description: 'Cliente adicionado com sucesso',
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao adicionar cliente',
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof insertClientSchema>) => {
    createClientMutation.mutate(data);
  };
  
  // Filter clients based on search term
  const filteredClients = searchTerm.trim() === ''
    ? (clientsQuery.data as Client[] || [])
    : (clientsQuery.data as Client[] || []).filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between mb-6">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Pesquisar clientes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50 w-64"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#333333]/50 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7D4F50] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7D4F50]/90 transition flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={createClientMutation.isPending}
                    className="bg-[#7D4F50] hover:bg-[#7D4F50]/90"
                  >
                    {createClientMutation.isPending ? 'Adicionando...' : 'Adicionar Cliente'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#E8D4C4] text-left">
              <th className="pb-3 pr-2">Nome</th>
              <th className="pb-3 pr-2">Email</th>
              <th className="pb-3 pr-2">Telefone</th>
              <th className="pb-3 pr-2">Última Visita</th>
              <th className="pb-3 pr-2">Gastos</th>
              <th className="pb-3 pr-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientsQuery.isLoading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">Carregando clientes...</td>
              </tr>
            ) : filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <tr key={client.id} className="border-b border-[#E8D4C4]/50 hover:bg-[#F9F5F1]">
                  <td className="py-3 pr-2">{client.name}</td>
                  <td className="py-3 pr-2">{client.email}</td>
                  <td className="py-3 pr-2">{client.phone}</td>
                  <td className="py-3 pr-2">{client.lastVisit ? formatDatePt(new Date(client.lastVisit)) : '-'}</td>
                  <td className="py-3 pr-2">{formatCurrency(client.totalSpent || 0)}</td>
                  <td className="py-3 pr-2 flex space-x-2">
                    <button className="p-1 text-[#7D4F50] hover:bg-[#E8D4C4]/30 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center">Nenhum cliente encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
