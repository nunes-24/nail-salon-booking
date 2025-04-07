import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

// Message template schema
const messageTemplateSchema = z.object({
  type: z.string(),
  subject: z.string().min(1, "O assunto é obrigatório"),
  body: z.string().min(1, "O corpo da mensagem é obrigatório"),
});

type MessageTemplate = {
  id: number;
  type: string;
  subject: string;
  body: string;
};

const Messages = () => {
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState<MessageTemplate | null>(null);
  
  // Define form for templates
  const form = useForm<z.infer<typeof messageTemplateSchema>>({
    resolver: zodResolver(messageTemplateSchema),
    defaultValues: {
      type: '',
      subject: '',
      body: '',
    },
  });
  
  // Fetch message templates
  const templatesQuery = useQuery({
    queryKey: ['/api/message-templates'],
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load message templates: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  // Update message template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof messageTemplateSchema> & { id: number }) => {
      return apiRequest('PUT', `/api/message-templates/${data.id}`, {
        subject: data.subject,
        body: data.body,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/message-templates'] });
      toast({
        title: 'Template atualizado',
        description: 'O template de mensagem foi atualizado com sucesso',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar template',
      });
    },
  });
  
  const onSelectTemplate = (template: MessageTemplate) => {
    setActiveTemplate(template);
    form.reset({
      type: template.type,
      subject: template.subject,
      body: template.body,
    });
  };
  
  const onSubmit = (data: z.infer<typeof messageTemplateSchema>) => {
    if (!activeTemplate) return;
    
    updateTemplateMutation.mutate({
      ...data,
      id: activeTemplate.id,
    });
  };
  
  const templates = templatesQuery.data as MessageTemplate[] || [];
  
  // Helper to get template display name
  const getTemplateDisplayName = (type: string) => {
    switch (type) {
      case 'confirmation':
        return 'Confirmação';
      case 'cancellation':
        return 'Cancelamento';
      default:
        return type;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Templates list */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Mensagens</CardTitle>
              <CardDescription>
                Clique em um template para editar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templatesQuery.isLoading ? (
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
                  ))}
                </div>
              ) : templates.length > 0 ? (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className={`w-full justify-start ${activeTemplate?.id === template.id ? 'border-[#7D4F50] text-[#7D4F50] bg-[#E8D4C4]/20' : ''}`}
                      onClick={() => onSelectTemplate(template)}
                    >
                      {getTemplateDisplayName(template.type)}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-[#333333]/70">
                  Nenhum template de mensagem encontrado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Template editor */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTemplate 
                  ? `Editar Template: ${getTemplateDisplayName(activeTemplate.type)}` 
                  : 'Selecione um template para editar'}
              </CardTitle>
              <CardDescription>
                Personalize as mensagens enviadas aos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTemplate ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assunto</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Corpo da Mensagem</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={8}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-[#333333]/70 mt-2">
                            Variáveis disponíveis: {'{client_name}'}, {'{appointment_date}'}, {'{appointment_time}'}, {'{service_name}'}
                          </p>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        disabled={updateTemplateMutation.isPending}
                        className="bg-[#7D4F50] hover:bg-[#7D4F50]/90"
                      >
                        {updateTemplateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="py-12 text-center text-[#333333]/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-[#D7B29D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="mb-2">Selecione um template da lista para editar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pré-visualização</CardTitle>
          <CardDescription>
            Veja como sua mensagem ficará para o cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTemplate ? (
            <Tabs defaultValue="email">
              <TabsList className="mb-4">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm font-medium">Assunto: {form.watch('subject')}</p>
                    <p className="text-sm text-[#333333]/70">De: NailArtistry &lt;info@nailartistry.com&gt;</p>
                    <p className="text-sm text-[#333333]/70">Para: Ana Silva &lt;ana.silva@exemplo.com&gt;</p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {form.watch('body')
                      .replace('{client_name}', 'Ana Silva')
                      .replace('{appointment_date}', '15/10/2023')
                      .replace('{appointment_time}', '14:30')
                      .replace('{service_name}', 'Manicure Gel')
                      .split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sms" className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm font-medium">De: NailArtistry</p>
                    <p className="text-sm text-[#333333]/70">Para: 912 345 678</p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    {form.watch('body')
                      .replace('{client_name}', 'Ana Silva')
                      .replace('{appointment_date}', '15/10/2023')
                      .replace('{appointment_time}', '14:30')
                      .replace('{service_name}', 'Manicure Gel')
                      .split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-8 text-center text-[#333333]/70">
              <p>Selecione um template para ver a pré-visualização</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
