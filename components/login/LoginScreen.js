import React from 'react';
import { AlertCircle } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [loginForm, setLoginForm] = React.useState({
    agentId: '',
    password: '',
    extension: ''
  });
  const [loginError, setLoginError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      if (!loginForm.agentId || !loginForm.extension) {
        throw new Error('Agent ID and Extension are required');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(loginForm);
      
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-[350px] min-h-[600px] max-h-[800px] h-[90vh] bg-gray-50 flex flex-col items-center justify-between overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6">
        <div className="mb-8 bg-gray-200 rounded w-32 h-12 flex items-center justify-center text-gray-500">
          AVAYA LOGO
        </div>

        {loginError && (
          <div className="mb-4 w-full max-w-sm bg-red-100 text-red-800 p-3 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <input
              type="text"
              id="agentId"
              name="agentId"
              value={loginForm.agentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm text-gray-900"
              placeholder="Agent ID (numbers only)"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={loginForm.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm text-gray-900"
              placeholder="Password (numbers only)"
            />
          </div>

          <div>
            <input
              type="text"
              id="extension"
              name="extension"
              value={loginForm.extension}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm text-gray-900"
              placeholder="Extension (numbers only)"
            />
          </div>

          <button
            type="submit"
            disabled={!loginForm.agentId || !loginForm.extension || isLoading}
            onClick={handleLogin}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white ${
              !loginForm.agentId || !loginForm.extension || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="w-full p-4 bg-white border-t">
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Avaya Contact Center</p>
          <p>Version 1.0.0</p>
          <p>© 2025 Avaya Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;