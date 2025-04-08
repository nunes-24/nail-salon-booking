import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth.tsx';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(1, 'Nome de usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

const Login = () => {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const handleBackToMain = () => {
    setLocation('/');
  };
  
  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      await login(values.username, values.password);
      // Redirect to admin management page after successful login
      setLocation('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro de login',
        description: 'Usuário ou senha incorretos',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      
      // Register API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no registro');
      }
      
      toast({
        title: 'Registro bem-sucedido',
        description: 'Sua conta foi criada. Você será redirecionado para o painel.',
      });
      
      // Auto login after registration
      await login(values.username, values.password);
      setLocation('/admin');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro no registro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro durante o registro',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F5F1]">
      <header className="bg-[#F9F5F1] py-4 px-6 flex justify-between items-center">
        <button 
          onClick={handleBackToMain} 
          className="flex items-center text-[#7D4F50] hover:text-[#7D4F50]/80 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar
        </button>
        <div className="text-2xl font-serif text-[#7D4F50] font-bold">NailArtistry</div>
        <div className="w-24"></div> {/* For balance */}
      </header>
      
      <div className="container mx-auto max-w-md py-12 px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="font-serif text-2xl text-[#7D4F50] mb-6 text-center">Área Administrativa</h2>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#333333]/70">Usuário</FormLabel>
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
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#333333]/70">Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#7D4F50]/90 transition shadow-md"
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#333333]/70">Nome de Usuário</FormLabel>
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
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#333333]/70">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            {...field} 
                            className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#333333]/70">Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-[#333333]/70">Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            className="w-full px-4 py-2 border border-[#E8D4C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4F50]/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#7D4F50]/90 transition shadow-md"
                    >
                      {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
