
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { mockApi } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { LogoIcon } from '../components/icons';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setToken = useAuthStore(state => state.setToken);
  const checkAuth = useAuthStore(state => state.checkAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { token } = await mockApi.login(email, password);
        setToken(token);
      } else {
        const { token } = await mockApi.register(email, password);
        setToken(token);
      }
      await checkAuth();
      navigate('/discover');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-purple-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <LogoIcon className="w-16 h-16 mx-auto text-primary" />
          <h1 className="mt-4 text-4xl font-heading font-bold text-primary">LoveLink</h1>
          <p className="mt-2 text-text-secondary">Find your meaningful connection.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
             <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-4"
            />
            {!isLogin && (
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-4"
              />
            )}
          </div>

          <div>
            <Button type="submit" isLoading={loading} className="w-full">
              {isLogin ? 'Sign in' : 'Create Account'}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-primary hover:text-red-500 ml-1">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
