import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (formData.email && formData.password) {
        onLogin(formData.email);
      } else {
        alert('PLEASE ENTER CREDENTIALS');
      }
    }, 1200);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 grid-pattern">
      <div className="w-full max-w-md">
        <div className="block-card p-8 block-fade">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary border-3 border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-block">
              <span className="text-white font-mono font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-mono font-bold text-gray-900 uppercase tracking-wider">WELCOME BACK</h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-2 font-bold">SIGN IN TO YOUR SQUILL ACCOUNT</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail size={16} className="input-icon" strokeWidth={2} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ENTER YOUR EMAIL"
                  className="input-block input-with-icon w-full pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider">PASSWORD</label>
              <div className="relative">
                <Lock size={16} className="input-icon" strokeWidth={2} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="ENTER YOUR PASSWORD"
                  className="input-block input-with-icon w-full pr-12 py-3 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-3 border-gray-300 focus:ring-primary"
                />
                <span className="ml-2 text-xs font-mono text-gray-600 uppercase tracking-wider font-bold">REMEMBER ME</span>
              </label>
              <a href="#" className="text-xs font-mono text-primary hover:text-gray-900 transition-colors uppercase tracking-wider font-bold">
                FORGOT PASSWORD?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-block w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent loading-block mr-2"></div>
                  SIGNING IN...
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-100 border-3 border-gray-200">
            <p className="text-xs font-mono text-gray-600 text-center mb-2 uppercase tracking-wider font-bold">DEMO CREDENTIALS:</p>
            <div className="text-xs font-mono text-gray-500 space-y-1 text-center uppercase font-bold">
              <div>EMAIL: ADMIN@SQUILL.COM</div>
              <div>PASSWORD: DEMO123</div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-xs font-mono text-gray-600 uppercase tracking-wider font-bold">DON'T HAVE AN ACCOUNT? </span>
            <a href="#" className="text-xs font-mono text-primary hover:text-gray-900 font-bold transition-colors uppercase tracking-wider">
              SIGN UP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}