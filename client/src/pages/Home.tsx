import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';
import ServiceSelection from '@/components/ServiceSelection';
import DateTimeSelection from '@/components/DateTimeSelection';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import { Service } from '@shared/schema';

type Step = 1 | 2 | 3;

interface HomeProps {
  showBookingDirectly?: boolean;
}

const Home = ({ showBookingDirectly = false }: HomeProps) => {
  const [, setLocation] = useLocation();
  const [showBooking, setShowBooking] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleBookNow = () => {
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/iolanails', '_blank');
  };
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };
  
  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };
  
  // Set showBooking to true if showBookingDirectly is true (for direct links)
  useEffect(() => {
    if (showBookingDirectly) {
      setShowBooking(true);
    }
  }, [showBookingDirectly]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F5F1]">
      <Header />
      
      {showBooking ? (
        <div className="flex flex-col items-center px-4 py-6 mx-auto max-w-md">
          {/* Booking Header */}
          <div className="w-full flex items-center mb-6">
            <button 
              onClick={handleCloseBooking} 
              className="flex items-center text-[#7D4F50] hover:text-[#7D4F50]/80 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Voltar
            </button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-12 px-4 w-full">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'} flex items-center justify-center text-white font-medium mb-2`}>
                1
              </div>
              <span className={`text-sm ${currentStep === 1 ? 'text-[#7D4F50] font-medium' : 'text-[#D7B29D]'}`}>
                Escolher Serviço
              </span>
            </div>
            
            {/* Connector */}
            <div className={`h-[1px] w-full max-w-[60px] mx-2 ${currentStep >= 2 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'}`}></div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'} flex items-center justify-center text-white font-medium mb-2`}>
                2
              </div>
              <span className={`text-sm ${currentStep === 2 ? 'text-[#7D4F50] font-medium' : 'text-[#D7B29D]'}`}>
                Data e Hora
              </span>
            </div>
            
            {/* Connector */}
            <div className={`h-[1px] w-full max-w-[60px] mx-2 ${currentStep >= 3 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'}`}></div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'} flex items-center justify-center text-white font-medium mb-2`}>
                3
              </div>
              <span className={`text-sm ${currentStep === 3 ? 'text-[#7D4F50] font-medium' : 'text-[#D7B29D]'}`}>
                Confirmação
              </span>
            </div>
          </div>
          
          {/* Step Content */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8 p-4">
            {currentStep === 1 && (
              <ServiceSelection 
                onServiceSelect={handleServiceSelect} 
                onContinue={() => goToStep(2)} 
              />
            )}
            
            {currentStep === 2 && (
              <DateTimeSelection 
                onDateTimeSelect={handleDateTimeSelect}
                onContinue={() => goToStep(3)}
                onBack={() => goToStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <AppointmentConfirmation 
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onBack={() => goToStep(2)}
              />
            )}
          </div>
        </div>
      ) : (
        <main className="flex flex-col items-center px-4 py-6 max-w-md mx-auto">
          {/* Artist bio box - containing nail designer image and text */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8">
            <div className="flex flex-col items-center">
              {/* Nail designer image box - inside the bio box */}
              <div className="w-full p-4 pb-0">
                <div className="rounded-lg overflow-hidden mb-4" style={{ height: '200px' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                    alt="Nail artist at work" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bio section */}
              <div className="p-6 pt-0 w-full">
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

          {/* Book Now button - smaller width, text sized */}
          <div className="w-full flex justify-center mb-8">
            <Button 
              onClick={handleBookNow} 
              className="px-8 py-2 bg-[#7D4F50] text-white rounded-lg font-medium hover:bg-[#7D4F50]/90 transition shadow-md"
            >
              Agendar Agora
            </Button>
          </div>

          {/* Location box */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8">
            <div className="p-4">
              <h2 className="font-serif text-xl text-[#7D4F50] mb-3 text-center">Localização</h2>
              <p className="text-[#333333]/80 mb-4 text-center">
                R. Casal do Marco 73c, 2840-732 Arrentela
              </p>
              {/* Google Maps iframe - satellite view with less height */}
              <div className="w-full h-32 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3114.0323723021774!2d-9.1074068!3d38.6240939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19378ba465cedf%3A0xd6edd8582bed3ae1!2sR.%20Casal%20do%20Marco%2073C%2C%202840-732%20Arrentela!5e1!3m2!1spt-BR!2spt!4v1713469034998!5m2!1spt-BR!2spt" 
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
      )}
    </div>
  );
};

export default Home;
