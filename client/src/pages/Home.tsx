import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const Home = () => {
  const [, setLocation] = useLocation();

  const handleBookNow = () => {
    setLocation('/booking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F5F1]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Artist photo - taller than wide */}
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-lg" style={{ maxHeight: '600px' }}>
              <img 
                src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Nail artist at work" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bio section - same width as photo */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="font-serif text-3xl md:text-4xl text-[#7D4F50] mb-4">Maria Santos</h1>
            <p className="text-lg mb-6 text-[#333333]/80">
              Com mais de 10 anos de experiência na arte de unhas, trago paixão e precisão a cada trabalho. 
              Especializada em nail art personalizada e técnicas avançadas de manicure e pedicure.
            </p>
            <p className="mb-8 text-[#333333]/80">
              Formada pela Academia de Estética de Lisboa, mantendo-me sempre atualizada com as últimas tendências e técnicas 
              do mundo da beleza. Meu compromisso é oferecer um serviço de excelência em um ambiente acolhedor e relaxante.
            </p>
            <Button 
              onClick={handleBookNow} 
              className="bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium text-lg hover:bg-[#7D4F50]/90 transition shadow-md self-start"
            >
              Agendar Agora
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
