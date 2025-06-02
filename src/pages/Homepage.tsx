
import backgroundImage from "../assets/background.png";
import Navbar from "../components/Navbar";

const Homepage = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-no-repeat sm:bg-cover md:bg-cover lg:bg-cover xl:bg-cover 2xl:bg-cover bg-fixed sm:bg-scroll md:bg-fixed lg:bg-fixed xl:bg-fixed 2xl:bg-fixed md:bg-center lg:bg-center xl:bg-center 2xl:bg-center [background-position:90%_center]" 
      style={{ 
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center py-20 lg:py-32 xl:py-40 2xl:py-48">
          {/* Hero Badge */}
          {/* <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-8 animate-fade-in">
            <span className="mr-2">🎉</span>
            Welcome to the future of egg management
          </div> */}

          {/* Hero Title */}
          <h1 className="text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-gray-900 mb-6 lg:mb-8 xl:mb-10 leading-tight">
            
            <div className="border-4 border-white rounded-lg px-6 py-4 bg-white/90 inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent leading-normal">
                EggHub
              </span>
              <span className="block leading-normal">
                Tools
              </span>
            </div>
            
          </h1>

          {/* Hero Subtitle */}
          {/* <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 mb-10 lg:mb-12 xl:mb-16 max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto leading-relaxed">
            Discover, manage, and optimize your egg collection like never before. 
            Join thousands of egg enthusiasts who trust EggHub for their daily needs.
          </p> */}

          {/* Hero CTA
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 xl:gap-8 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-3 lg:px-10 lg:py-4 xl:px-12 xl:py-5 text-lg lg:text-xl xl:text-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3 lg:px-10 lg:py-4 xl:px-12 xl:py-5 text-lg lg:text-xl xl:text-2xl font-semibold"
            >
              Watch Demo
            </Button>
          </div> */}

          
        </div>
      </main>
    </div>
  );
};

export default Homepage; 