import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

type AppointmentWithDetails = {
  id: number;
  clientId: number;
  serviceId: number;
  date: string;
  status: string;
  client: {
    name: string;
  };
  service: {
    name: string;
    price: number;
  };
};

const COLORS = ['#7D4F50', '#D7B29D', '#E8D4C4', '#8B5D5E', '#9E6A6B'];

const Billing = () => {
  const { toast } = useToast();
  
  // Fetch appointments with details
  const appointmentsQuery = useQuery({
    queryKey: ['/api/appointments-with-details'],
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to load appointments: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  });
  
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  
  useEffect(() => {
    if (appointmentsQuery.data) {
      const confirmedAppointments = (appointmentsQuery.data as AppointmentWithDetails[])
        .filter(appointment => appointment.status === 'confirmed');
      
      // Calculate revenues
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Daily Revenue
      const dailyAppointments = confirmedAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime();
      });
      
      const dailyTotal = dailyAppointments.reduce((sum, appointment) => 
        sum + appointment.service.price, 0);
      setDailyRevenue(dailyTotal);
      
      // Weekly Revenue
      const weeklyAppointments = confirmedAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= weekStart && appointmentDate <= today;
      });
      
      const weeklyTotal = weeklyAppointments.reduce((sum, appointment) => 
        sum + appointment.service.price, 0);
      setWeeklyRevenue(weeklyTotal);
      
      // Monthly Revenue
      const monthlyAppointments = confirmedAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= monthStart && appointmentDate <= today;
      });
      
      const monthlyTotal = monthlyAppointments.reduce((sum, appointment) => 
        sum + appointment.service.price, 0);
      setMonthlyRevenue(monthlyTotal);
      
      // Process daily data for chart
      const dailyChartData: Record<string, number> = {};
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayStr = date.toLocaleDateString('pt-PT', { weekday: 'short' }).charAt(0).toUpperCase() +
                      date.toLocaleDateString('pt-PT', { weekday: 'short' }).slice(1, 3);
        
        dailyChartData[dayStr] = 0;
      }
      
      confirmedAppointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        appointmentDate.setHours(0, 0, 0, 0);
        
        const dayDiff = Math.round((today.getTime() - appointmentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff >= 0 && dayDiff <= 6) {
          const dayStr = appointmentDate.toLocaleDateString('pt-PT', { weekday: 'short' }).charAt(0).toUpperCase() +
                        appointmentDate.toLocaleDateString('pt-PT', { weekday: 'short' }).slice(1, 3);
          
          dailyChartData[dayStr] = (dailyChartData[dayStr] || 0) + appointment.service.price;
        }
      });
      
      const formattedDailyData = Object.entries(dailyChartData).map(([name, value]) => ({ name, value }));
      setDailyData(formattedDailyData);
      
      // Process weekly data for chart
      const currentWeek = Math.floor(today.getTime() / (7 * 24 * 60 * 60 * 1000));
      const weeklyChartData: Record<string, number> = {};
      
      for (let i = 3; i >= 0; i--) {
        const weekNumber = currentWeek - i;
        weeklyChartData[`Semana ${i > 0 ? '-' + i : 'atual'}`] = 0;
      }
      
      confirmedAppointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        const appointmentWeek = Math.floor(appointmentDate.getTime() / (7 * 24 * 60 * 60 * 1000));
        const weekDiff = currentWeek - appointmentWeek;
        
        if (weekDiff >= 0 && weekDiff <= 3) {
          const weekKey = `Semana ${weekDiff > 0 ? '-' + weekDiff : 'atual'}`;
          weeklyChartData[weekKey] = (weeklyChartData[weekKey] || 0) + appointment.service.price;
        }
      });
      
      const formattedWeeklyData = Object.entries(weeklyChartData).map(([name, value]) => ({ name, value }));
      setWeeklyData(formattedWeeklyData);
      
      // Process monthly data for chart
      const monthlyChartData: Record<string, number> = {};
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      for (let i = 5; i >= 0; i--) {
        let month = currentMonth - i;
        let year = currentYear;
        
        if (month < 0) {
          month += 12;
          year -= 1;
        }
        
        const monthName = new Date(year, month, 1).toLocaleDateString('pt-PT', { month: 'short' }).charAt(0).toUpperCase() +
                          new Date(year, month, 1).toLocaleDateString('pt-PT', { month: 'short' }).slice(1);
        
        monthlyChartData[monthName] = 0;
      }
      
      confirmedAppointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date);
        const appointmentMonth = appointmentDate.getMonth();
        const appointmentYear = appointmentDate.getFullYear();
        
        let monthDiff = (currentYear - appointmentYear) * 12 + (currentMonth - appointmentMonth);
        
        if (monthDiff >= 0 && monthDiff <= 5) {
          let month = currentMonth - monthDiff;
          let year = currentYear;
          
          if (month < 0) {
            month += 12;
            year -= 1;
          }
          
          const monthName = new Date(year, month, 1).toLocaleDateString('pt-PT', { month: 'short' }).charAt(0).toUpperCase() +
                            new Date(year, month, 1).toLocaleDateString('pt-PT', { month: 'short' }).slice(1);
          
          monthlyChartData[monthName] = (monthlyChartData[monthName] || 0) + appointment.service.price;
        }
      });
      
      const formattedMonthlyData = Object.entries(monthlyChartData).map(([name, value]) => ({ name, value }));
      setMonthlyData(formattedMonthlyData);
      
      // Process service data for pie chart
      const serviceRevenueMap: Record<string, number> = {};
      
      confirmedAppointments.forEach(appointment => {
        const serviceName = appointment.service.name;
        serviceRevenueMap[serviceName] = (serviceRevenueMap[serviceName] || 0) + appointment.service.price;
      });
      
      const formattedServiceData = Object.entries(serviceRevenueMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
        
      setServiceData(formattedServiceData);
    }
  }, [appointmentsQuery.data]);
  
  // Custom tooltip for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
          <p className="font-medium">{label}</p>
          <p className="text-[#7D4F50]">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dailyRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(weeklyRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <Tabs defaultValue="daily">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-medium">Relatório de Faturamento</h3>
              <TabsList>
                <TabsTrigger value="daily">Diário</TabsTrigger>
                <TabsTrigger value="weekly">Semanal</TabsTrigger>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="daily" className="p-6 pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}€`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Valor" fill="#7D4F50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="p-6 pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}€`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Valor" fill="#7D4F50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="p-6 pt-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}€`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Valor" fill="#7D4F50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Serviços mais Populares</CardTitle>
            <CardDescription>Distribuição de receita por serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Melhores Dias</CardTitle>
            <CardDescription>Dias da semana com maior faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData.sort((a, b) => b.value - a.value)}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}€`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Valor" fill="#D7B29D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
