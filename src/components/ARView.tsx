
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Share2, RotateCw, CameraOff, View } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rotationRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  // Initialize camera
  const initCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setCameraPermissionGranted(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermissionGranted(false);
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera access to use AR features",
        variant: "destructive"
      });
    }
  };

  // Toggle camera on/off
  const toggleCamera = async () => {
    if (!cameraActive) {
      await initCamera();
      setCameraActive(true);
    } else {
      // Stop camera stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      setCameraActive(false);
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

  // Take a snapshot
  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current frame from video to canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Overlay items if needed
      if (clothing || hairstyle) {
        // This is where we would add AR overlay logic in a production app
        // For now, we'll just add text to indicate the presence of virtual items
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '20px Arial';
        let y = 30;
        
        if (clothing) {
          ctx.fillText(`Wearing: ${clothing.name}`, 20, y);
          y += 30;
        }
        
        if (hairstyle) {
          ctx.fillText(`Hairstyle: ${hairstyle.name}`, 20, y);
        }
      }
      
      // Create camera flash effect
      setFlashEffect(true);
      setTimeout(() => setFlashEffect(false), 300);
      
      // In a production app, we could save this image or share it
      // For now, just log it
      console.log('Snapshot taken');
      
      toast({
        title: "Snapshot Taken",
        description: "Your AR look has been captured",
      });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Stop any active media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Cancel any animation frames
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative">
      <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg text-center mb-8">
        {cameraActive ? (
          <div className="relative camera-active-container">
            <div 
              className="relative overflow-hidden rounded-lg h-[300px] w-full max-w-[400px] bg-gray-800 flex items-center justify-center"
              style={{ transform: `rotateY(${rotationAngle}deg)`, transition: !is360ViewActive ? 'transform 0.3s ease-out' : 'none' }}
            >
              {/* Real camera feed */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted 
                className="h-full w-full object-cover"
              />
              
              {/* Canvas for snapshot */}
              <canvas 
                ref={canvasRef} 
                className="hidden" // Hide canvas but keep it in the DOM for snapshot functionality
              />
              
              {/* Camera permission denied message */}
              {cameraPermissionGranted === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
                  <div className="text-center p-4">
                    <CameraOff className="h-12 w-12 mx-auto mb-2 text-red-500" />
                    <p className="text-red-400 font-medium">Camera access denied</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Please allow camera access in your browser settings to use AR features
                    </p>
                  </div>
                </div>
              )}
              
              {/* Virtual items overlaid on camera feed */}
              {(clothing || hairstyle) && cameraPermissionGranted !== false && (
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
              
              {/* Flash effect when taking snapshot */}
              {flashEffect && (
                <div className="absolute inset-0 bg-white opacity-70 camera-flash"></div>
              )}
            </div>
            
            {/* Camera controls */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-black bg-opacity-50 text-white border-gray-600 hover:bg-gray-800" 
                onClick={takeSnapshot}
                disabled={cameraPermissionGranted === false}
              >
                <Camera size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-black bg-opacity-50 text-white border-gray-600 hover:bg-gray-800" 
                onClick={toggle360View}
                disabled={cameraPermissionGranted === false}
              >
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
