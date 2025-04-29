
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Separator } from '@/components/ui/separator';
import VirtualModel from '@/components/VirtualModel';
import ClothingOptions from '@/components/ClothingOptions';
import HairstyleOptions from '@/components/HairstyleOptions';
import ARView from '@/components/ARView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Shirt, Scissors } from 'lucide-react';

// Define types for our application
type ClothingItem = {
  id: string;
  name: string;
  imageUrl: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'accessories';
  color: string;
};

type Hairstyle = {
  id: string;
  name: string;
  imageUrl: string;
  type: 'short' | 'medium' | 'long';
  gender: 'male' | 'female' | 'unisex';
};

const Index = () => {
  const { toast } = useToast();
  
  // State for virtual model
  const [selectedAvatar, setSelectedAvatar] = useState<string>('/avatar-placeholder.jpg');
  
  // State for outfit selection
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  
  // State for AR view
  const [arModeActive, setArModeActive] = useState<boolean>(false);

  // Mock clothing data
  const clothingItems: ClothingItem[] = [
    { id: '1', name: 'White T-Shirt', imageUrl: '/t-shirt-white.jpg', category: 'tops', color: 'white' },
    { id: '2', name: 'Black Jeans', imageUrl: '/jeans-black.jpg', category: 'bottoms', color: 'black' },
    { id: '3', name: 'Blue Dress', imageUrl: '/dress-blue.jpg', category: 'dresses', color: 'blue' },
    { id: '4', name: 'Red Scarf', imageUrl: '/scarf-red.jpg', category: 'accessories', color: 'red' },
  ];

  // Mock hairstyle data
  const hairstyles: Hairstyle[] = [
    { id: '1', name: 'Short Bob', imageUrl: '/hairstyle-bob.jpg', type: 'short', gender: 'female' },
    { id: '2', name: 'Long Waves', imageUrl: '/hairstyle-waves.jpg', type: 'long', gender: 'female' },
    { id: '3', name: 'Crew Cut', imageUrl: '/hairstyle-crew.jpg', type: 'short', gender: 'male' },
    { id: '4', name: 'Medium Layered', imageUrl: '/hairstyle-layered.jpg', type: 'medium', gender: 'unisex' },
  ];

  const handleClothingSelect = (item: ClothingItem) => {
    setSelectedClothing(item);
    toast({
      title: "Clothing Selected",
      description: `You've selected the ${item.name}`,
    });
  };

  const handleHairstyleSelect = (style: Hairstyle) => {
    setSelectedHairstyle(style);
    toast({
      title: "Hairstyle Selected",
      description: `You've selected the ${style.name}`,
    });
  };

  const toggleARMode = () => {
    setArModeActive(!arModeActive);
    
    if (!arModeActive) {
      toast({
        title: "AR Mode Activated",
        description: "Point your camera at a flat surface to place the virtual model",
      });
    }
  };

  const handleTakeSnapshot = () => {
    toast({
      title: "Snapshot Taken",
      description: "Your styled look has been saved to your gallery",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Virtual Try-On Experience</h2>
          <p className="text-gray-600 mt-1">
            See how clothes and hairstyles look on you with our AR/VR technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Options */}
          <div className="space-y-6">
            <Tabs defaultValue="clothing">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="clothing">
                  <Shirt className="mr-2 h-4 w-4" />
                  Clothing
                </TabsTrigger>
                <TabsTrigger value="hairstyles">
                  <Scissors className="mr-2 h-4 w-4" />
                  Hairstyles
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="clothing" className="space-y-4">
                <ClothingOptions 
                  items={clothingItems} 
                  onSelect={handleClothingSelect}
                  selectedItem={selectedClothing}
                />
              </TabsContent>
              
              <TabsContent value="hairstyles" className="space-y-4">
                <HairstyleOptions 
                  styles={hairstyles}
                  onSelect={handleHairstyleSelect}
                  selectedStyle={selectedHairstyle}
                />
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 flex flex-col space-y-3">
              <Button 
                onClick={toggleARMode} 
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white"
                size="lg"
              >
                <Camera className="mr-2 h-4 w-4" />
                {arModeActive ? "Exit AR Mode" : "Try in AR Mode"}
              </Button>
              
              <Button 
                onClick={handleTakeSnapshot}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
                disabled={!selectedClothing && !selectedHairstyle}
              >
                Take Snapshot
              </Button>
            </div>
          </div>
          
          {/* Middle Column - Virtual Model */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
            {arModeActive ? (
              <ARView 
                clothing={selectedClothing}
                hairstyle={selectedHairstyle}
              />
            ) : (
              <VirtualModel 
                avatarUrl={selectedAvatar}
                clothing={selectedClothing}
                hairstyle={selectedHairstyle}
              />
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-white p-5 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-medium text-indigo-900 mb-3">How It Works</h3>
          <Separator className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="bg-purple-100 text-purple-800 mx-auto rounded-full h-12 w-12 flex items-center justify-center mb-3">
                <span className="font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Select Items</h4>
              <p className="text-gray-600">Choose clothes and hairstyles from our library to try on virtually</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 text-indigo-800 mx-auto rounded-full h-12 w-12 flex items-center justify-center mb-3">
                <span className="font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Preview in 3D</h4>
              <p className="text-gray-600">See a realistic 3D representation of how items look on you</p>
            </div>
            <div className="text-center">
              <div className="bg-violet-100 text-violet-800 mx-auto rounded-full h-12 w-12 flex items-center justify-center mb-3">
                <span className="font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Try in AR</h4>
              <p className="text-gray-600">Use AR mode to see yourself wearing the items in real-world</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>VirtualFit © 2025 - AR/VR Virtual Try-On Experience</p>
          <p className="text-xs mt-1 text-indigo-200">
            Powered by advanced augmented reality and 3D technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
