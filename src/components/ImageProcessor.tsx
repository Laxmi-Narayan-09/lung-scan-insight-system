
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine, Braces } from 'lucide-react';

interface ImageProcessorProps {
  originalImage: string | null;
  processedImage: string | null;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ originalImage, processedImage }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-medical-800">
          <ScanLine className="mr-2 h-5 w-5" />
          Image Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-medical-700 mb-2 flex items-center">
              <span>Original Scan</span>
            </div>
            <div className="bg-gray-100 rounded-md overflow-hidden aspect-square flex items-center justify-center">
              {originalImage ? (
                <img 
                  src={originalImage} 
                  alt="Original lung scan" 
                  className="object-contain max-h-full max-w-full" 
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <Braces className="h-10 w-10 mb-2" />
                  <span>No image uploaded</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-medical-700 mb-2 flex items-center">
              <span>Processed Scan</span>
              {processedImage && (
                <span className="text-xs bg-medical-100 text-medical-800 px-2 py-0.5 rounded ml-2">
                  K-means Segmentation
                </span>
              )}
            </div>
            <div className="bg-gray-100 rounded-md overflow-hidden aspect-square flex items-center justify-center relative">
              {processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Processed lung scan with highlighted regions" 
                  className="object-contain max-h-full max-w-full" 
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <Braces className="h-10 w-10 mb-2" />
                  <span>Processing required</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageProcessor;
