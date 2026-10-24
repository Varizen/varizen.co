"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { AiBrowserModal } from "./aibrowser-modal";

export function AiBrowserTrigger() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="button button-small border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 flex items-center gap-1.5 transition-all text-xs px-2.5 py-1.5 rounded-lg cursor-pointer"
        title="Launch AiBrowser popup simulator or download"
      >
        <Eye size={14} className="text-emerald-400" />
        <span className="font-medium">AiBrowser</span>
      </button>

      <AiBrowserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
