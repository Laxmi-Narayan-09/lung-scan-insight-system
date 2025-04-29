
import React from 'react';
import { Camera, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ARViewProps {
  clothing: {
    id: string;
    name: string;
    imageUrl: string;
    category: string;
    color: string;
  } | null;
  hairstyle: {
    id: string;
    name: string;
    imageUrl: string;
    type: string;
    gender: string;
  } | null;
}

const ARView: React.FC<ARViewProps> = ({ clothing, hairstyle }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative">
      <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg text-center mb-8">
        <Camera className="h-10 w-10 mx-auto mb-2" />
        <h3 className="text-lg font-medium">AR Mode</h3>
        <p className="text-sm opacity-80 mt-1">
          In a real app, this would access your camera to show clothes and hairstyles on you in real-time
        </p>
      </div>
      
      {/* Overlay information */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Virtual Try-On</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white">
              <Share2 size={16} />
            </Button>
          </div>
          
          <div className="space-y-1">
            {clothing && (
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: clothing.color }}></span>
                <span>{clothing.name}</span>
              </div>
            )}
            
            {hairstyle && (
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                <span>{hairstyle.name}</span>
              </div>
            )}
            
            {!clothing && !hairstyle && (
              <div className="text-gray-300 italic">No items selected</div>
            )}
          </div>
        </div>
      </div>
      
      {/* AR controls would be here in a real implementation */}
    </div>
  );
};

export default ARView;
