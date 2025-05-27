"use client";

import { GoogleMap } from "./google-map";

import { env } from "@/env.mjs";

interface Property {
  id: string;
  title: string;
  lat: number;
  lng: number;
  price: number;
  type: string;
}

interface PropertyMapProps {
  properties?: Property[];
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  height?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  properties = [],
  center = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  zoom = 12,
  height = "500px",
}) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">Property Locations</h2>
        <p className="text-white/80">
          Explore available properties in your area
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
        <GoogleMap
          apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          center={center}
          zoom={zoom}
          height={height}
        />
      </div>
      {properties.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-white/60">
            Showing {properties.length} properties
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
