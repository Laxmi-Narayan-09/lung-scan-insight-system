
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clipboard, Users } from 'lucide-react';

export interface ClinicalData {
  age: number;
  gender: number; // 0 for Female, 1 for Male
  smokingHistory: number; // 0 for No, 1 for Yes
  chronicCough: number; // 0 for No, 1 for Yes
  shortnessOfBreath: number; // 0 for No, 1 for Yes
  chestPain: number; // 0 for No, 1 for Yes
}

interface ClinicalDataFormProps {
  clinicalData: ClinicalData;
  onChange: (data: ClinicalData) => void;
}

const ClinicalDataForm: React.FC<ClinicalDataFormProps> = ({ clinicalData, onChange }) => {
  const handleChange = (field: keyof ClinicalData, value: number) => {
    onChange({ ...clinicalData, [field]: value });
  };
  
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : 0;
    onChange({ ...clinicalData, age: value });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-medical-800">
          <Clipboard className="mr-2 h-5 w-5" />
          Clinical Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                min="0" 
                max="120" 
                value={clinicalData.age || ''} 
                onChange={handleAgeChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup 
                value={clinicalData.gender.toString()} 
                onValueChange={(value) => handleChange('gender', parseInt(value, 10))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female (0)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male (1)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <Label className="block mb-3">Medical History</Label>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="smoking" className="flex-1">Smoking History</Label>
              <Switch 
                id="smoking" 
                checked={clinicalData.smokingHistory === 1} 
                onCheckedChange={(checked) => handleChange('smokingHistory', checked ? 1 : 0)} 
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="cough" className="flex-1">Chronic Cough</Label>
              <Switch 
                id="cough" 
                checked={clinicalData.chronicCough === 1} 
                onCheckedChange={(checked) => handleChange('chronicCough', checked ? 1 : 0)} 
              />
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <Label htmlFor="breath" className="flex-1">Shortness of Breath</Label>
              <Switch 
                id="breath" 
                checked={clinicalData.shortnessOfBreath === 1} 
                onCheckedChange={(checked) => handleChange('shortnessOfBreath', checked ? 1 : 0)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="pain" className="flex-1">Chest Pain</Label>
              <Switch 
                id="pain" 
                checked={clinicalData.chestPain === 1} 
                onCheckedChange={(checked) => handleChange('chestPain', checked ? 1 : 0)} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalDataForm;
