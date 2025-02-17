'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TestButton from './TestButton';

const zones = [
  {
    id: 1,
    name: 'SE-SE4',
    lastUpdated: '2024-03-10T15:30:00Z',
    dataQuality: 'Good',
    status: 200,
    isHealthy: true,
  },
  {
    id: 2,
    name: 'SE-SE3',
    lastUpdated: '2024-03-10T14:45:00Z',
    dataQuality: 'Fair',
    status: 200,
    isHealthy: true,
  },
  // Add more zones as needed
];

export default function StatusPage() {
  const [currentUTC, setCurrentUTC] = useState(new Date().toISOString());
  const [currentPage, setCurrentPage] = useState(1);
  const zonesPerPage = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUTC(new Date().toISOString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const indexOfLastZone = currentPage * zonesPerPage;
  const indexOfFirstZone = indexOfLastZone - zonesPerPage;
  const currentZones = zones.slice(indexOfFirstZone, indexOfLastZone);
  const totalPages = Math.ceil(zones.length / zonesPerPage);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Zone Status</h1>
          <p className="mt-2 text-sm text-gray-700">
            Current UTC Time: <span className="font-mono font-semibold">{new Date(currentUTC).toUTCString()}</span>
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="-mx-4 mt-8 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 pr-3 sm:pl-6">Zone Name</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Data Quality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="relative pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentZones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell className="pl-4 pr-3 font-medium text-gray-900 sm:pl-6">
                  {zone.name}
                </TableCell>
                <TableCell>{new Date(zone.lastUpdated).toLocaleString()}</TableCell>
                <TableCell>{zone.dataQuality}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span 
                      className={`h-2.5 w-2.5 rounded-full ${
                        zone.isHealthy ? 'bg-green-500' : 'bg-red-500'
                      }`} 
                    />
                    {zone.status}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <TestButton zoneId={zone.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex-1 text-sm text-gray-700">
          Showing {indexOfFirstZone + 1} to {Math.min(indexOfLastZone, zones.length)} of {zones.length} zones
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 