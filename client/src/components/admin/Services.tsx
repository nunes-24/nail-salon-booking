import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertServiceSchema, insertServiceCategorySchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDuration } from '@/lib/utils';

type ServiceWithCategory = {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  duration: number;
  image: string;
  categoryName: string;
};

type ServiceCategory = {
  id: number;
  name: string;
  image: string;
};

const Services = () => {
  const { toast } = useToast();
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  
  // Define form schemas
  const serviceForm = useForm<z.infer<typeof insertServiceSchema>>({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      categoryId: 0,
      name: '',
      price: 0,
      duration: 0,
      image: '',
    },
  });
  
  const categoryForm = useForm<z.infer<typeof insertServiceCategorySchema>>({
    resolver: zodResolver(insertServiceCategorySchema),
    defaultValues: {
      name: '',
      image: '',
    },
  });
  
  // Fetch services with categories
  const servicesQuery = useQuery({
    queryKey: ['/api/services-with-categories'],
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load services: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  // Fetch categories
  const categoriesQuery = useQuery({
    queryKey: ['/api/service-categories'],
    onSuccess: (data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        serviceForm.setValue('categoryId', data[0].id);
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load categories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertServiceSchema>) => {
      return apiRequest('POST', '/api/services', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services-with-categories'] });
      toast({
        title: 'Serviço adicionado',
        description: 'O serviço foi adicionado com sucesso',
      });
      setIsServiceDialogOpen(false);
      serviceForm.reset();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao adicionar serviço',
      });
    },
  });
  
  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertServiceCategorySchema>) => {
      return apiRequest('POST', '/api/service-categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/service-categories'] });
      toast({
        title: 'Categoria adicionada',
        description: 'A categoria foi adicionada com sucesso',
      });
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao adicionar categoria',
      });
    },
  });
  
  const onSubmitService = (data: z.infer<typeof insertServiceSchema>) => {
    createServiceMutation.mutate({
      ...data,
      categoryId: Number(data.categoryId),
      price: Number(data.price),
      duration: Number(data.duration),
    });
  };
  
  const onSubmitCategory = (data: z.infer<typeof insertServiceCategorySchema>) => {
    createCategoryMutation.mutate(data);
  };
  
  const services = servicesQuery.data as ServiceWithCategory[] || [];
  const categories = categoriesQuery.data as ServiceCategory[] || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Gerenciar Serviços</h3>
        <div className="space-x-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#7D4F50] text-[#7D4F50]">
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              </DialogHeader>
              <Form {...categoryForm}>
                <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={categoryForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
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
                      disabled={createCategoryMutation.isPending}
                      className="bg-[#7D4F50] hover:bg-[#7D4F50]/90"
                    >
                      {createCategoryMutation.isPending ? 'Adicionando...' : 'Adicionar Categoria'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#7D4F50] text-white hover:bg-[#7D4F50]/90">
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Serviço</DialogTitle>
              </DialogHeader>
              <Form {...serviceForm}>
                <form onSubmit={serviceForm.handleSubmit(onSubmitService)} className="space-y-4">
                  <FormField
                    control={serviceForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={serviceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={serviceForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço (€)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={serviceForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duração (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={serviceForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
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
                      disabled={createServiceMutation.isPending}
                      className="bg-[#7D4F50] hover:bg-[#7D4F50]/90"
                    >
                      {createServiceMutation.isPending ? 'Adicionando...' : 'Adicionar Serviço'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesQuery.isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-[#333333]/70">{service.categoryName}</p>
                      </div>
                      <span className="font-medium text-[#7D4F50]">{formatCurrency(service.price)}</span>
                    </div>
                    <p className="text-sm text-[#333333]/70">{formatDuration(service.duration)}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center py-8 text-[#333333]/70">Nenhum serviço encontrado</p>
            )}
          </div>
        </TabsContent>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesQuery.isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                services
                  .filter(service => service.categoryId === category.id)
                  .map((service) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-[#333333]/70">{service.categoryName}</p>
                          </div>
                          <span className="font-medium text-[#7D4F50]">{formatCurrency(service.price)}</span>
                        </div>
                        <p className="text-sm text-[#333333]/70">{formatDuration(service.duration)}</p>
                      </CardContent>
                    </Card>
                  ))
              )}
              
              {services.filter(service => service.categoryId === category.id).length === 0 && (
                <p className="col-span-full text-center py-8 text-[#333333]/70">
                  Nenhum serviço encontrado nesta categoria
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Services;
