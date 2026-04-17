"use client";

import { useRouteOptimizer } from "@/hooks/useRouteOptimizer";
import Sidebar from "@/components/Sidebar";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    waypoints,
    setWaypoints,
    optimizedRoute,
    setOptimizedRoute,
    isOptimizing,
    isOptimizingRoute: handleOptimize,
  } = useRouteOptimizer();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--color-uber-white)] text-[var(--color-uber-black)]">
      <Sidebar 
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        waypoints={waypoints}
        setWaypoints={setWaypoints}
        onOptimize={handleOptimize}
        isOptimizing={isOptimizing}
        optimizedRoute={optimizedRoute}
        setOptimizedRoute={setOptimizedRoute}
      />
      
      <div className="flex-1 relative bg-gray-100">
        <InteractiveMap 
          origin={origin} 
          destination={destination || origin} 
          waypoints={waypoints}
          optimizedRoute={optimizedRoute}
        />
      </div>
    </div>
  );
}