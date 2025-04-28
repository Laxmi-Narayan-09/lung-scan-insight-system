
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  onImageUpload: (file: File, imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if the file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Create image URL
    const imageUrl = URL.createObjectURL(file);
    onImageUpload(file, imageUrl);

    toast({
      title: "Image uploaded successfully",
      description: "Your lung scan has been uploaded for analysis.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-medical-800">
          <ImageIcon className="mr-2 h-5 w-5" />
          Lung Scan Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] ${
            isDragging ? 'border-medical-500 bg-medical-100' : 'border-gray-300 hover:border-medical-400 hover:bg-medical-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-10 w-10 text-medical-600 mb-4" />
          <p className="text-lg font-medium text-medical-800">
            Drag & Drop Lung CT/X-ray Image
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse files (JPEG, PNG)
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-4 flex items-start text-sm">
          <Info className="h-4 w-4 text-medical-600 mr-2 mt-0.5" />
          <p className="text-gray-600">
            Upload grayscale lung CT/X-ray images for analysis. For optimal results, ensure the scan shows lung structures clearly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
