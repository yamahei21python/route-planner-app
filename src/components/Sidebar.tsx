"use client";

import { useState } from "react";
import { Plus, X, Trash2, Share2 } from "lucide-react";
import RouteList from "./RouteList";
import ShareModal from "./ShareModal";

export default function Sidebar({
  origin, setOrigin,
  destination, setDestination,
  waypoints, setWaypoints,
  onOptimize, isOptimizing,
  optimizedRoute, setOptimizedRoute
}: any) {

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const addWaypoint = () => setWaypoints([...waypoints, ""]);
  const removeWaypoint = (index: number) => {
    const newWp = [...waypoints];
    newWp.splice(index, 1);
    setWaypoints(newWp);
  };
  const updateWaypoint = (index: number, val: string) => {
    const newWp = [...waypoints];
    newWp[index] = val;
    setWaypoints(newWp);
  };

  const isSameAsStart = !destination;

  // サンプルデータのロード
  const loadSampleData = () => {
    setOrigin("東京駅");
    setDestination("東京駅");
    setWaypoints(["皇居", "東京タワー", "浅草寺"]);
    if (setOptimizedRoute) setOptimizedRoute(null);
  };

  return (
    <div className="w-[380px] bg-white h-full shadow-[var(--shadow-uber-medium)] z-10 flex flex-col pt-6 flex-shrink-0 relative font-sans">

      {/* Header */}
      <div className="px-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter text-[var(--color-uber-black)]">Best Route</h1>
          <button
            onClick={loadSampleData}
            className="text-[10px] font-bold bg-[var(--color-chip-gray)] px-2.5 py-1 rounded-full hover:bg-[var(--color-hover-gray)] transition-colors"
          >
            サンプル
          </button>
        </div>
        <p className="text-[var(--color-body-gray)] text-sm mt-1">複数の訪問先を最も効率よく回る</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

        {/* Origin & Destination */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">出発地</label>
            <input
              className="w-full border border-[var(--color-uber-black)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
              placeholder="例：東京駅"
              value={origin}
              onChange={e => setOrigin(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="same_as_start"
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              checked={isSameAsStart}
              onChange={() => setDestination(isSameAsStart ? origin : "")}
            />
            <label htmlFor="same_as_start" className="text-sm cursor-pointer select-none">
              出発地と帰着地は同じ
            </label>
          </div>

          {!isSameAsStart && (
            <div>
              <label className="block text-sm font-medium mb-1">帰着地</label>
              <input
                className="w-full border border-[var(--color-uber-black)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                placeholder="例：新宿駅"
                value={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Waypoints */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">目的地</label>
          {waypoints.map((wp: string, idx: number) => (
            <div key={idx} className="flex space-x-2 items-center">
              <input
                className="flex-1 border border-[var(--color-uber-black)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 focus:bg-white transition-colors"
                placeholder={`目的地 ${idx + 1}`}
                value={wp}
                onChange={e => updateWaypoint(idx, e.target.value)}
              />
              <button
                onClick={() => removeWaypoint(idx)}
                className="p-2.5 rounded-full hover:bg-[var(--color-chip-gray)] text-gray-500 hover:text-black transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={addWaypoint}
            className="w-full text-left py-2 px-3 text-sm font-medium flex items-center hover:bg-[var(--color-hover-light)] rounded-lg transition-colors"
          >
            <Plus size={16} className="mr-2" />
            目的地を追加
          </button>
        </div>

        {/* Search Action */}
        <div className="pt-4 border-t border-gray-100 pb-2">
          <button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="w-full bg-[var(--color-uber-black)] text-white font-bold py-3.5 px-4 rounded-[var(--radius-full)] hover:bg-[#333] transition-colors disabled:opacity-50 flex justify-center items-center shadow-[var(--shadow-uber-floating)] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none"
          >
            {isOptimizing ? "最適化中..." : "最高効率のルートを検索"}
          </button>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => {
                setOrigin(""); setDestination(""); setWaypoints([""]); setOptimizedRoute(null);
              }}
              className="flex-1 bg-white text-[var(--color-uber-black)] border border-gray-200 font-medium py-2.5 px-4 rounded-[var(--radius-full)] hover:bg-[var(--color-hover-gray)] transition-colors flex justify-center items-center"
            >
              <Trash2 size={16} className="mr-2" />
              クリア
            </button>
            {optimizedRoute && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 bg-[var(--color-chip-gray)] text-[var(--color-uber-black)] font-medium py-2.5 px-4 rounded-[var(--radius-full)] hover:bg-[#e0e0e0] transition-colors flex justify-center items-center"
              >
                <Share2 size={16} className="mr-2" />
                共有
              </button>
            )}
          </div>
        </div>

        {/* Optimize Results */}
        {optimizedRoute && (
          <>
            <div className="bg-gradient-to-br from-[var(--color-hover-light)] to-[var(--color-chip-gray)] rounded-xl p-4 mt-8 space-y-3 shadow-inner">
              <h3 className="font-bold text-[var(--color-uber-black)]">サマリー</h3>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-body-gray)]">総移動距離</span>
                <span className="font-medium text-[var(--color-uber-black)]">{optimizedRoute.total_distance_km.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-body-gray)]">総所要時間</span>
                <span className="font-medium text-[var(--color-uber-black)]">{Math.floor(optimizedRoute.total_duration_min / 60)}時間 {optimizedRoute.total_duration_min % 60}分</span>
              </div>
            </div>

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
    </div>
  );
}
