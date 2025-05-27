"use client";

import { useEffect, useRef, useState } from "react";
import { Status, Wrapper } from "@googlemaps/react-wrapper";

// Google Maps component
interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  style: React.CSSProperties;
}

const Map: React.FC<MapProps> = ({ center, zoom, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  return <div ref={ref} style={style} />;
};

// Marker component (exported for potential use in other components)
interface MarkerProps {
  position: google.maps.LatLngLiteral;
  map: google.maps.Map;
  title?: string;
}

export const Marker: React.FC<MarkerProps> = ({ position, map, title }) => {
  useEffect(() => {
    const marker = new google.maps.Marker({
      position,
      map,
      title,
    });

    return () => {
      marker.setMap(null);
    };
  }, [position, map, title]);

  return null;
};

// Main GoogleMap component
interface GoogleMapProps {
  apiKey: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  height?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  center = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  zoom = 10,
  height = "400px",
}) => {
  // Create a custom render function that uses the props
  const customRender = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div
            className="flex items-center justify-center rounded-lg bg-gray-100"
            style={{ height }}
          >
            <div className="text-gray-600">Loading Google Maps...</div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div
            className="flex items-center justify-center rounded-lg bg-red-100"
            style={{ height }}
          >
            <div className="text-red-600">Error loading Google Maps</div>
          </div>
        );
      case Status.SUCCESS:
        return (
          <Map
            center={center}
            zoom={zoom}
            style={{ height, width: "100%", borderRadius: "8px" }}
          />
        );
    }
  };

  return (
    <div className="w-full">
      <Wrapper
        apiKey={apiKey}
        render={customRender}
        libraries={["places"]} // Optional: include places library for enhanced functionality
      />
    </div>
  );
};

export default GoogleMap;
