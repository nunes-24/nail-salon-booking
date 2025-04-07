import { useState } from 'react';
import { useLocation } from 'wouter';
import Header from '@/components/Header';
import ServiceSelection from '@/components/ServiceSelection';
import DateTimeSelection from '@/components/DateTimeSelection';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import { Service } from '@shared/schema';

type Step = 1 | 2 | 3;

const Booking = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const handleBackToMain = () => {
    setLocation('/');
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
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F5F1]">
      {/* Header */}
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
      
      {/* Booking Steps */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-12 px-4">
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
          <div className={`h-[1px] w-full max-w-[100px] mx-2 ${currentStep >= 2 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'}`}></div>
          
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
          <div className={`h-[1px] w-full max-w-[100px] mx-2 ${currentStep >= 3 ? 'bg-[#7D4F50]' : 'bg-[#D7B29D]'}`}></div>
          
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
  );
};

export default Booking;
