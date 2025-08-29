import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  CreditCard, 
  BarChart3,
  CheckCircle,
  Star
} from 'lucide-react';
import { 
  BrutalButton, 
  BrutalCard, 
  BrutalLogo, 
  BrutalContainer 
} from '../components/ui/brutal';

export default function Landing() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: Zap,
      title: 'LIGHTNING FAST',
      description: 'Process thousands of billing events per second with AWS serverless architecture'
    },
    {
      icon: Shield,
      title: 'BANK-GRADE SECURITY',
      description: 'Enterprise-level encryption and compliance for financial data protection'
    },
    {
      icon: TrendingUp,
      title: 'REAL-TIME ANALYTICS',
      description: 'Live dashboard with revenue tracking and customer insights'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'UPTIME' },
    { value: '<200ms', label: 'RESPONSE TIME' },
    { value: '10K+', label: 'TRANSACTIONS/SEC' },
    { value: '24/7', label: 'SUPPORT' }
  ];

  const testimonials = [
    {
      company: 'TECHCORP',
      quote: 'REDUCED BILLING OVERHEAD BY 90%',
      rating: 5
    },
    {
      company: 'FINSTART',
      quote: 'SEAMLESS INTEGRATION IN 24 HOURS',
      rating: 5
    },
    {
      company: 'CLOUDBASE',
      quote: 'BEST BILLING PLATFORM WE\'VE USED',
      rating: 5
    }
  ];

  return (
    <BrutalContainer>
      {/* Navigation */}
      <nav className="border-b-4 border-primary bg-brutal-black p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BrutalLogo size="md" />
            <span className="font-brutal text-2xl text-brutal-white">SQUILL</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-brutal-white hover:text-primary font-mono-brutal text-sm transition-colors">
              FEATURES
            </a>
            <a href="#pricing" className="text-brutal-white hover:text-primary font-mono-brutal text-sm transition-colors">
              PRICING
            </a>
            <a href="#about" className="text-brutal-white hover:text-primary font-mono-brutal text-sm transition-colors">
              ABOUT
            </a>
            <BrutalButton onClick={handleGetStarted} size="md">
              SIGN IN
            </BrutalButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <BrutalButton onClick={handleGetStarted} size="sm">
              MENU
            </BrutalButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              {/* Badge */}
              <BrutalCard color="primary" rotation={-1} className="inline-block p-4">
                <p className="font-mono-brutal text-sm">
                  🚀 SERVERLESS BILLING AUTOMATION
                </p>
              </BrutalCard>
              
              {/* Main Heading */}
              <h1 className="font-brutal text-6xl md:text-8xl text-brutal-white leading-none">
                BILLING
                <br />
                <span className="text-primary">AUTOMATION</span>
                <br />
                THAT WORKS
              </h1>
              
              {/* Description */}
              <p className="text-xl text-brutal-white font-mono-brutal leading-relaxed max-w-lg">
                ENTERPRISE-GRADE BILLING INFRASTRUCTURE FOR SAAS COMPANIES. 
                BUILT ON AWS SERVERLESS ARCHITECTURE.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <BrutalButton 
                  onClick={handleGetStarted}
                  size="xl"
                  className="brutal-hover"
                >
                  START NOW
                </BrutalButton>
                
                <BrutalButton 
                  onClick={handleGetStarted}
                  variant="secondary"
                  size="lg"
                  className="brutal-hover"
                >
                  VIEW DEMO
                </BrutalButton>
              </div>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <BrutalCard 
                  key={stat.label}
                  color={index % 2 === 0 ? 'primary' : 'white'}
                  rotation={index % 2 === 0 ? 2 : -2}
                  className="p-6 text-center"
                >
                  <div className="font-brutal text-3xl mb-2">
                    {stat.value}
                  </div>
                  <div className="font-mono-brutal text-sm opacity-80">
                    {stat.label}
                  </div>
                </BrutalCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-brutal text-5xl text-brutal-white mb-6">
              WHY CHOOSE SQUILL?
            </h2>
            <p className="font-mono-brutal text-xl text-brutal-white max-w-2xl mx-auto">
              BUILT FOR SCALE, DESIGNED FOR DEVELOPERS, TRUSTED BY ENTERPRISES
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <BrutalCard 
                key={feature.title}
                color="white"
                rotation={index % 2 === 0 ? 1 : -1}
                className="p-8 text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary border-4 border-brutal-black mx-auto flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-brutal-black" />
                  </div>
                </div>
                <h3 className="font-brutal text-xl mb-4">
                  {feature.title}
                </h3>
                <p className="font-mono-brutal text-sm text-brutal-gray">
                  {feature.description}
                </p>
              </BrutalCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 border-t-4 border-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-brutal text-5xl text-brutal-white mb-6">
              TRUSTED BY LEADERS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <BrutalCard 
                key={testimonial.company}
                color="black"
                rotation={index % 2 === 0 ? -1 : 1}
                className="p-8"
              >
                <div className="mb-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="font-mono-brutal text-sm mb-4 text-brutal-white">
                  "{testimonial.quote}"
                </blockquote>
                <div className="font-brutal text-primary">
                  {testimonial.company}
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t-4 border-primary">
        <div className="max-w-4xl mx-auto text-center">
          <BrutalCard color="primary" className="p-12 brutal-rotate-neg-1">
            <h2 className="font-brutal text-4xl md:text-6xl mb-6">
              READY TO AUTOMATE YOUR BILLING?
            </h2>
            <p className="font-mono-brutal text-lg mb-8 max-w-2xl mx-auto">
              JOIN HUNDREDS OF COMPANIES ALREADY USING SQUILL FOR THEIR BILLING INFRASTRUCTURE
            </p>
            <BrutalButton 
              onClick={handleGetStarted}
              variant="black"
              size="xl"
              className="brutal-hover"
            >
              GET STARTED NOW
            </BrutalButton>
          </BrutalCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-primary bg-brutal-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <BrutalLogo size="sm" />
              <span className="font-brutal text-xl text-brutal-white">SQUILL</span>
            </div>
            <div className="font-mono-brutal text-sm text-brutal-white">
              © 2024 SQUILL. BUILT WITH AWS SERVERLESS.
            </div>
          </div>
        </div>
      </footer>
    </BrutalContainer>
  );
}