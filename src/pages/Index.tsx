
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import ClinicalDataForm from '@/components/ClinicalDataForm';
import ImageProcessor from '@/components/ImageProcessor';
import PredictionResults from '@/components/PredictionResults';
import ProcessingLoader from '@/components/ProcessingLoader';
import { BrainCircuit, Microscope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { ClinicalData } from '@/components/ClinicalDataForm';
import { 
  processImage, 
  predictFromClinicalData,
  predictFromImage,
  combineModelPredictions,
  generateReport
} from '@/utils/mockProcessing';

const Index = () => {
  const { toast } = useToast();
  
  // State for image processing
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  // State for clinical data
  const [clinicalData, setClinicalData] = useState<ClinicalData>({
    age: 0,
    gender: 0,
    smokingHistory: 0,
    chronicCough: 0,
    shortnessOfBreath: 0,
    chestPain: 0
  });
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingAlgorithm, setProcessingAlgorithm] = useState<string>('');
  
  // Results state
  const [predictionResults, setPredictionResults] = useState<{
    prediction: string | null;
    confidence: number | null;
    imageModelConfidence: number | null;
    clinicalModelConfidence: number | null;
  }>({
    prediction: null,
    confidence: null,
    imageModelConfidence: null,
    clinicalModelConfidence: null
  });

  const handleImageUpload = (file: File, imageUrl: string) => {
    setOriginalImage(imageUrl);
    setProcessedImage(null); // Reset processed image when new image is uploaded
    setCurrentFile(file);
    
    // Reset prediction results when new image is uploaded
    setPredictionResults({
      prediction: null,
      confidence: null,
      imageModelConfidence: null,
      clinicalModelConfidence: null
    });
  };

  const handleClinicalDataChange = (data: ClinicalData) => {
    setClinicalData(data);
  };

  const validateData = (): boolean => {
    if (!originalImage || !currentFile) {
      toast({
        title: "Image Required",
        description: "Please upload a lung scan image to proceed.",
        variant: "destructive"
      });
      return false;
    }

    if (clinicalData.age <= 0) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateData()) return;
    
    try {
      setIsProcessing(true);
      
      // Step 1: Process the image
      setProcessingStage('Processing image');
      setProcessingAlgorithm('Applying Geometric Mean Filter & K-means Clustering');
      const processedImgUrl = await processImage(originalImage!);
      setProcessedImage(processedImgUrl);
      
      // Step 2: Predict from clinical data
      setProcessingStage('Analyzing clinical data');
      setProcessingAlgorithm('Running Ensemble Model (RF, GB, XGBoost)');
      const clinicalPrediction = await predictFromClinicalData(clinicalData);
      
      // Step 3: Predict from image
      setProcessingStage('Analyzing image data');
      setProcessingAlgorithm('Running ANN Model with sigmoid activation');
      const imagePrediction = await predictFromImage(processedImgUrl);
      
      // Step 4: Combine predictions
      setProcessingStage('Finalizing results');
      setProcessingAlgorithm('Combining model predictions');
      const combinedPrediction = combineModelPredictions(imagePrediction, clinicalPrediction);
      
      // Set results
      setPredictionResults({
        prediction: combinedPrediction.finalPrediction,
        confidence: combinedPrediction.confidence,
        imageModelConfidence: imagePrediction.confidence,
        clinicalModelConfidence: clinicalPrediction.confidence
      });
      
      // Complete processing
      setIsProcessing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Lung scan and clinical data have been analyzed.",
      });
      
    } catch (error) {
      console.error('Error during analysis:', error);
      setIsProcessing(false);
      
      toast({
        title: "Analysis Failed",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveReport = () => {
    if (!predictionResults.prediction) return;
    
    const report = generateReport(clinicalData, predictionResults);
    
    // Create a blob and download it
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lung-scan-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Saved",
      description: "The analysis report has been downloaded as a text file.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 px-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-medical-900">Lung Cancer Detection System</h2>
          <p className="text-gray-600 mt-1">
            Upload lung scans and enter clinical data for advanced cancer detection analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ImageUploader onImageUpload={handleImageUpload} />
            <ClinicalDataForm 
              clinicalData={clinicalData} 
              onChange={handleClinicalDataChange} 
            />
            
            <div className="pt-4">
              <Button 
                onClick={handleAnalyze} 
                className="w-full bg-medical-700 hover:bg-medical-800 text-white"
                disabled={isProcessing || !originalImage}
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Microscope className="mr-2 h-4 w-4" />
                    Analyze Lung Scan
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Middle Column */}
          <div className="space-y-6">
            {isProcessing ? (
              <ProcessingLoader 
                text={processingStage} 
                algorithm={processingAlgorithm} 
              />
            ) : (
              <ImageProcessor 
                originalImage={originalImage} 
                processedImage={processedImage} 
              />
            )}
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <PredictionResults 
              isLoading={isProcessing}
              result={predictionResults}
              onSaveReport={handleSaveReport}
            />
            
            {!isProcessing && processedImage && (
              <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <BrainCircuit className="h-4 w-4 mr-2 text-medical-700" />
                  Algorithm Information
                </h3>
                <Separator className="mb-4" />
                <div className="space-y-3 text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-gray-800">Image Processing:</span> Geometric Mean Filter, K-means Clustering
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Image Classification:</span> ANN with Sigmoid Activation
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Clinical Model:</span> Ensemble (RF, GB, XGBoost)
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Data Balancing:</span> SMOTE for Synthetic Sampling
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-medical-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Lung Scan Insight System © 2025 - Advanced Cancer Detection Platform</p>
          <p className="text-xs mt-1 text-medical-300">
            For educational and research purposes only. Not for diagnostic use.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
