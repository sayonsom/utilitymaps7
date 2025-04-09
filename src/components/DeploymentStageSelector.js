'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

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

export default function DeploymentStageSelector({ selectedStage, onStageChange }) {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow">
      <span className="text-sm font-medium text-gray-700">Environment:</span>
      <div className="flex gap-1">
        {Object.entries(STAGES).map(([key, stage]) => (
          <Button
            key={key}
            variant={selectedStage === key ? "default" : "outline"}
            size="sm"
            onClick={() => onStageChange(key)}
            className="min-w-[100px]"
          >
            {stage.name}
          </Button>
        ))}
      </div>
    </div>
  );
} 