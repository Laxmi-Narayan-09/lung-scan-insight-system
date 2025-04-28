
/**
 * Mock utility functions to simulate image processing and ML predictions
 * In a real system, these would be API calls to a backend service
 */

// Simulate image processing with K-means clustering and Geometric Mean Filter
export const processImage = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    // In a real application, this would send the image to a backend for processing
    // We're simulating the processing by adding a red overlay to parts of the image
    
    // Simulates loading and processing time
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Simulate K-means clustering by adding red highlights to random regions
          // This is just a visual simulation - real K-means would actually segment the image
          const numRegions = Math.floor(Math.random() * 3) + 1; // 1-3 regions
          
          ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
          for (let i = 0; i < numRegions; i++) {
            const x = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
            const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.2;
            const radius = Math.random() * 40 + 20;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
          
          resolve(canvas.toDataURL('image/png'));
        } else {
          // Fallback if canvas context is not available
          resolve(imageUrl);
        }
      };
      
      img.src = imageUrl;
    }, 2000); // Simulate 2-second processing time
  });
};

export interface ClinicalData {
  age: number;
  gender: number;
  smokingHistory: number;
  chronicCough: number;
  shortnessOfBreath: number;
  chestPain: number;
}

// Mock function to predict cancer based on clinical data
export const predictFromClinicalData = (data: ClinicalData): Promise<{ 
  prediction: boolean; 
  confidence: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Very simplified risk assessment (in a real app this would use the trained model)
      let risk = 0;
      
      // Age risk (higher age = higher risk)
      if (data.age > 60) risk += 25;
      else if (data.age > 50) risk += 15;
      else if (data.age > 40) risk += 10;
      
      // Smoking is a major risk factor
      if (data.smokingHistory === 1) risk += 30;
      
      // Symptoms increase risk
      if (data.chronicCough === 1) risk += 15;
      if (data.shortnessOfBreath === 1) risk += 15;
      if (data.chestPain === 1) risk += 15;
      
      // Gender risk (slightly higher for males historically)
      if (data.gender === 1) risk += 5;
      
      // Calculate prediction and confidence
      const prediction = risk >= 50;
      const confidence = prediction ? risk : 100 - risk;
      
      resolve({ prediction, confidence });
    }, 1500); // Simulate processing time
  });
};

// Mock function to predict cancer from image data
export const predictFromImage = (processedImageUrl: string): Promise<{
  prediction: boolean;
  confidence: number;
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real system, this would send the processed image to an ANN model
      // For this demo, we'll base the prediction on the amount of red in the processed image
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Count red pixels in the image (this is a very simplified approach)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let redPixelsCount = 0;
          for (let i = 0; i < data.length; i += 4) {
            // Check if pixel has red component (r > g and r > b significantly)
            if (data[i] > data[i + 1] + 20 && data[i] > data[i + 2] + 20) {
              redPixelsCount++;
            }
          }
          
          // Calculate percentage of red pixels (simplified cancer indicator)
          const totalPixels = canvas.width * canvas.height;
          const redPercentage = (redPixelsCount / totalPixels) * 100;
          
          // Make prediction based on red percentage
          const prediction = redPercentage > 1; // If more than 1% is red, predict cancer
          const confidence = prediction ? 
            Math.min(50 + redPercentage * 5, 95) : // 50-95% confidence if cancer predicted
            Math.min(50 + (10 - redPercentage) * 5, 95); // 50-95% if no cancer predicted
          
          resolve({ prediction, confidence: Math.round(confidence) });
        } else {
          // Fallback random prediction if canvas context is not available
          resolve({ 
            prediction: Math.random() > 0.5, 
            confidence: Math.round(Math.random() * 30 + 65)
          });
        }
      };
      
      img.src = processedImageUrl;
    }, 2000); // Simulate 2-second processing time
  });
};

// Combine predictions from both models
export const combineModelPredictions = (
  imagePrediction: { prediction: boolean; confidence: number },
  clinicalPrediction: { prediction: boolean; confidence: number }
): {
  finalPrediction: string;
  confidence: number;
} => {
  // If both models agree
  if (imagePrediction.prediction === clinicalPrediction.prediction) {
    const finalPrediction = imagePrediction.prediction ? 
      'Cancer Detected' : 
      'No Cancer Detected';
    
    // Average confidence when models agree
    const confidence = Math.round((imagePrediction.confidence + clinicalPrediction.confidence) / 2);
    
    return { finalPrediction, confidence };
  } 
  // If models disagree
  else {
    // Weighted confidence (which model are we more confident in?)
    const imageConfidenceWeight = imagePrediction.confidence / 100;
    const clinicalConfidenceWeight = clinicalPrediction.confidence / 100;
    
    // If confidence difference is large, trust the more confident model
    const confidenceDifference = Math.abs(imagePrediction.confidence - clinicalPrediction.confidence);
    
    if (confidenceDifference > 30) {
      // Trust the model with higher confidence
      if (imagePrediction.confidence > clinicalPrediction.confidence) {
        return {
          finalPrediction: imagePrediction.prediction ? 'Cancer Detected' : 'No Cancer Detected',
          confidence: imagePrediction.confidence - 10 // Slightly reduce confidence due to disagreement
        };
      } else {
        return {
          finalPrediction: clinicalPrediction.prediction ? 'Cancer Detected' : 'No Cancer Detected',
          confidence: clinicalPrediction.confidence - 10
        };
      }
    } else {
      // Models disagree without clear winner - inconclusive
      return {
        finalPrediction: 'Uncertain, further tests needed',
        confidence: Math.round(50 + confidenceDifference / 4) // Higher confidence in uncertainty with larger disagreement
      };
    }
  }
};

// Generate a simple text report
export const generateReport = (
  clinicalData: ClinicalData,
  results: {
    prediction: string | null;
    confidence: number | null;
    imageModelConfidence: number | null;
    clinicalModelConfidence: number | null;
  }
): string => {
  if (!results.prediction || !results.confidence) {
    return "No analysis has been performed yet.";
  }

  const timestamp = new Date().toLocaleString();
  
  return `
LUNG SCAN INSIGHT SYSTEM - ANALYSIS REPORT
==========================================
Generated: ${timestamp}

PATIENT DATA:
------------
Age: ${clinicalData.age}
Gender: ${clinicalData.gender === 0 ? 'Female' : 'Male'}
Smoking History: ${clinicalData.smokingHistory === 1 ? 'Yes' : 'No'}
Symptoms:
- Chronic Cough: ${clinicalData.chronicCough === 1 ? 'Yes' : 'No'}
- Shortness of Breath: ${clinicalData.shortnessOfBreath === 1 ? 'Yes' : 'No'}
- Chest Pain: ${clinicalData.chestPain === 1 ? 'Yes' : 'No'}

ANALYSIS RESULTS:
----------------
Final Decision: ${results.prediction}
Confidence: ${results.confidence}%

MODEL DETAILS:
-------------
Image Analysis Confidence: ${results.imageModelConfidence}%
Clinical Data Model Confidence: ${results.clinicalModelConfidence}%

RECOMMENDATION:
--------------
${results.prediction === 'Cancer Detected' 
  ? 'Immediate follow-up with specialist recommended.'
  : results.prediction === 'No Cancer Detected'
    ? 'Regular screening recommended as per standard guidelines.'
    : 'Additional diagnostic tests recommended for conclusive diagnosis.'}

This is an automated analysis and should be reviewed by a healthcare professional.
==========================================
  `;
};
