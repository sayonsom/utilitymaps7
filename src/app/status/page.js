'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import ZoneCheckModal from '@/components/ZoneCheckModal';

const regions = [
  'AT', 'AU-NSW', 'AU-NT', 'AU-QLD', 'AU-SA', 'AU-TAS', 'AU-VIC', 'AU-WA',
  'BA', 'BE', 'BG', 'BR-CS', 'BR-N', 'BR-NE', 'BR-S', 'CH', 'CR', 'CY', 'CZ',
  'DE', 'EE', 'ES', 'FI', 'FR', 'GB', 'GB-NIR', 'GR', 'IE', 'IT', 'KR', 'LT',
  'LU', 'NI', 'NL', 'NO', 'NZ', 'PA', 'PE', 'PL', 'PT', 'RO', 'RS', 'SE', 'SG',
  'SI', 'SK', 'TW', 'UY', 'ZA', 'US-CAL-BANC', 'US-CAL-CISO', 'US-CAL-IID',
  'US-CAL-LDWP', 'US-CAL-TIDC', 'US-CAR-CPLE', 'US-CAR-CPLW', 'US-CAR-DUK',
  'US-CAR-SC', 'US-CAR-YAD', 'US-CENT-SPA', 'US-CENT-SWPP', 'US-FLA-FMPP',
  'US-FLA-FPC', 'US-FLA-FPL', 'US-FLA-GVL', 'US-FLA-HST', 'US-FLA-JEA',
  'US-FLA-SEC', 'US-FLA-TAL', 'US-FLA-TEC', 'US-MIDA-PJM', 'US-MIDW-AECI',
  'US-MIDW-LGEE', 'US-MIDW-MISO', 'US-NE-ISNE', 'US-NW-AVA', 'US-NW-BPAT',
  'US-NW-CHPD', 'US-NW-DOPD', 'US-NW-GCPD', 'US-NW-GRID', 'US-NW-IPCO',
  'US-NW-NEVP', 'US-NW-NWMT', 'US-NW-PACE', 'US-NW-PACW', 'US-NW-PGE',
  'US-NW-PSCO', 'US-NW-PSEI', 'US-NW-SCL', 'US-NW-TPWR', 'US-NW-WACM',
  'US-NW-WAUW', 'US-NY-NYIS', 'US-SE-SEPA', 'US-SE-SOCO', 'US-SW-AZPS',
  'US-SW-EPE', 'US-SW-PNM', 'US-SW-SRP', 'US-SW-TEPC', 'US-SW-WALC',
  'US-TEN-TVA', 'US-TEX-ERCO', 'ES-CE', 'ES-CN-FV', 'ES-CN-GC', 'ES-CN-HI',
  'ES-CN-IG', 'ES-CN-LP', 'ES-CN-LZ', 'ES-CN-TE', 'ES-IB-FO', 'ES-IB-IZ',
  'ES-IB-MA', 'ES-IB-ME', 'ES-ML', 'FR-COR', 'GB-ORK', 'GB-ZET', 'IT-CNO',
  'IT-CSO', 'IT-NO', 'IT-SAR', 'IT-SIC', 'IT-SO', 'NO-NO1', 'NO-NO2', 'NO-NO3',
  'NO-NO4', 'NO-NO5', 'NZ-NZA', 'NZ-NZC', 'NZ-NZST', 'PT-AC', 'PT-MA', 'SE-SE1',
  'SE-SE2', 'SE-SE3', 'SE-SE4', 'AU', 'BR', 'US', 'AU-LH', 'AU-TAS-CBI',
  'AU-TAS-FI', 'AU-TAS-KI', 'AU-WA-RI', 'US-AK', 'US-AK-SEAPA', 'US-HI'
];

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

const BEARER_TOKEN = 'f0f29188-c004-43a0-8cb3-c31e8195ddd5';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentZone, setCurrentZone] = useState('');
  const [results, setResults] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedStage, setSelectedStage] = useState('staging');

  const openModal = () => {
    setIsModalOpen(true);
    setResults(null); // Reset results when opening the modal
  };

  const startCheckAllZones = async (stage) => {
    setSelectedStage(stage);
    setIsChecking(true);
    setProgress(0);
    setResults({
      errors: [],
      zeroes: [],
      values: [],
      histogram: {}
    });

    const totalZones = regions.length;
    let completed = 0;
    let errors = [];
    let zeroes = [];
    let values = [];
    let histogramData = {};

    for (const zone of regions) {
      setCurrentZone(zone);
      try {
        const baseUrl = STAGES[stage].url;
        const encodedBaseUrl = encodeURIComponent(baseUrl);
        
        const response = await fetch(`/api/carbon-intensity?region=${zone}&baseUrl=${encodedBaseUrl}`);
        const data = await response.json();
        
        if (response.ok && data.carbonIntensity !== undefined) {
          const intensity = data.carbonIntensity;
          
          if (intensity === 0) {
            zeroes.push(zone);
          } else {
            values.push({ zone, intensity });
            
            // Update histogram
            const bucket = Math.floor(intensity / 50) * 50;
            histogramData[bucket] = (histogramData[bucket] || 0) + 1;
          }
        } else {
          errors.push({
            zone,
            error: data.error || `HTTP error! status: ${response.status}`
          });
        }
      } catch (error) {
        errors.push({
          zone,
          error: error.message
        });
      }

      // Wait for 0.3 seconds before checking the next zone
      await new Promise(resolve => setTimeout(resolve, 300));
      
      completed++;
      setProgress(Math.round((completed / totalZones) * 100));
    }

    setResults({
      errors,
      zeroes,
      values,
      histogram: histogramData
    });
    
    setIsChecking(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Carbon Intensity Status</h1>
          <Button 
            onClick={openModal} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isChecking}
          >
            All Zone Check
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {regions.map((region) => (
                <Link
                  key={region}
                  href={`/status/${region}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-semibold">{region}</h2>
                  <p className="text-sm text-gray-500">View carbon intensity data</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <ZoneCheckModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          progress={progress}
          currentZone={currentZone}
          results={results}
          isChecking={isChecking}
          onStartCheck={startCheckAllZones}
        />
      )}
    </main>
  );
} 