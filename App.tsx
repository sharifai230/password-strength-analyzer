
import React, { useState } from 'react';
import Header from './components/Header';
import PasswordStrengthMeter from './components/PasswordStrengthMeter';
import AdminDashboard from './components/AdminDashboard';
import AuditReport from './components/AuditReport';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [isLabMode, setIsLabMode] = useState<boolean>(true);

  const renderView = () => {
    switch (currentView) {
      case View.Admin:
        return <AdminDashboard isLabMode={isLabMode} />;
      case View.Report:
        return <AuditReport />;
      case View.Home:
      default:
        return <PasswordStrengthMeter isLabMode={isLabMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLabMode={isLabMode}
        setIsLabMode={setIsLabMode}
      />
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; 2024 Ethical Password Audit Platform. For educational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
