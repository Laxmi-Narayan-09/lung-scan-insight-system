
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface VirtualModelProps {
  avatarUrl: string;
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

const VirtualModel: React.FC<VirtualModelProps> = ({ avatarUrl, clothing, hairstyle }) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        {/* This would be a 3D model in a production app */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 flex flex-col items-center">
            <User size={120} />
            <p className="mt-4 text-lg font-medium">3D Model Placeholder</p>
            <p className="text-sm">(Would be an actual 3D model in production)</p>
          </div>
        </div>
        
        {/* Overlay selected items */}
        {(clothing || hairstyle) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4">
            <h3 className="text-lg font-medium mb-2">Currently Wearing:</h3>
            <ul className="space-y-1 text-sm">
              {clothing && (
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: clothing.color }}></span>
                  {clothing.name} ({clothing.category})
                </li>
              )}
              {hairstyle && (
                <li>
                  {hairstyle.name} ({hairstyle.type} style)
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-4 w-full max-w-md">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Clothing Selection</h3>
                <p className="text-xs text-gray-500">
                  {clothing ? clothing.name : "No clothing selected"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Hairstyle Selection</h3>
                <p className="text-xs text-gray-500">
                  {hairstyle ? hairstyle.name : "No hairstyle selected"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VirtualModel;
