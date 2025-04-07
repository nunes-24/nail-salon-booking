import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to Portuguese format
export function formatDatePt(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// Format time from Date object
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-PT', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

// Get months in Portuguese
export const ptMonths = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];

// Get days of week in Portuguese
export const ptDaysOfWeek = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb'
];

// Format currency in Euro
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

// Format duration in minutes to hours and minutes
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutos`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${remainingMinutes} minutos`;
}

// Get available times for a given day
export function getAvailableTimes(date: Date): string[] {
  // Working hours from 9:00 to 18:00 with 30 min intervals
  const availableTimes = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    availableTimes.push(`${hour.toString().padStart(2, '0')}:00`);
    availableTimes.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  
  return availableTimes;
}

// Check if a date is in the past
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
}

// Check if a time is in the past for today
export function isPastTime(time: string): boolean {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  if (now.getHours() > hours) {
    return true;
  }
  
  if (now.getHours() === hours && now.getMinutes() >= minutes) {
    return true;
  }
  
  return false;
}

// Generate calendar days for a month
export function getCalendarDays(year: number, month: number): {day: number, currentMonth: boolean, disabled: boolean}[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  // Get the first day of the week (0 is Sunday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Add previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: prevMonthLastDay - i,
      currentMonth: false,
      disabled: true
    });
  }
  
  // Add current month days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      day: i,
      currentMonth: true,
      disabled: date < today
    });
  }
  
  // Add next month days
  const remainingDays = 42 - days.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      currentMonth: false,
      disabled: true
    });
  }
  
  return days;
}
