
import React, { useState, useRef } from 'react';
import { Camera, Share2, RotateCw, CameraOff, View } from 'lucide-react';
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
  const [cameraActive, setCameraActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [is360ViewActive, setIs360ViewActive] = useState(false);
  const rotationRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  // Toggle camera on/off
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
    if (is360ViewActive) {
      stopRotation();
    }
  };

  // Start 360 rotation
  const start360Rotation = () => {
    if (animationRef.current !== null) return;
    
    setIs360ViewActive(true);
    
    const animate = () => {
      rotationRef.current = (rotationRef.current + 1) % 360;
      setRotationAngle(rotationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Stop rotation
  const stopRotation = () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      setIs360ViewActive(false);
    }
  };

  // Toggle 360 rotation
  const toggle360View = () => {
    if (is360ViewActive) {
      stopRotation();
    } else {
      start360Rotation();
    }
  };

  // Take a snapshot (in a real app, this would save the current view)
  const takeSnapshot = () => {
    console.log('Snapshot taken');
    // In a real app, this would capture the current frame
  };

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative">
      <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg text-center mb-8">
        {cameraActive ? (
          <div className="relative">
            <div 
              className="relative overflow-hidden rounded-lg h-[300px] w-full max-w-[400px] bg-gray-800 flex items-center justify-center"
              style={{ transform: `rotateY(${rotationAngle}deg)`, transition: !is360ViewActive ? 'transform 0.3s ease-out' : 'none' }}
            >
              {/* This would be a real camera feed in a production app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Camera Feed Simulation</p>
              </div>
              
              {/* Virtual items overlaid on camera feed */}
              {(clothing || hairstyle) && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {clothing && (
                    <div className="absolute" style={{ opacity: 0.8 }}>
                      <div className="w-32 h-48 rounded" style={{ backgroundColor: clothing.color }}></div>
                      <p className="text-center text-white text-xs mt-1">{clothing.name}</p>
                    </div>
                  )}
                  {hairstyle && (
                    <div className="absolute top-0" style={{ opacity: 0.8 }}>
                      <div className="w-24 h-12 rounded-full bg-gray-300"></div>
                      <p className="text-center text-white text-xs mt-1">{hairstyle.name}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Camera controls */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button variant="outline" size="icon" className="bg-black bg-opacity-50 text-white border-gray-600 hover:bg-gray-800" onClick={takeSnapshot}>
                <Camera size={16} />
              </Button>
              <Button variant="outline" size="icon" className="bg-black bg-opacity-50 text-white border-gray-600 hover:bg-gray-800" onClick={toggle360View}>
                <RotateCw size={16} className={is360ViewActive ? "animate-spin" : ""} />
              </Button>
              <Button variant="outline" size="icon" className="bg-black bg-opacity-50 text-white border-gray-600 hover:bg-gray-800" onClick={toggleCamera}>
                <CameraOff size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Camera className="h-10 w-10 mx-auto mb-2" />
            <h3 className="text-lg font-medium">AR Mode</h3>
            <p className="text-sm opacity-80 mt-1">
              Click the button below to activate the camera and see items in AR
            </p>
            <Button 
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
              onClick={toggleCamera}
            >
              Start Camera
            </Button>
          </>
        )}
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
    </div>
  );
};

export default ARView;
