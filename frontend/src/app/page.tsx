"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import InteractiveMap from "@/components/InteractiveMap";

export default function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([""]);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const validWaypoints = waypoints.filter(w => w.trim() !== "");
      const res = await fetch("/api/route/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination: destination || origin,
          waypoints: validWaypoints,
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      setOptimizedRoute(data);
    } catch (error: any) {
      console.error(error);
      alert("エラーが発生しました: " + error.message);
    } finally {
      setIsOptimizing(false);
    }
  };

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
