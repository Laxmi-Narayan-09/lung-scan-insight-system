
import React from 'react';
import { Lungs } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-medical-800 text-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Lungs className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Lung Scan Insight System</h1>
        </div>
        <div className="text-sm font-medium">
          Advanced Cancer Detection Platform
        </div>
      </div>
    </header>
  );
};

export default Header;
