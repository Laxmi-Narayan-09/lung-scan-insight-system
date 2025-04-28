
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Award, Info, FileOutput } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PredictionResultsProps {
  isLoading: boolean;
  result: {
    prediction: string | null;
    confidence: number | null;
    imageModelConfidence: number | null;
    clinicalModelConfidence: number | null;
  };
  onSaveReport: () => void;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ 
  isLoading, 
  result,
  onSaveReport
}) => {
  const getResultColor = () => {
    if (!result.prediction) return 'bg-gray-200';
    switch (result.prediction) {
      case 'Cancer Detected':
        return 'bg-alert-danger';
      case 'No Cancer Detected':
        return 'bg-alert-success';
      case 'Uncertain, further tests needed':
        return 'bg-alert-warning';
      default:
        return 'bg-gray-200';
    }
  };

  const getResultTextColor = () => {
    if (!result.prediction) return 'text-gray-400';
    switch (result.prediction) {
      case 'Cancer Detected':
        return 'text-alert-danger';
      case 'No Cancer Detected':
        return 'text-alert-success';
      case 'Uncertain, further tests needed':
        return 'text-alert-warning';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-medical-800">
          <FileOutput className="mr-2 h-5 w-5" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-16 w-16 rounded-full border-4 border-medical-200 border-t-medical-600 animate-spin-slow mb-4"></div>
            <p className="text-medical-800 font-medium">Processing Data...</p>
            <p className="text-sm text-gray-500 mt-1">Running ensemble models for accurate prediction</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700">Final Decision</h3>
                <div className={`p-4 rounded-lg ${getResultColor().replace('bg-', 'bg-opacity-10 ')} ${getResultTextColor()} flex items-center`}>
                  {result.prediction ? (
                    <>
                      {result.prediction === 'Cancer Detected' && <AlertCircle className="h-5 w-5 mr-2" />}
                      {result.prediction === 'No Cancer Detected' && <Award className="h-5 w-5 mr-2" />}
                      {result.prediction === 'Uncertain, further tests needed' && <Info className="h-5 w-5 mr-2" />}
                      <span className="font-semibold">{result.prediction}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">No analysis performed yet</span>
                  )}
                </div>
              </div>

              {result.confidence !== null && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Overall Confidence</h3>
                    <span className="text-sm font-semibold">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>
              )}

              {(result.imageModelConfidence !== null || result.clinicalModelConfidence !== null) && (
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  {result.imageModelConfidence !== null && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-600">Image Model</h4>
                      <div className="flex justify-between items-center">
                        <Progress value={result.imageModelConfidence} className="h-2 flex-1" />
                        <span className="text-xs font-medium ml-2">{result.imageModelConfidence}%</span>
                      </div>
                    </div>
                  )}
                  
                  {result.clinicalModelConfidence !== null && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-600">Clinical Model</h4>
                      <div className="flex justify-between items-center">
                        <Progress value={result.clinicalModelConfidence} className="h-2 flex-1" />
                        <span className="text-xs font-medium ml-2">{result.clinicalModelConfidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {result.prediction && (
                <Button 
                  onClick={onSaveReport} 
                  className="w-full mt-4"
                  variant="outline"
                >
                  <FileOutput className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResults;
