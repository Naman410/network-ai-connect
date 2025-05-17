
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";

export default function DisclaimerModal({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed inset-0 bg-black/40 z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl glass p-7 max-w-md w-full border">
          <h2 className="text-xl font-bold mb-1">About & Data Disclaimer</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">
            Intro data comes from publicly shared Discord <em>#introductions</em>.<br />
            Want your info removed? Email&nbsp;
            <a href="mailto:optout@supernetwork.ai" className="underline text-accent1">optout@supernetwork.ai</a>
          </p>
          <button
            className="mt-4 px-5 py-2 bg-grayui dark:bg-slate-700 rounded-lg font-medium hover:scale-[1.02] transition-transform"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
