
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scissors } from 'lucide-react';

interface Hairstyle {
  id: string;
  name: string;
  imageUrl: string;
  type: 'short' | 'medium' | 'long';
  gender: 'male' | 'female' | 'unisex';
}

interface HairstyleOptionsProps {
  styles: Hairstyle[];
  onSelect: (style: Hairstyle) => void;
  selectedStyle: Hairstyle | null;
}

const HairstyleOptions: React.FC<HairstyleOptionsProps> = ({ styles, onSelect, selectedStyle }) => {
  const types = ['short', 'medium', 'long'] as const;
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-3">Select Hairstyle</h3>
        
        <Tabs defaultValue="short">
          <TabsList className="grid grid-cols-3 mb-4">
            {types.map(type => (
              <TabsTrigger key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {types.map(type => (
            <TabsContent key={type} value={type}>
              <ScrollArea className="h-64">
                <RadioGroup value={selectedStyle?.id} onValueChange={(value) => {
                  const style = styles.find(s => s.id === value);
                  if (style) onSelect(style);
                }}>
                  {styles
                    .filter(style => style.type === type)
                    .map(style => (
                      <div key={style.id} className="flex items-center space-x-2 mb-4 p-2 border border-gray-200 rounded hover:bg-gray-50">
                        <RadioGroupItem value={style.id} id={`style-${style.id}`} />
                        <Label htmlFor={`style-${style.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              {/* Would be an actual image in production */}
                              <Scissors size={24} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium">{style.name}</p>
                              <p className="text-xs text-gray-500">{style.gender} style</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
                
                {styles.filter(style => style.type === type).length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No styles in this category
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

export default HairstyleOptions;
