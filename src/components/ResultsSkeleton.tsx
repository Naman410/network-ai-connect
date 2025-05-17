
import React from "react";

export default function ResultsSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 mb-12 px-4 sm:px-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-[320px] glass card-radius shadow-card animate-pulse-skel bg-gray-100 dark:bg-slate-800 flex flex-col p-4"
          >
            <div className="h-6 w-1/2 mb-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-2/3 mb-4 bg-slate-300 dark:bg-slate-800 rounded" />
            <div className="h-4 w-1/3 mb-4 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="flex gap-1 mb-4">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="h-6 w-20 bg-slate-300 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded mb-auto" />
            <div className="flex flex-col gap-2 mt-auto">
              <div className="h-10 bg-slate-300 dark:bg-slate-800 rounded" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
