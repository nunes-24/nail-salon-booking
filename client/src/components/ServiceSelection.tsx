import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Service, ServiceCategory } from '@shared/schema';

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
  onContinue: () => void;
}

const ServiceSelection = ({ onServiceSelect, onContinue }: ServiceSelectionProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  
  // Fetch service categories
  const categoriesQuery = useQuery({ queryKey: ['/api/service-categories'] });
  
  // Fetch services by category
  const servicesQuery = useQuery({
    queryKey: ['/api/services/category', selectedCategory?.id],
    enabled: !!selectedCategory
  });
  
  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setShowSubcategories(true);
  };
  
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    onServiceSelect(service);
  };
  
  const handleContinue = () => {
    if (!selectedService) {
      toast({
        variant: 'destructive',
        title: 'Serviço não selecionado',
        description: 'Por favor, selecione um serviço para continuar.',
      });
      return;
    }
    
    onContinue();
  };
  
  const categories = categoriesQuery.data as ServiceCategory[] || [];
  const services = servicesQuery.data as Service[] || [];
  
  return (
    <div>
      <h2 className="font-serif text-2xl text-[#7D4F50] mb-6 text-center">Escolha o Serviço</h2>
      
      {!showSubcategories && (
        <div className="grid grid-cols-2 gap-3 mb-10">
          {categoriesQuery.isLoading ? (
            <>
              <div className="aspect-square bg-[#E8D4C4]/20 rounded-xl animate-pulse" />
              <div className="aspect-square bg-[#E8D4C4]/20 rounded-xl animate-pulse" />
            </>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div 
                key={category.id} 
                className="service-box rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.03] aspect-square relative"
                onClick={() => handleCategorySelect(category)}
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="font-medium text-xl text-white">{category.name}</h3>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-[#333333]/70">No service categories available.</p>
          )}
        </div>
      )}
      
      {showSubcategories && (
        <div id="subcategoriesSection">
          <h3 className="font-serif text-xl text-[#7D4F50] mb-6 text-center">
            Selecione a Opção de {selectedCategory?.name}
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {servicesQuery.isLoading ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-[#E8D4C4]/20 rounded-lg animate-pulse" />
              ))
            ) : services.length > 0 ? (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className={`service-box bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-[1.03] ${selectedService?.id === service.id ? 'ring-2 ring-[#7D4F50]' : ''}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 text-center bg-[#E8D4C4]">
                      <h4 className="font-medium text-[#7D4F50] text-sm">{service.name}</h4>
                      <p className="text-xs mt-1">{service.price}€ • {service.duration} min</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-[#333333]/70">No services available for this category.</p>
            )}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleContinue}
              className="bg-[#7D4F50] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#7D4F50]/90 transition shadow-md"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
