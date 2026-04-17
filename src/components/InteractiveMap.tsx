"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { DirectionsComponent } from "./DirectionsComponent";
import type { InteractiveMapProps } from "@/types";

export default function InteractiveMap({
  origin,
  destination,
  waypoints,
  optimizedRoute,
}: InteractiveMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";

  if (!apiKey) {
    return (
      <div className="map-placeholder">
        地図を表示するにはルートディレクトリに .env ファイルを作成し、{" "}
        NEXT_PUBLIC_MAPS_API_KEY を設定してください。
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
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