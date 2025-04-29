
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClothingItem {
  id: string;
  name: string;
  imageUrl: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'accessories';
  color: string;
}

interface ClothingOptionsProps {
  items: ClothingItem[];
  onSelect: (item: ClothingItem) => void;
  selectedItem: ClothingItem | null;
}

const ClothingOptions: React.FC<ClothingOptionsProps> = ({ items, onSelect, selectedItem }) => {
  const categories = ['tops', 'bottoms', 'dresses', 'accessories'] as const;
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Select Clothing</h3>
        
        <Tabs defaultValue="tops">
          <TabsList className="grid grid-cols-4 mb-4">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-64">
                <RadioGroup value={selectedItem?.id} onValueChange={(value) => {
                  const item = items.find(i => i.id === value);
                  if (item) onSelect(item);
                }}>
                  {items
                    .filter(item => item.category === category)
                    .map(item => (
                      <div key={item.id} className="flex items-center space-x-2 mb-4 p-2 border border-gray-200 rounded hover:bg-gray-50">
                        <RadioGroupItem value={item.id} id={`item-${item.id}`} />
                        <Label htmlFor={`item-${item.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              {/* Would be an actual image in production */}
                              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.color }}></div>
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
                
                {items.filter(item => item.category === category).length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No items in this category
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClothingOptions;
