import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

  return (
    <nav className="bg-white backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center h-16 lg:h-20 xl:h-24">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent leading-normal py-1">
              🥚 EggHub
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 lg:space-x-12 xl:space-x-16">
              {/* Features Dropdown */}
              <div className="relative group">
                <a href="#" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm lg:text-base xl:text-lg font-medium transition-colors flex items-center">
                  Features
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-orange-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <a href="/probability" className="block px-4 py-2 text-sm lg:text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Probability
                    </a>
                    <a href="/corkboard" className="block px-4 py-2 text-sm lg:text-base text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      Corkboard
                    </a>
                  </div>
                </div>
              </div>
              <a href="#" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm lg:text-base xl:text-lg font-medium transition-colors">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 px-3 py-2 text-sm lg:text-base xl:text-lg font-medium transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-sm rounded-lg mt-2 border border-orange-100">
              {/* Mobile Features with submenu */}
              <div>
                <button 
                  onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                  className="w-full text-left text-gray-700 hover:text-orange-600 block px-3 py-2 text-base font-medium items-center justify-between"
                >
                  Features
                  <svg className={`h-4 w-4 transform transition-transform ${isFeaturesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isFeaturesOpen && (
                  <div className="ml-4 space-y-1">
                    <a href="/probability" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600">
                      Probability
                    </a>
                    <a href="/corkboard" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600">
                      Corkboard
                    </a>
                  </div>
                )}
              </div>
              <a href="#" className="text-gray-700 hover:text-orange-600 block px-3 py-2 text-base font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 block px-3 py-2 text-base font-medium">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 