import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

const Home = () => {
  const [, setLocation] = useLocation();

  const handleBookNow = () => {
    setLocation('/booking');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/iolanails', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F5F1]">
      <Header />
      
      <main className="flex flex-col items-center px-4 py-6 max-w-md mx-auto">
        {/* Artist bio box - containing photo and text */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8">
          <div className="flex flex-col items-center">
            {/* Artist photo - centered, taller than wide */}
            <div className="w-full" style={{ maxHeight: '400px' }}>
              <img 
                src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Nail artist at work" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bio section */}
            <div className="p-6 w-full">
              <h1 className="font-serif text-2xl text-[#7D4F50] mb-4 text-center">Nail Artistry</h1>
              <p className="text-[#333333]/80 mb-3">
                Com mais de 10 anos de experiência na arte de unhas, trago paixão e precisão a cada trabalho.
              </p>
              <p className="text-[#333333]/80 mb-3">
                Especializada em nail art personalizada e técnicas avançadas de manicure e pedicure.
              </p>
              <p className="text-[#333333]/80 mb-3">
                Formada pela Academia de Estética de Lisboa, mantendo-me sempre atualizada com as últimas tendências.
              </p>
              <p className="text-[#333333]/80 mb-3">
                Meu compromisso é oferecer um serviço de excelência em um ambiente acolhedor e relaxante.
              </p>
              <p className="text-[#333333]/80 mb-3 flex items-center justify-center">
                <em className="mr-2">Iola Nails</em>
                <button 
                  onClick={handleInstagramClick}
                  className="text-[#7D4F50] hover:text-[#7D4F50]/80"
                >
                  <Instagram size={18} />
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Book Now button - separate and centered */}
        <Button 
          onClick={handleBookNow} 
          className="w-full bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium text-lg hover:bg-[#7D4F50]/90 transition shadow-md mb-8"
        >
          Agendar Agora
        </Button>

        {/* Location box */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8">
          <div className="p-4">
            <h2 className="font-serif text-xl text-[#7D4F50] mb-3 text-center">Localização</h2>
            <p className="text-[#333333]/80 mb-4 text-center">
              R. Casal do Marco 73c, 2840-732 Arrentela
            </p>
            {/* Google Maps iframe */}
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.0323723021774!2d-9.1074068!3d38.6240939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19378ba465cedf%3A0xd6edd8582bed3ae1!2sR.%20Casal%20do%20Marco%2073C%2C%202840-732%20Arrentela!5e0!3m2!1spt-BR!2spt!4v1713469034998!5m2!1spt-BR!2spt" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-md px-4 py-4 text-center">
          <div className="border-t border-[#E8D4C4] pt-4 w-full">
            <p className="text-sm text-[#333333]/60">
              © {new Date().getFullYear()} Nail Artistry. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
