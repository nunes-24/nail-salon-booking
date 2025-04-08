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
    
    // Automatically continue to the next step when a service is selected
    setTimeout(() => {
      onContinue();
    }, 300);
  };
  
  const handleBack = () => {
    setShowSubcategories(false);
    setSelectedService(null);
  };
  
  const categories = categoriesQuery.data as ServiceCategory[] || [];
  const services = servicesQuery.data as Service[] || [];
  
  // Create mock services array with 10 items if needed
  const displayServices = services.length > 0 
    ? services 
    : Array(10).fill(0).map((_, i) => ({
        id: i,
        categoryId: selectedCategory?.id || 0,
        name: `Serviço ${i+1}`,
        price: 25 + i * 5,
        duration: 30 + i * 10,
        image: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?q=80'
      } as Service));
  
  return (
    <div>
      <h2 className="text-xl text-[#7D4F50] mb-6 text-center font-semibold">Step 1: Escolha o serviço</h2>
      
      {!showSubcategories && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {categoriesQuery.isLoading ? (
            <>
              <div className="aspect-square bg-[#E8D4C4]/20 rounded-xl animate-pulse" />
              <div className="aspect-square bg-[#E8D4C4]/20 rounded-xl animate-pulse" />
            </>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div 
                key={category.id} 
                className="service-box rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] aspect-square relative"
                onClick={() => handleCategorySelect(category)}
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-xl text-white">{category.name}</h3>
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
          {/* Only the services category title shown at the top, no back button */}
          <div className="text-center mb-4">
            <h3 className="text-[#7D4F50] font-medium">
              {selectedCategory?.name}
            </h3>
          </div>
          
          {/* Services grid - 2 items per row, 5 rows = 10 items */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {servicesQuery.isLoading ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="bg-[#E8D4C4]/20 rounded-lg animate-pulse aspect-square" />
              ))
            ) : (
              displayServices.slice(0, 10).map((service) => (
                <div 
                  key={service.id} 
                  className={`service-item bg-white rounded-xl shadow-md border cursor-pointer transition-transform hover:scale-[1.02] aspect-square relative ${selectedService?.id === service.id ? 'border-[#7D4F50] ring-1 ring-[#7D4F50]' : 'border-[#E8D4C4]'}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <h4 className="text-[#7D4F50] font-medium">{service.name}</h4>
                    <div className="w-full text-sm mt-2 px-4 text-center text-[#333333]/70">
                      <span>{service.price}€</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Previous button at the bottom of subcategories */}
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleBack}
              variant="outline" 
              className="border-[#D7B29D] text-[#7D4F50] hover:bg-[#D7B29D]/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Anterior
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
