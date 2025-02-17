'use client';
import { useState } from 'react';

const QueryBuilder = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [dbInfo, setDbInfo] = useState({
    url: 'localhost:5432/database',
    location: 'US-East',
    totalSize: '1.2 GB',
    ipAddress: '192.168.1.1'
  });

  const handleQuerySubmit = async () => {
    // TODO: Implement actual query execution
    // This is a placeholder for demonstration
    try {
      // Here you would make an API call to execute the query
      console.log('Executing query:', query);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      {/* Database Information Panel */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-sm font-semibold text-gray-600">DB URL</h3>
            <p className="text-md">{dbInfo.url}</p>
          </div>
          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-sm font-semibold text-gray-600">Location</h3>
            <p className="text-md">{dbInfo.location}</p>
          </div>
          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-sm font-semibold text-gray-600">Total Size</h3>
            <p className="text-md">{dbInfo.totalSize}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600">IP Address</h3>
            <p className="text-md">{dbInfo.ipAddress}</p>
          </div>
        </div>
      </div>

      {/* Query Editor */}
      <div className="mb-6">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
        />
        <button
          onClick={handleQuerySubmit}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Execute Query
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results will appear here
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Results will be populated here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder; 