'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import DeploymentStageSelector from './DeploymentStageSelector';

const STAGES = {
  development: {
    name: 'Development',
    url: 'https://carbonaggr-ap04dapnortheast1-ext-1098454081.ap-northeast-1.elb.amazonaws.com'
  },
  staging: {
    name: 'Staging',
    url: 'https://carbonaggr-ap04sapnortheast1-ext-674624425.ap-northeast-1.elb.amazonaws.com'
  },
  acceptance: {
    name: 'Acceptance',
    url: 'https://carbonaggr-ap04aapnortheast1-ext-1272304221.ap-northeast-1.elb.amazonaws.com'
  }
};

export default function RegionStatusPage({ region }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState('development');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = STAGES[selectedStage].url;
        const encodedBaseUrl = encodeURIComponent(baseUrl);
        console.log(`Fetching data for region: ${region} from ${baseUrl}`);
        
        const response = await fetch(`/api/carbon-intensity?region=${region}&baseUrl=${encodedBaseUrl}`);
        const responseData = await response.json();

        if (!response.ok) {
          let errorMessage = responseData.error || `HTTP error! status: ${response.status}`;
          if (responseData.message) {
            errorMessage += `\nMessage: ${responseData.message}`;
          }
          throw new Error(errorMessage);
        }

        if (responseData.error) {
          throw new Error(responseData.error);
        }

        // Log successful response for debugging
        console.log('Successful response:', {
          region,
          baseUrl: STAGES[selectedStage].url,
          data: responseData
        });

        setData(responseData);
        setError(null);
      } catch (err) {
        console.error('Error in RegionStatusPage:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [region, selectedStage]);

  const handleStageChange = (stage) => {
    setSelectedStage(stage);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Carbon Intensity Status - {region}</h1>
          <DeploymentStageSelector 
            selectedStage={selectedStage} 
            onStageChange={handleStageChange} 
          />
        </div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-[125px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Carbon Intensity Status - {region}</h1>
          <DeploymentStageSelector 
            selectedStage={selectedStage} 
            onStageChange={handleStageChange} 
          />
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load data for region {region}
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto whitespace-pre-wrap">
              {error}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Carbon Intensity Status - {region}</h1>
        <DeploymentStageSelector 
          selectedStage={selectedStage} 
          onStageChange={handleStageChange} 
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Carbon Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Intensity Value</p>
              <p className="text-2xl font-bold">{data?.carbonIntensity || 'N/A'} gCO₂eq/kWh</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-2xl font-bold">
                {data?.datetime ? new Date(data.datetime).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Is Estimated</p>
              <p className="text-2xl font-bold">{data?.isEstimated ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data?.forecast && (
        <Card>
          <CardHeader>
            <CardTitle>Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Estimated</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.forecast.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.datetime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.carbonIntensity} gCO₂eq/kWh
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.isEstimated ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 