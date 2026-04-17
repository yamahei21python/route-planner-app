"use client";

import { QRCodeCanvas } from "qrcode.react";
import { X, Share2, Map as MapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ShareModalProps } from "@/types";

export default function ShareModal({
  isOpen,
  onClose,
  origin,
  destination,
  waypoints,
}: ShareModalProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      const locs = [origin, ...waypoints, destination].filter((x) => !!x);
      const enc = locs.map((l) => encodeURIComponent(l)).join("/");
      setUrl(`https://www.google.com/maps/dir/${enc}`);
    }
  }, [isOpen, origin, destination, waypoints]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">ルートを共有</h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-qr-container">
          <QRCodeCanvas value={url} size={200} level="L" />
        </div>

        <p className="modal-description">
          スマートフォンのカメラで読み取って、Googleマップアプリでルートを開けます。
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="modal-action-btn"
        >
          <MapIcon size={18} className="mr-2" />
          ブラウザで地図を開く
        </a>
      </div>
    </div>
  );
}