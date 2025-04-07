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

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const handleBackToMain = () => {
    setLocation('/');
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await login(values.username, values.password);
    } catch (error) {
      console.error('Login error:', error);
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
