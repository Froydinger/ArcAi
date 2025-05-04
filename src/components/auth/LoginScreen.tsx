import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

// Removed onLogin and onSignup props as they are not needed
export const LoginScreen: React.FC = () => {
  const { login } = useAuth(); // Get login function from useAuth

  const handleLogin = () => {
    login(); // Call the login function which opens the Netlify modal
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[rgb(var(--background-start-rgb))] to-[rgb(var(--background-end-rgb))] flex flex-col items-center justify-center p-4 z-50 text-center">
      <img
        src="https://froydingermediagroup.wordpress.com/wp-content/uploads/2025/04/chatgpt-image-apr-22-2025-10_50_06-pm-e1745380747320.png"
        alt="ArcAi Logo"
        className="logo-image w-32 h-32 mb-0"
      />
      <h1 className="text-4xl font-bold text-white mt-4 mb-2">Welcome to ArcAi</h1>
      <p className="text-lg text-gray-300 mb-8">Your AI Mental Wellness Companion</p>

      <Button
        onClick={handleLogin} // Use handleLogin which calls useAuth's login
        className="bg-[rgb(var(--theme-accent))] hover:bg-[rgb(var(--theme-accent-hover))] text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md flex items-center justify-center space-x-2"
      >
        <span>Continue with Google</span>
      </Button>

      <p className="text-xs text-gray-500 mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};
