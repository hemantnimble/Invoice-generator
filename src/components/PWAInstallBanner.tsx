"use client";

import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X, Smartphone } from "lucide-react";

export default function PWAInstallBanner() {
  const { installEvent, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if installed or dismissed
  if (isInstalled || dismissed) return null;

  // Android/Desktop — native prompt available
  if (installEvent) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-indigo-600 text-white rounded-2xl shadow-xl p-4 z-50 flex items-start gap-3">
        <div className="bg-white/20 rounded-xl p-2 shrink-0">
          <Smartphone size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Install Villa Invoice</p>
          <p className="text-xs text-indigo-200 mt-0.5">
            Add to home screen for quick access, works offline too
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={install}
              className="bg-white text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              Install
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-indigo-200 text-xs px-2 py-1.5 hover:text-white transition"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-indigo-200 hover:text-white transition shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  // iOS — manual instruction
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white rounded-2xl shadow-xl p-4 z-50 flex items-start gap-3">
        <div className="bg-white/10 rounded-xl p-2 shrink-0">
          <Download size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Install Villa Invoice</p>
          <p className="text-xs text-gray-300 mt-1">
            Tap the <span className="font-bold">Share</span> button then{" "}
            <span className="font-bold">Add to Home Screen</span>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-white transition shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return null;
}