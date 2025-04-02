import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, UserPlus,ChevronRight} from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'manager' as 'manager' | 'deliverer' | 'user'
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password });
      } else {
        await register({ username: formData.username, password: formData.password, role: formData.role });
      }
    } catch (err) {
      setError(isLogin ? 'Invalid credentials' : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#BDDDFC]">
      <div className="w-full max-w-md px-8 py-12 bg-white rounded-2xl shadow-xl">
        <div className="relative">
          {/* Background decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#88BDF2] rounded-full opacity-20" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#6A89A7] rounded-full opacity-10" />
          
          {/* Main content */}
          <div className="relative">
            <div className="flex justify-center">
              <div className="p-4 bg-[#384959] bg-opacity-5 rounded-2xl">
                {isLogin ? (
                  <LogIn className="h-8 w-8 text-[#384959]" />
                ) : (
                  <UserPlus className="h-8 w-8 text-[#384959]" />
                )}
              </div>
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-bold text-[#384959]">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-center text-sm text-[#6A89A7]">
              {isLogin ? 'Sign in to continue' : 'Join us today'}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[#384959] mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#88BDF2] focus:border-[#6A89A7] focus:ring focus:ring-[#6A89A7] focus:ring-opacity-50 transition-all duration-200 bg-white"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#384959] mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#88BDF2] focus:border-[#6A89A7] focus:ring focus:ring-[#6A89A7] focus:ring-opacity-50 transition-all duration-200 bg-white"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-[#384959] mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#88BDF2] focus:border-[#6A89A7] focus:ring focus:ring-[#6A89A7] focus:ring-opacity-50 transition-all duration-200 bg-white"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'manager' | 'deliverer' | 'user' })}
                    >
                      <option value="manager">Manager</option>
                      <option value="deliverer">Deliverer</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                )}
              </div>

              {error && (
                <div className="py-2 px-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 text-white bg-[#384959] rounded-xl hover:bg-[#6A89A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A89A7] transition-all duration-200 group"
              >
                <span className="mr-2">{isLogin ? 'Sign in' : 'Create Account'}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-[#6A89A7] hover:text-[#384959] transition-colors duration-200"
                >
                  {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}