import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { 
  BrutalButton, 
  BrutalCard, 
  BrutalInput, 
  BrutalLabel, 
  BrutalLogo, 
  BrutalContainer 
} from '../components/ui/brutal';
import ApiService from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Handle demo login directly
      if (formData.email === 'admin@squill.com' && formData.password === 'demo123') {
        const demoToken = 'demo_token_' + Date.now();
        localStorage.setItem('auth_token', demoToken);
        navigate('/dashboard');
        return;
      }
      
      const response = await ApiService.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError('INVALID CREDENTIALS. USE DEMO LOGIN.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <BrutalContainer>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          {/* Back Button */}
          <div className="mb-8">
            <BrutalButton 
              onClick={goBack}
              variant="secondary"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              BACK
            </BrutalButton>
          </div>

          {/* Login Card */}
          <BrutalCard color="white" className="p-8 max-w-md w-full">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary border-4 border-brutal-black mx-auto mb-4 flex items-center justify-center">
                {/* Logo placeholder - square area for your logo */}
                <span className="text-brutal-black font-brutal text-2xl">S</span>
              </div>
              <h1 className="font-brutal text-3xl text-brutal-black mb-2">
                SQUILL LOGIN
              </h1>
              <p className="font-mono-brutal text-sm text-brutal-gray">
                ACCESS YOUR BILLING DASHBOARD
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <BrutalLabel>EMAIL ADDRESS</BrutalLabel>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brutal-gray z-10" />
                  <BrutalInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ENTER YOUR EMAIL"
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <BrutalLabel>PASSWORD</BrutalLabel>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brutal-gray z-10" />
                  <BrutalInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="ENTER YOUR PASSWORD"
                    className="pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brutal-gray hover:text-primary transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <BrutalButton
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-lg"
                variant="primary"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-4 border-brutal-black border-t-transparent animate-spin mr-3"></div>
                    SIGNING IN...
                  </div>
                ) : (
                  'LOGIN'
                )}
              </BrutalButton>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-error border-4 border-brutal-black">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-brutal-white flex-shrink-0" />
                  <p className="font-mono-brutal text-sm text-brutal-white">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-primary border-4 border-brutal-black">
              <div className="text-center">
                <h3 className="font-brutal text-lg mb-4 text-brutal-black">
                  DEMO CREDENTIALS
                </h3>
                <div className="font-mono-brutal text-sm space-y-2">
                  <div className="p-2 bg-brutal-black text-brutal-white">
                    EMAIL: admin@squill.com
                  </div>
                  <div className="p-2 bg-brutal-black text-brutal-white">
                    PASSWORD: demo123
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Fill Button */}
            <div className="mt-6 text-center">
              <BrutalButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFormData({
                    email: 'admin@squill.com',
                    password: 'demo123'
                  });
                }}
              >
                QUICK FILL DEMO
              </BrutalButton>
            </div>
          </BrutalCard>

          
        </div>
      </div>
    </BrutalContainer>
  );
}