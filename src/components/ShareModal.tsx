"use client";

import { QRCodeCanvas } from "qrcode.react";
import { X, Share2, Map as MapIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShareModal({ isOpen, onClose, origin, destination, waypoints }: any) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      const locs = [origin, ...waypoints, destination].filter(x => !!x);
      const enc = locs.map(l => encodeURIComponent(l)).join("/");
      setUrl(`https://www.google.com/maps/dir/${enc}`);
    }
  }, [isOpen, origin, destination, waypoints]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-[var(--shadow-uber-medium)] max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--color-uber-black)]">ルートを共有</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-6 border border-gray-100 p-4 rounded-xl shadow-sm">
          <QRCodeCanvas value={url} size={200} level="L" />
        </div>

        <p className="text-sm text-center text-[var(--color-body-gray)] mb-6">
          スマートフォンのカメラで読み取って、Googleマップアプリでルートを開けます。
        </p>

        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full py-3.5 px-4 bg-[var(--color-uber-black)] text-white font-medium rounded-[var(--radius-full)] hover:bg-[#333] transition-colors"
        >
          <MapIcon size={18} className="mr-2" />
          ブラウザで地図を開く
        </a>
      </div>
    </div>
  );
}
