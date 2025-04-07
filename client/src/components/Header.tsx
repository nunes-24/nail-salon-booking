import { useLocation } from 'wouter';

const Header = () => {
  const [, setLocation] = useLocation();

  const handleProfileClick = () => {
    setLocation('/login');
  };

  return (
    <header className="bg-[#F9F5F1] py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-serif text-[#7D4F50] font-bold">NailArtistry</div>
      <button 
        onClick={handleProfileClick}
        className="p-2 rounded-full hover:bg-[#E8D4C4]/30 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#7D4F50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
