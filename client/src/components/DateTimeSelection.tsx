import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { isPastDate, isPastTime, ptMonths, getCalendarDays, getAvailableTimes } from '@/lib/utils';

interface DateTimeSelectionProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const DateTimeSelection = ({ onDateTimeSelect, onContinue, onBack }: DateTimeSelectionProps) => {
  const { toast } = useToast();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarDays, setCalendarDays] = useState<ReturnType<typeof getCalendarDays>>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  
  // Initialize calendar days
  useEffect(() => {
    setCalendarDays(getCalendarDays(currentYear, currentMonth));
  }, [currentYear, currentMonth]);
  
  // Update available times when date changes
  useEffect(() => {
    if (selectedDate) {
      const times = getAvailableTimes(selectedDate);
      // Filter out past times if the selected date is today
      const today = new Date();
      
      if (selectedDate.getDate() === today.getDate() && 
          selectedDate.getMonth() === today.getMonth() && 
          selectedDate.getFullYear() === today.getFullYear()) {
        setAvailableTimes(times.filter(time => !isPastTime(time)));
      } else {
        setAvailableTimes(times);
      }
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate]);
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const toggleMonthSelector = () => {
    setShowMonthSelector(!showMonthSelector);
  };
  
  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setShowMonthSelector(false);
  };
  
  const handleDateSelect = (day: number, disabled: boolean) => {
    if (disabled) return;
    
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setSelectedTime(null); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const dateWithTime = new Date(selectedDate);
      dateWithTime.setHours(hours, minutes);
      
      onDateTimeSelect(dateWithTime, time);
    }
  };
  
  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Seleção incompleta',
        description: 'Por favor, selecione uma data e horário para continuar.',
      });
      return;
    }
    
    onContinue();
  };
  
  return (
    <div>
      <h2 className="text-xl text-[#7D4F50] mb-6 text-center font-semibold">Step 2: Escolha o Dia e Hora</h2>
      
      {/* Calendar Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePrevMonth}
            className="text-[#7D4F50] hover:text-[#7D4F50]/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex flex-col items-center relative">
            <button 
              className="text-lg text-[#7D4F50] cursor-pointer hover:text-[#7D4F50]/80 flex items-center"
              onClick={toggleMonthSelector}
            >
              {ptMonths[currentMonth]}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transition-transform ${showMonthSelector ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showMonthSelector && (
              <div className="absolute top-full mt-1 z-10 grid grid-cols-4 gap-1 bg-white p-2 rounded-lg shadow-md border border-[#E8D4C4]">
                {ptMonths.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => handleMonthSelect(index)}
                    className={`text-xs p-1 rounded ${currentMonth === index ? 'bg-[#7D4F50] text-white' : 'hover:bg-[#E8D4C4]/50'}`}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleNextMonth}
            className="text-[#7D4F50] hover:text-[#7D4F50]/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          <div className="text-xs text-[#333333]/70">D</div>
          <div className="text-xs text-[#333333]/70">S</div>
          <div className="text-xs text-[#333333]/70">T</div>
          <div className="text-xs text-[#333333]/70">Q</div>
          <div className="text-xs text-[#333333]/70">Q</div>
          <div className="text-xs text-[#333333]/70">S</div>
          <div className="text-xs text-[#333333]/70">S</div>
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isSelected = selectedDate && 
                               selectedDate.getDate() === day.day && 
                               selectedDate.getMonth() === currentMonth && 
                               selectedDate.getFullYear() === currentYear;
            
            return (
              <div 
                key={index}
                className={`aspect-square rounded-md flex items-center justify-center text-center text-sm
                  ${day.disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#E8D4C4]/50 cursor-pointer transition-colors'}
                  ${!day.currentMonth ? 'text-[#333333]/40' : 'text-[#333333]'}
                  ${isSelected ? 'bg-[#7D4F50] text-white' : ''}`}
                onClick={() => handleDateSelect(day.day, day.disabled)}
              >
                <span>{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Time Slots */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 className="text-lg mb-3 text-[#7D4F50]">
          {selectedDate ? 
            `Horários disponíveis ${selectedDate.getDate()} de ${ptMonths[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}` : 
            'Horários disponíveis'
          }
        </h3>
        
        {selectedDate ? (
          <div className="grid grid-cols-4 gap-2">
            {/* Just show specific time slots: 09:30, 11:30, 14:00, 16:00 */}
            {['09:30', '11:30', '14:00', '16:00'].map((time, index) => (
              <div 
                key={index}
                className={`px-2 py-1 border rounded text-center cursor-pointer transition text-sm
                  ${selectedTime === time 
                    ? 'bg-[#7D4F50] text-white border-[#7D4F50]' 
                    : 'border-[#E8D4C4] hover:bg-[#E8D4C4]/20'}`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#333333]/70 py-2 text-sm">
            Selecione uma data para ver os horários disponíveis.
          </p>
        )}
      </div>
      
      <div className="flex justify-center space-x-4 mt-6">
        <Button 
          onClick={onBack}
          className="border border-[#D7B29D] text-[#D7B29D] py-2 px-5 rounded-lg hover:bg-[#E8D4C4]/20 transition"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleContinue}
          className="bg-[#D7B29D] text-white py-2 px-5 rounded-lg hover:bg-[#D7B29D]/90 transition shadow-md"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
