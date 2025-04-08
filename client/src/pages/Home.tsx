import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';
import ServiceSelection from '@/components/ServiceSelection';
import DateTimeSelection from '@/components/DateTimeSelection';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import { Service } from '@shared/schema';

type Step = 1 | 2 | 3;

const Home = () => {
  const [, setLocation] = useLocation();
  const [showBooking, setShowBooking] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleBookNow = () => {
    setShowBooking(true);
    // Scroll to booking section
    setTimeout(() => {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
    // Scroll to booking section
    setTimeout(() => {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F5F1]">
      <Header />
      
      <main className="flex flex-col items-center px-4 py-6 max-w-md mx-auto">
        {/* Artist bio box with text and photo inside */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8">
          <div className="flex flex-col items-center p-6">
            {/* Image first */}
            <div className="w-full mb-4">
              {/* Inner photo box */}
              <div className="w-full rounded-lg overflow-hidden mb-4">
                <div className="overflow-hidden h-[200px]">
                  <img 
                    src="https:/https://as2.ftcdn.net/v2/jpg/04/43/25/95/1000_F_443259545_PsPbDmm8HY7JLQU9Ew9DPOdAHtIhMtnD.jpg"
                    alt="Nail artist at work" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Bio text after image */}
              <p className="text-[#333333]/80">
                Ao longo do meu percurso, tenho procurado aprimorar as minhas habilidades de modo a proporcionar o melhor aos meus clientes. Concluí várias formações na área da estética, sendo que tenho uma grande paixão pelo nail design e, especialmente, pela pedicure.
              </p>
            </div>
            
            <div className="flex items-center justify-center w-full">
              <div className="flex-grow h-px bg-[#E8D4C4]"></div>
              <em className="mx-3 text-[#7D4F50] italic">Iolanda Magalhães</em>
              <button 
                onClick={handleInstagramClick}
                className="text-[#7D4F50] hover:text-[#7D4F50]/80 ml-2"
              >
                <Instagram size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Book Now button - smaller width, text sized, reviving pink */}
        <div className="w-full flex justify-center mb-8">
          <Button 
            onClick={handleBookNow} 
            className="px-6 py-2 bg-[#FF6B98] text-white rounded-lg hover:bg-[#FF6B98]/90 transition shadow-md w-40"
          >
            Agendar Agora
          </Button>
        </div>

        {/* Booking section - now integrated in the main page */}
        {showBooking && (
          <div id="booking-section" className="w-full mb-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-8 px-4 w-full">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-red-600' : 'bg-red-200'} flex items-center justify-center text-white mb-2`}>
                  1
                </div>
                <span className={`text-sm text-center ${currentStep === 1 ? 'text-red-600' : 'text-red-400'}`}>
                  Serviços
                </span>
              </div>
              
              {/* Connector - centered with circles */}
              <div className="flex items-center">
                <div className={`h-[1px] w-16 ${currentStep >= 2 ? 'bg-red-600' : 'bg-red-200'}`}></div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-red-600' : 'bg-red-200'} flex items-center justify-center text-white mb-2`}>
                  2
                </div>
                <span className={`text-sm text-center ${currentStep === 2 ? 'text-red-600' : 'text-red-400'}`}>
                  Agenda
                </span>
              </div>
              
              {/* Connector - centered with circles */}
              <div className="flex items-center">
                <div className={`h-[1px] w-16 ${currentStep >= 3 ? 'bg-red-600' : 'bg-red-200'}`}></div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-red-600' : 'bg-red-200'} flex items-center justify-center text-white mb-2`}>
                  3
                </div>
                <span className={`text-sm text-center ${currentStep === 3 ? 'text-red-600' : 'text-red-400'}`}>
                  Contacto
                </span>
              </div>
            </div>
            
            {/* Step Content */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md w-full p-4">
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
        )}

        {/* Location box */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md w-full mb-8">
          <div className="p-4">
            <h2 className="text-xl text-[#7D4F50] mb-3 text-center">Localização</h2>
            <p className="text-[#333333]/80 mb-4 text-center">
              R. Casal do Marco 73c, 2840-732 Arrentela
            </p>
            {/* Google Maps iframe - satellite view with higher zoom */}
            <div className="w-full h-32 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d389.2534421464992!2d-9.107406838539076!3d38.62409392691151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19378ba465cedf%3A0xd6edd8582bed3ae1!2sR.%20Casal%20do%20Marco%2073C%2C%202840-732%20Arrentela!5e1!3m2!1spt-BR!2spt!4v1713469034998!5m2!1spt-BR!2spt" 
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
          <div className="border-t border-black/10 pt-4 w-full">
            <p className="text-sm text-[#333333]/60">
              © 2025 Agenda de Iolanda Magalhães. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
