"use client";

import { useState, useCallback } from "react";
import type { OptimizedRoute } from "@/types";

interface UseRouteOptimizerReturn {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  waypoints: string[];
  setWaypoints: (value: string[]) => void;
  optimizedRoute: OptimizedRoute | null;
  setOptimizedRoute: (route: OptimizedRoute | null) => void;
  isOptimizing: boolean;
  isOptimizingRoute: () => Promise<void>;
  addWaypoint: () => void;
  removeWaypoint: (index: number) => void;
  updateWaypoint: (index: number, value: string) => void;
  clearAll: () => void;
  loadSampleData: () => void;
  getRouteSummary: () => { distance: string; duration: string } | null;
}

export function useRouteOptimizer(): UseRouteOptimizerReturn {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState<string[]>([""]);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const isSameAsStart = !destination;

  const addWaypoint = useCallback(() => {
    setWaypoints((prev) => [...prev, ""]);
  }, []);

  const removeWaypoint = useCallback((index: number) => {
    setWaypoints((prev) => {
      const newWp = [...prev];
      newWp.splice(index, 1);
      return newWp.length > 0 ? newWp : [""];
    });
  }, []);

  const updateWaypoint = useCallback((index: number, value: string) => {
    setWaypoints((prev) => {
      const newWp = [...prev];
      newWp[index] = value;
      return newWp;
    });
  }, []);

  const clearAll = useCallback(() => {
    setOrigin("");
    setDestination("");
    setWaypoints([""]);
    setOptimizedRoute(null);
  }, []);

  const loadSampleData = useCallback(() => {
    setOrigin("東京駅");
    setDestination("東京駅");
    setWaypoints(["皇居", "東京タワー", "浅草寺"]);
    setOptimizedRoute(null);
  }, []);

  const isOptimizingRoute = useCallback(async () => {
    setIsOptimizing(true);
    try {
      const validWaypoints = waypoints.filter((w) => w.trim() !== "");
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
      const data: OptimizedRoute = await res.json();
      setOptimizedRoute(data);
    } catch (error) {
      console.error(error);
      alert(`エラーが発生しました: ${error instanceof Error ? error.message : "不明"}`);
    } finally {
      setIsOptimizing(false);
    }
  }, [origin, destination, waypoints]);

  const getRouteSummary = useCallback((): { distance: string; duration: string } | null => {
    if (!optimizedRoute) return null;
    const hours = Math.floor(optimizedRoute.total_duration_min / 60);
    const mins = optimizedRoute.total_duration_min % 60;
    return {
      distance: `${optimizedRoute.total_distance_km.toFixed(1)} km`,
      duration: hours > 0 ? `${hours}時間${mins}分` : `${mins}分`,
    };
  }, [optimizedRoute]);

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    waypoints,
    setWaypoints,
    optimizedRoute,
    setOptimizedRoute,
    isOptimizing,
    isOptimizingRoute,
    addWaypoint,
    removeWaypoint,
    updateWaypoint,
    clearAll,
    loadSampleData,
    getRouteSummary,
  };
}