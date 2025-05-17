
import React from "react";

export default function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 mb-12">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-60 glass card-radius shadow-card animate-pulse-skel bg-gray-100 dark:bg-slate-800"
        >
          <div className="h-8 w-1/3 mb-2 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-4 w-2/3 mb-1 bg-slate-300 dark:bg-slate-800 rounded" />
          <div className="h-6 w-1/2 mb-2 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-1/4 mb-2 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-6 w-20 bg-slate-300 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
