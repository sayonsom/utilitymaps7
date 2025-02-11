import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/zones.geojson');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const rawData = JSON.parse(jsonData);

    // Create a GeoJSON FeatureCollection from the convexhulls
    const geojsonData = {
      type: "FeatureCollection",
      features: rawData.convexhulls || []
    };

    // const geojsonData = {
    //     "type": "FeatureCollection",
    //     "features": [
    //       {
    //         "type": "Feature",
    //         "properties": {
    //           "zoneName": "SE-SE4",
    //           "countryKey": "SE",
    //           "countryName": "Sweden"
    //         },
    //         "geometry": {
    //           "type": "Polygon",
    //           "coordinates": [
    //             [
    //               [12.5047, 56.2747],
    //               [12.3523, 56.9939],
    //               [12.646, 57.2159],
    //               [13.057, 57.3794],
    //               [13.7167, 57.4616],
    //               [13.8943, 57.4663],
    //               [15.8606, 57.4652],
    //               [16.39, 57.367],
    //               [16.563, 57.3237],
    //               [16.5645, 57.3233],
    //               [16.5836, 57.0446],
    //               [16.04, 56.2546],
    //               [15.8528, 56.0858],
    //               [14.1823, 55.3902],
    //               [13.2787, 55.3459],
    //               [12.9582, 55.4027],
    //               [12.5047, 56.2747]  // Close the polygon by repeating first point
    //             ]
    //           ]
    //         }
    //       },
    //       {
    //         "type": "Feature",
    //         "properties": {
    //           "zoneName": "SE-SE4",
    //           "countryKey": "SE",
    //           "countryName": "Sweden"
    //         },
    //         "geometry": {
    //           "type": "Polygon",
    //           "coordinates": [
    //             [
    //               [16.4167, 56.2072],
    //               [16.3778, 56.4701],
    //               [16.5735, 56.8198],
    //               [17.0334, 57.3303],
    //               [17.1997, 57.3778],
    //               [16.4167, 56.2072]  // Close the polygon by repeating first point
    //             ]
    //           ]
    //         }
    //       }
    //     ]
    //   };
    
    return NextResponse.json(geojsonData);
  } catch (error) {
    console.error('Error processing GeoJSON:', error);
    return NextResponse.json(
      { error: 'Failed to load GeoJSON data' }, 
      { status: 500 }
    );
  }
}

const getUpdatedGeoJSON = () => {
  if (!zoneData || !Object.keys(statusData).length) return null;

  return {
    ...zoneData,
    features: zoneData.features.map(feature => {
      const zoneStatus = statusData[feature.properties.zoneName];
      return {
        ...feature,
        properties: {
          ...feature.properties,
          status: zoneStatus?.Status || 'Not Available'
        }
      };
    })
  };
};