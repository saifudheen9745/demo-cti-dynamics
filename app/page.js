"use client"
import React, { useState, useEffect } from 'react';
import LoginScreen from '@/components/login/LoginScreen';
import HomeScreen from '@/components/agent/HomeScreen';
import { setMode } from '@/services/dynamicsApi';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    const loadScript = async () => {
      try {
        const script = document.createElement("script");
        script.src = "https://org43d0ff9b.crm8.dynamics.com/webresources/Widget/msdyn_ciLibrary.js";
        script.async = true;
        
        // Create a promise to handle script loading
        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        // Add script to document
        document.head.appendChild(script);
        
        // Wait for script to load
        await scriptPromise;
        console.log("window",window.Microsoft.CIFramework);
        setMode()
        setIsScriptLoaded(true);
      } catch (error) {
        console.error("Failed to load Dynamics script:", error);
        setScriptError("Failed to load required resources. Please refresh the page or try again later.");
      }
    };

    loadScript();

    // Cleanup function
    return () => {
      const script = document.querySelector('script[src*="msdyn_ciLibrary.js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleLogin = (info) => {
    setAgentInfo(info);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setAgentInfo(null);
    setIsLoggedIn(false);
  };

  if (scriptError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Application</h2>
          <p>{scriptError}</p>
        </div>
      </div>
    );
  }

  if (!isScriptLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading application resources...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <HomeScreen agentInfo={agentInfo} onLogout={handleLogout} />
      )}
    </main>
  );
}