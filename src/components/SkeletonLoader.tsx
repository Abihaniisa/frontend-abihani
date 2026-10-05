import React from 'react';

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[100dvh] bg-[#0B0B0F] flex flex-col justify-between p-6 animate-pulse select-none">
      <div className="flex justify-between items-center pt-8">
        <div className="w-24 h-5 bg-neutral-800 rounded" />
        <div className="w-32 h-5 bg-neutral-800 rounded" />
        <div className="w-6 h-6 bg-neutral-800 rounded-full" />
      </div>

      <div className="flex justify-between items-end pb-24">
        <div className="space-y-3 w-2/3">
          <div className="w-32 h-4 bg-neutral-800 rounded" />
          <div className="w-48 h-3 bg-neutral-800/60 rounded" />
          <div className="w-36 h-3 bg-neutral-800/40 rounded" />
          <div className="w-28 h-8 bg-neutral-800 rounded-xl" />
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <div className="w-10 h-10 bg-neutral-800 rounded-full" />
          <div className="w-8 h-8 bg-neutral-800 rounded-full" />
          <div className="w-8 h-8 bg-neutral-800 rounded-full" />
          <div className="w-8 h-8 bg-neutral-800 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const OrdersSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4 animate-pulse select-none">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-neutral-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="w-32 h-4 bg-neutral-800 rounded" />
            <div className="w-44 h-3 bg-neutral-800/70 rounded" />
            <div className="w-24 h-3 bg-neutral-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const GridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-1 animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div key={i} className="aspect-square bg-neutral-900" />
      ))}
    </div>
  );
};
