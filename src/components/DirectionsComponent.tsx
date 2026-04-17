"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import type { OptimizedRoute } from "@/types";

interface DirectionsComponentProps {
  origin: string;
  destination: string;
  waypoints: string[];
  optimizedRoute: OptimizedRoute | null;
}

export function DirectionsComponent({
  origin,
  destination,
  waypoints,
  optimizedRoute,
}: DirectionsComponentProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  // Initialize Directions service and renderer
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

  // Handle route updates
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination) return;

    const listToRoute = optimizedRoute?.optimized_waypoints || waypoints;
    const wp = listToRoute
      .filter((w: string) => w.trim() !== "")
      .map((w: string) => ({ location: w, stopover: true }));

    if (!origin.trim() && wp.length === 0) return;

    directionsService
      .route({
        origin,
        destination,
        waypoints: wp,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => directionsRenderer.setDirections(response))
      .catch((e) => console.warn("Directions request failed", e));
  }, [directionsService, directionsRenderer, origin, destination, waypoints, optimizedRoute]);

  return null;
}