
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isLabMode: boolean;
  setIsLabMode: (isLabMode: boolean) => void;
}

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {label}
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, isLabMode, setIsLabMode }) => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-xl font-bold text-white">Password Audit Platform</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink label="Strength Test" isActive={currentView === View.Home} onClick={() => setCurrentView(View.Home)} />
            <NavLink label="Admin Dashboard" isActive={currentView === View.Admin} onClick={() => setCurrentView(View.Admin)} />
            <NavLink label="Audit Report" isActive={currentView === View.Report} onClick={() => setCurrentView(View.Report)} />
            <div className="flex items-center space-x-2 pl-4" title="Lab mode ensures only synthetic/consented data is used.">
              <span className={`text-sm font-medium ${isLabMode ? 'text-green-400' : 'text-yellow-400'}`}>Lab Mode</span>
              <button
                onClick={() => setIsLabMode(!isLabMode)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
                  isLabMode ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                    isLabMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
