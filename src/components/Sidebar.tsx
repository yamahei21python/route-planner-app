"use client";

import { useState } from "react";
import { Plus, X, Trash2, Share2 } from "lucide-react";
import RouteList from "./RouteList";
import ShareModal from "./ShareModal";
import type { SidebarProps } from "@/types";

export default function Sidebar({
  origin,
  setOrigin,
  destination,
  setDestination,
  waypoints,
  setWaypoints,
  onOptimize,
  isOptimizing,
  optimizedRoute,
  setOptimizedRoute,
}: SidebarProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isSameAsStart = !destination;

  const addWaypoint = () => setWaypoints([...waypoints, ""]);

  const removeWaypoint = (index: number) => {
    const newWp = [...waypoints];
    newWp.splice(index, 1);
    setWaypoints(newWp.length > 0 ? newWp : [""]);
  };

  const updateWaypoint = (index: number, val: string) => {
    const newWp = [...waypoints];
    newWp[index] = val;
    setWaypoints(newWp);
  };

  const loadSampleData = () => {
    setOrigin("東京駅");
    setDestination("東京駅");
    setWaypoints(["皇居", "東京タワー", "浅草寺"]);
    if (setOptimizedRoute) setOptimizedRoute(null);
  };

  const clearAll = () => {
    setOrigin("");
    setDestination("");
    setWaypoints([""]);
    if (setOptimizedRoute) setOptimizedRoute(null);
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1 className="sidebar-title">Best Route</h1>
        <button onClick={loadSampleData} className="btn-sample">
          サンプル
        </button>
      </header>

      <div className="sidebar-content">
        <section className="form-section">
          <div className="form-group">
            <label className="form-label">出発地</label>
            <input
              className="form-input"
              placeholder="例：東京駅"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="same_as_start"
              className="checkbox-input"
              checked={isSameAsStart}
              onChange={() => setDestination(isSameAsStart ? origin : "")}
            />
            <label htmlFor="same_as_start" className="checkbox-label">
              出発地と帰着地は同じ
            </label>
          </div>

          {!isSameAsStart && (
            <div className="form-group">
              <label className="form-label">帰着地</label>
              <input
                className="form-input"
                placeholder="例：新宿駅"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <label className="form-label">目的地</label>
          {waypoints.map((wp: string, idx: number) => (
            <div key={idx} className="waypoint-row">
              <input
                className="form-input waypoint-input"
                placeholder={`目的地 ${idx + 1}`}
                value={wp}
                onChange={(e) => updateWaypoint(idx, e.target.value)}
              />
              <button
                onClick={() => removeWaypoint(idx)}
                className="btn-icon"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button onClick={addWaypoint} className="btn-add-waypoint">
            <Plus size={16} className="mr-2" />
            目的地を追加
          </button>
        </section>

        <section className="action-section">
          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="btn-primary"
          >
            {isOptimizing ? "最適化中..." : "ルート最適化"}
          </button>

          <div className="action-buttons-row">
            <button onClick={clearAll} className="btn-secondary">
              <Trash2 size={16} className="mr-2" />
              クリア
            </button>
            {optimizedRoute && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="btn-secondary"
              >
                <Share2 size={16} className="mr-2" />
                共有
              </button>
            )}
          </div>
        </section>

        {optimizedRoute && (
          <>
            <section className="summary-section">
              <h3 className="summary-title">サマリー</h3>
              <div className="summary-row">
                <span className="summary-label">総移動距離</span>
                <span className="summary-value">{optimizedRoute.total_distance_km.toFixed(1)} km</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">総所要時間</span>
                <span className="summary-value">
                  {Math.floor(optimizedRoute.total_duration_min / 60)}時間{" "}
                  {optimizedRoute.total_duration_min % 60}分
                </span>
              </div>
            </section>

            <RouteList
              optimizedRoute={optimizedRoute}
              setOptimizedRoute={setOptimizedRoute}
              origin={origin}
              destination={destination || origin}
            />
          </>
        )}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        origin={origin}
        destination={destination || origin}
        waypoints={optimizedRoute ? optimizedRoute.optimized_waypoints : waypoints}
      />
    </aside>
  );
}