
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProcessingLoaderProps {
  text: string;
  algorithm: string;
}

const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ text, algorithm }) => {
  return (
    <Card className="w-full animate-pulse-glow">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="h-12 w-12 rounded-full border-4 border-medical-200 border-t-medical-600 animate-spin-slow mb-4"></div>
          <p className="text-medical-800 font-medium">{text}</p>
          <p className="text-sm text-gray-500 mt-1">{algorithm}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingLoader;
