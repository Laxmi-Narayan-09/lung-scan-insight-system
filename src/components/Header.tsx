
import React from 'react';
import { Shirt } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shirt className="h-8 w-8" />
          <h1 className="text-2xl font-bold">VirtualFit</h1>
        </div>
        <div className="text-sm font-medium">
          AR/VR Virtual Try-On Experience
        </div>
      </div>
    </header>
  );
};

export default Header;
