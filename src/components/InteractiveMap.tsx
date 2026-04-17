"use client";

import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import type { InteractiveMapProps } from "@/types";

const DirectionsComponent = ({
  origin,
  destination,
  waypoints,
  optimizedRoute,
}: InteractiveMapProps) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#000000",
          strokeWeight: 4,
        },
      })
    );
  }, [routesLibrary, map]);

  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !origin ||
      !destination
    )
      return;

    const listToRoute = optimizedRoute
      ? optimizedRoute.optimized_waypoints
      : waypoints;
    const wp = listToRoute
      .filter((w: string) => w.trim() !== "")
      .map((w: string) => ({
        location: w,
        stopover: true,
      }));

    if (!origin.trim() && wp.length === 0) return;

    directionsService
      .route({
        origin,
        destination,
        waypoints: wp,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => {
        console.warn("Directions request failed", e);
      });
  }, [
    directionsService,
    directionsRenderer,
    origin,
    destination,
    waypoints,
    optimizedRoute,
  ]);

  return null;
};

export default function InteractiveMap({
  origin,
  destination,
  waypoints,
  optimizedRoute,
}: InteractiveMapProps) {
  const API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";

  if (!API_KEY) {
    return (
      <div className="map-placeholder">
        地図を表示するにはルートディレクトリに .env ファイルを作成し、{" "}
        NEXT_PUBLIC_MAPS_API_KEY を設定してください。
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        defaultCenter={{ lat: 35.6812, lng: 139.7671 }}
        defaultZoom={12}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId="DEMO_MAP_ID"
        className="map-container"
      />
      <DirectionsComponent
        origin={origin}
        destination={destination}
        waypoints={waypoints}
        optimizedRoute={optimizedRoute}
      />
    </APIProvider>
  );
}